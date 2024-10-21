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

puts "clearing out your junk.."
Venue.destroy_all
puts "clean!"

endpoint = "https://maps.googleapis.com/maps/api"
api_key = ENV.fetch("GMAPS_API_KEY")
radius = "500000"
type = "bar"




puts "creating venues..."
5.times do |i|
  geocode_uri = URI("#{endpoint}/geocode/json?address=#{postcodes[i]}&key=#{api_key}")
  puts geocode_uri
  geocode_response = Net::HTTP.get(geocode_uri)
  geocode_results = JSON.parse(geocode_response)["results"]

  if geocode_results.any?
    location = geocode_results.first["geometry"]["location"]
    puts location
    latitude = location["lat"]
    longitude = location["lng"]

    locations_uri = URI("#{endpoint}/place/nearbysearch/json?location=#{latitude},#{longitude}&radius=#{radius}&type=#{type}&key=#{api_key}")
    puts locations_uri
    locations_response = Net::HTTP.get(locations_uri)
    locations_results = JSON.parse(locations_response)["results"]

    locations_results.each do |location|
      venue = Venue.new(
        name: location["name"],
        address: location["vicinity"],
        total_rating_average: 0.0,
        price_average: 0.0
      )
      venue.save
      p venue
    end

    puts "location ##{i} done"
  end
end

puts "... all done!"
