class VenuesController < ApplicationController
  def index
    if params[:venue]
      @venues = Venue.where("name LIKE ?", params[:venue])
    elsif params[:location]
      @venues = Venue.where("city LIKE ?", params[:location])
    else
      @venues = Venue.all
    end
  end

  def show
    @venue = Venue.find(params[:id])
  end
end
