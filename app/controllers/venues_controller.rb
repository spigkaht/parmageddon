require "cgi"

class VenuesController < ApplicationController
  before_action :set_venue, only: [:show]

  def index
    if params[:select] == "venue"
      @venues = Venue.where("name ILIKE ?", "%#{params[:venue]}%")
    elsif params[:select] == "location"
      @venues = Venue.where("suburb ILIKE :location OR postcode ILIKE :location", location: "%#{params[:location]}%")
    else
      @venues = Venue.all
    end
  end

  def show
    @rating = Rating.new
  end

  private

  def set_venue
    # puts "Received params[:id]: #{params[:id]}"
    @venue = Venue.friendly.find(params[:id])
  end
end
