class Rating < ApplicationRecord
  belongs_to :venue

  after_save :update_venue_averages
  after_destroy :update_venue_averages

  private

  def update_venue_averages
    venue.update_rating_averages
  end
end
