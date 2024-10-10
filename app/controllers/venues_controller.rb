class VenuesController < ApplicationController
  def index
    if params[:venue]
      @venues = Venue.where("name LIKE ?", params[:venue])
    elsif params[:location]
      @venues = Venue.where("address LIKE ?", "%" + params[:location] + "%")
    else
      @venues = Venue.all
    end
  end

  def show
    @venue = Venue.find(params[:id])
    @rating = Rating.new

    respond_to do |format|
      format.html # default HTML response for initial page load
      format.turbo_stream do
        case params[:section]
        when 'ratings'
          puts "==================== loading ratings ===================="
          render turbo_stream: turbo_stream.replace("ratings-frame", partial: "venues/ratings", locals: { venue: @venue })
        when 'details'
          puts "==================== loading details ===================="
          render turbo_stream: turbo_stream.replace("details-frame", partial: "venues/details", locals: { venue: @venue })
        when 'submit_rating'
          puts "==================== loading rating submission ===================="
          render turbo_stream: turbo_stream.replace("submit-rating-frame", partial: "venues/submit_rating", locals: { venue: @venue, rating: @rating })
        end
      end
    end
  end
end
