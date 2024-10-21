class VenuesController < ApplicationController
  def index
    if params[:venue]
      @venues = Venue.where("name ILIKE ?", "%#{params[:venue]}%")
    elsif params[:location]
      @venues = Venue.where("address ILIKE ?", "%#{params[:location]}%")
    else
      @venues = Venue.all
    end
  end

  def show
    @venue = Venue.find(params[:id])
    @rating = Rating.new
  end
end
