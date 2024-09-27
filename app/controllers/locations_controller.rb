class LocationsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:find_nearby]

  def find_nearby
    latitude = params[:latitude].to_f
    longitude = params[:longitude].to_f

    radius = 10
    @venues = Venue.near([latitude, longitude], radius)

    markers = @venues.map do |venue|
      {
        lat: venue.latitude,
        lng: venue.longitude,
        name: venue.name
      }
    end

    puts markers

    render json: { venues: markers }
  end
end
