require "net/http"
require "json"
require "uri"

class LocationsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:find_nearby]

  def find_nearby
    latitude = params[:latitude].to_f
    longitude = params[:longitude].to_f
    # location_details = fetch_location_details(latitude, longitude)

    uri = URI("https://places.googleapis.com/v1/places:searchText")
    api_key = ENV.fetch("GMAPS_PLACES_KEY")

    venues = []
    page_token = nil

    loop do
      request_body = {
        "textQuery": "Pubs",
        "includedType": "bar"
        "locationBias": {
        "circle": {
          "center": {"latitude": latitude, "longitude": longitude},
          "radius": 5000.0
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
      response = http.request(request)

      parsed_response = JSON.parse(response.body) rescue nil
      if parsed_response.nil?
        puts "Error: Unable to parse response as JSON."
        break
      end

      venues.concat(parsed_response["places"]) if parsed_response["places"]

      page_token = parsed_response["nextPageToken"]
      break if page_token.nil?

      sleep(1)
    end

    venues.each do |place|
      venue = Venue.find_by(places_id: place["id"])

      if venue.nil?
        venue = Venue.new(places_id: place["id"])
        venue.total_rating_average = 0.0
        venue.chicken_rating_average = 0.0
        venue.crumb_rating_average = 0.0
        venue.topping_rating_average = 0.0
        venue.sides_rating_average = 0.0
        venue.venue_rating_average = 0.0
        venue.price_average = 0.0

        new_venue = true if venue.new_record?
        venue.save
      end

      if new_venue
        venue.name = place.dig('displayName', 'text')
        venue.hours = place.dig('currentOpeningHours', 'weekdayDescriptions')
        venue.phone = place.dig('nationalPhoneNumber')
        venue.website = place.dig('websiteUri')

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
            venue.postcode = component['shortText']
          end
          venue.suburb = component['shortText'] if component['types'].first == "locality"
        end
        venue.address = address

        unless venue.save
          puts "Error saving venue: #{venue.errors.full_messages.join(', ')}"
          render json: { error: "Error saving venue" }, status: :unprocessable_entity
          return
        end
      end
    end

    radius = 5
    @venues = Venue.near([latitude, longitude], radius)

    markers = @venues.map do |venue|
      {
        id: venue.id,
        lat: venue.latitude,
        lng: venue.longitude,
        name: venue.name,
        rating: venue.total_rating_average
      }
    end

    render json: { venues: markers }
  end

  # private

  # def fetch_location_details(lat, lng)
  #   endpoint = "https://maps.googleapis.com/maps/api/geocode/"
  #   api_key = ENV.fetch('GMAPS_GEO_API_KEY')
  #   uri = URI("#{endpoint}json?latlng=#{lat},#{lng}&key=#{api_key}")

  #   response = Net::HTTP.get(uri)
  #   json = JSON.parse(response)

  #   if json["status"] == "OK"
  #     address_components = json["results"].first["address_components"]

  #     suburb = find_address_component(address_components, "locality")
  #     state = find_address_component(address_components, "administrative_area_level_1")

  #     { suburb: suburb, state: state } if suburb && state
  #   else
  #     nil
  #   end
  # end

  # def find_address_component(components, type)
  #   component = components.find { |comp| comp["types"].include?(type) }
  #   component ? component["long_name"] : nil
  # end
end
