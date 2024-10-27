require "cgi"

class VenuesController < ApplicationController
  before_action :set_venue, only: [:show]

  def index
    if params[:venue]
      @venues = Venue.where("name ILIKE ?", "%#{params[:venue]}%")
    elsif params[:location]
      @venues = Venue.where("address ILIKE ?", "%#{params[:location]}%")
    else
      @venues = Venue.all
    end

    puts "============ VENUES (count: #{@venues.count}) =============="
    puts @venues
  end

  def show
    @rating = Rating.new
  end

  private

  def set_venue
    puts "Received params[:id]: #{params[:id]}"
    @venue = Venue.friendly.find(params[:id])
  end
end
