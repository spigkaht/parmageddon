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
      Venue.find_or_create_by(
        name: location["name"],
        address: location["vicinity"]
      ) do |venue|
        venue.total_rating_average = 0.0
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
