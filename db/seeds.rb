# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

require "uri"
require "net/http"
require "json"

puts "clearing out your junk.."
Venue.destroy_all
puts "clean!"

postcodes = ["2000", "2600", "3000", "4000", "5001", "6000", "7000"]

puts "creating venues..."
postcodes.each do |postcode|
  venues = []
  page_token = nil
  queryText = "Pubs"
  type = "bar"

  geo_api_key = ENV.fetch("GMAPS_GEO_API_KEY")
  base_url = "https://maps.googleapis.com/maps/api/geocode/json"

  geo_uri = URI("#{base_url}?address=#{postcode},AU&key=#{geo_api_key}")
  response = Net::HTTP.get(geo_uri)
  data = JSON.parse(response)

  if data['status'] == 'OK'
    location = data['results'][0]['geometry']['location']
    puts "Geolocated #{data['results'][0]['formatted_address']}"
    puts "latitude: #{location['lat']} longitude: #{location['lng']}"
  else
    puts "Geocoding failed: #{data['status']}"
  end

  loop do
    places_api_key = ENV.fetch("GMAPS_PLACES_KEY")
    places_uri = URI("https://places.googleapis.com/v1/places:searchText")

    request_body = {
      "textQuery": queryText,
      "includedType": type,
      "locationBias": {
        "circle": {
          "center": {"latitude": location['lat'], "longitude": location['lng']},
          "radius": 50000.0
        }
      }
    }
    request_body["pageToken"] = page_token if page_token

    http = Net::HTTP.new(places_uri.host, places_uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(places_uri.request_uri, {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': places_api_key,
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

    puts "Found #{parsed_response["places"].count} places"
    puts "Total place count: #{venues.count}"

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

      puts "Added venue #{venue.name} in #{venue.suburb}"
    end
  end

end

puts "... all done!"
