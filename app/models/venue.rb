class Venue < ApplicationRecord
  has_many :ratings, dependent: :destroy

  geocoded_by :address
  after_validation :geocode, if: :will_save_change_to_address?

  def update_rating_averages
    self.total_rating_average = ratings.average(:total_rating)
    self.chicken_rating_average = ratings.average(:chicken_rating)
    self.crumb_rating_average = ratings.average(:crumb_rating)
    self.topping_rating_average = ratings.average(:topping_rating)
    self.sides_rating_average = ratings.average(:sides_rating)
    self.venue_rating_average = ratings.average(:venue_rating)
    self.price_average = ratings.average(:price)
    
    save
  end
end