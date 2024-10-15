require "json"

class LocationsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:find_nearby]

  def find_nearby
    latitude = params[:latitude].to_f
    longitude = params[:longitude].to_f

    endpoint = "https://maps.googleapis.com/maps/api"
    api_key = ENV.fetch("GMAPS_API_KEY")
    radius = "7500"
    type = "bar"

    locations_uri = URI("#{endpoint}/place/nearbysearch/json?location=#{latitude},#{longitude}&radius=#{radius}&type=#{type}&key=#{api_key}")
    locations_response = Net::HTTP.get(locations_uri)
    locations_results = JSON.parse(locations_response)["results"]

    locations_results.each do |location|
      venue_uri = URI("#{endpoint}/place/details/json?place_id=#{location["place_id"]}&key=#{api_key}")
      venue_response = Net::HTTP.get(venue_uri)
      venue_results = JSON.parse(venue_response)["result"]

      Venue.find_or_create_by(
        name: location["name"],
        address: location["vicinity"],
        suburb: location["plus_code"]["compound_code"].split(",")[0].split[1..-2].join(" ")
      ) do |venue|
        if venue_results
          venue.hours = venue_results["current_opening_hours"]["weekday_text"] if venue_results["current_opening_hours"]
          venue.phone = venue_results["formatted_phone_number"] if venue_results["formatted_phone_number"]
          venue.website = venue_results["website"] if venue_results["website"]
        end
        venue.total_rating_average = 0.0
        venue.chicken_rating_average = 0.0
        venue.crumb_rating_average = 0.0
        venue.topping_rating_average = 0.0
        venue.sides_rating_average = 0.0
        venue.venue_rating_average = 0.0
        venue.price_average = 0.0
      end
    end

    radius = 7.5
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

    puts "----------------------------markers--------------------------"
    puts markers

    render json: { venues: markers }
  end
end
