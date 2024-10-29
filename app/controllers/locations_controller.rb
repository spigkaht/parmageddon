require "net/http"
require "json"
require "uri"

class LocationsController < ApplicationController
  include ActionView::Helpers::NumberHelper
  skip_before_action :verify_authenticity_token, only: [:find_nearby]

  def find_nearby
    # puts "FIND NEARBY METHOD RUNNING"

    latitude = params[:latitude].to_f
    longitude = params[:longitude].to_f
    longitude_variance = 2.5 / (111.32 * Math.cos(latitude * Math::PI / 180))

    uri = URI("https://places.googleapis.com/v1/places:searchText")
    api_key = ENV.fetch("GMAPS_PLACES_KEY")

    places = []
    page_token = nil

    loop do
      request_body = {
        "textQuery": "Pubs",
        "includedType": "bar",
        "locationRestriction": {
          "rectangle": {
            "low": {
              "latitude": latitude - 0.018,
              "longitude": longitude - longitude_variance
            },
            "high": {
              "latitude": latitude + 0.018,
              "longitude": longitude + longitude_variance
            }
          }
        }
      }
      request_body["pageToken"] = page_token if page_token

      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true

      request = Net::HTTP::Post.new(uri.request_uri, {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': api_key,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.addressComponents,places.currentOpeningHours,places.nationalPhoneNumber,places.websiteUri,nextPageToken'
      })

      request.body = request_body.to_json
      # puts "==========REQUEST BODY =========="
      # puts request.body

      response = http.request(request)

      # if response.is_a?(Net::HTTPSuccess)
      #   puts "Success! Status code: #{response.code}"
      # else
      #   puts "Request failed with status code: #{response.code}"
      # end

      # # Response body
      # puts "Response body: #{response.body}"

      # begin
      #   parsed_body = JSON.parse(response.body)
      #   puts "Parsed response: #{parsed_body}"
      # rescue JSON::ParserError
      #   puts "Response is not valid JSON"
      # end

      # # Headers
      # response.each_header do |header, value|
      #   puts "#{header}: #{value}"
      # end

      # puts "========= RESPONSE ============"
      # puts response.body

      parsed_response = JSON.parse(response.body) rescue nil
      if parsed_response.nil?
        puts "Error: Unable to parse response as JSON."
        break
      end

      # puts "======== PARSED RESPONSE ========"
      # puts parsed_response

      places.concat(parsed_response["places"]) if parsed_response["places"]

      page_token = parsed_response["nextPageToken"]
      break if page_token.nil?
    end

    places.each do |place|
      # puts "========= venue details =========="
      # puts place

      venue = Venue.find_or_create_by(places_id: place["id"]) do |v|
        v.name = place.dig('displayName', 'text')
        v.hours = place.dig('currentOpeningHours', 'weekdayDescriptions')
        v.phone = place['nationalPhoneNumber']
        v.website = place['websiteUri']

        address = ""
        address_components = place["addressComponents"]
        address_components.each do |component|
          case component['types'].first
          when "street_number"
            address = address + component['shortText'] + " "
          when "route", "locality"
            address = address + component['shortText'] + ", "
          when "administrative_area_level_1"
            address = address + component['shortText']
          when "postal_code"
            v.postcode = component['shortText']
          end
          v.suburb = component['shortText'] if component['types'].first == "locality"
        end
        v.address = address

        v.total_rating_average = 0.0
        v.chicken_rating_average = 0.0
        v.crumb_rating_average = 0.0
        v.topping_rating_average = 0.0
        v.sides_rating_average = 0.0
        v.venue_rating_average = 0.0
        v.price_average = 0.0
      end

      unless venue.save
        puts "Error saving venue: #{venue.errors.full_messages.join(', ')}"
        render json: { error: "Error saving venue" }, status: :unprocessable_entity
        return
      end
    end

    radius = 3
    @venues = Venue.near([latitude, longitude], radius)

    markers = @venues.map do |venue|
      {
        id: venue.id,
        slug: venue.slug,
        lat: venue.latitude,
        lng: venue.longitude,
        name: venue.name,
        suburb: venue.suburb,
        rating: venue.total_rating_average,
        price: venue.price_average > 0 ? number_to_currency(venue.price_average) : nil
      }
    end

    render json: {
      venues: markers,
      bounds: {
        low_latitude: latitude - 0.018,
        low_longitude: longitude - longitude_variance,
        high_latitude: latitude + 0.018,
        high_longitude: longitude + longitude_variance
      }
    }
  end
end
