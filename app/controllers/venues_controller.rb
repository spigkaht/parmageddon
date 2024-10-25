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
    name, _, suburb = params[:id].rpartition('-')
    puts "name: #{name}, suburb: #{suburb}"
    @venue = Venue.find_by!(name: name.titleize.strip, suburb: suburb.titleize.strip)

    @rating = Rating.new
  end

  def rate_venue
    name, _, suburb = params[:id].rpartition('-')
    @venue = Venue.find_by!(name: name.titleize.strip, suburb: suburb.titleize.strip)
    @rating = Rating.new

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace('venue-details', partial: 'venues/submit_rating', locals: { venue: @venue, rating: @rating })
      end
      format.html { render partial: 'venues/submit_rating', locals: { venue: @venue, rating: @rating } }
    end
  end
end
