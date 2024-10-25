class RatingsController < ApplicationController
  before_action :set_venue, only: [:new, :create]

  def new
    @rating = Rating.new
  end

  def create
    @rating = Rating.new(rating_params)
    @rating.venue = @venue

    if @rating.save
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace('venue-details', partial: 'venues/submit_rating', locals: { venue: @venue, rating: Rating.new })
          # Trigger a full page reload after submission
          Turbo::StreamsChannel.broadcast_replace_to("venue-details", target: "venue-details", partial: "venues/show", locals: { venue: @venue })
        end
        format.html { redirect_to venue_path(@venue), notice: 'Rating was successfully created.' }
      end
    else
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace('venue-details', partial: 'venues/submit_rating', locals: { venue: @venue, rating: @rating })
        end
        format.html { render :new }
      end
    end
  end

  private

  def set_venue
    name, _, suburb = params[:venue_id].rpartition('-')
    puts "name: #{name}, suburb: #{suburb}"
    @venue = Venue.find_by!(name: name.titleize.strip, suburb: suburb.titleize.strip)
  end

  def rating_params
    params.require(:rating).permit(:comment, :total_rating, :chicken_rating, :crumb_rating, :topping_rating, :sides_rating, :venue_rating, :price)
  end
end
