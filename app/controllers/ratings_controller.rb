class RatingsController < ApplicationController
  before_action :set_venue, only: [:new, :create]

  def new
    @rating = Rating.new
  end

  def create
    @rating = Rating.new(rating_params)
    @rating.venue = @venue

    if @rating.save
      redirect_to venue_path(@venue)
    else
      render :new, status: :unprocessable_entity
    end
  end

  private

  def set_venue
    @venue = Venue.friendly.find(params[:venue_id])
  end

  def rating_params
    params.require(:rating).permit(:comment, :total_rating, :chicken_rating, :crumb_rating, :topping_rating, :sides_rating, :venue_rating, :price)
  end
end
