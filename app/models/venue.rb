class Venue < ApplicationRecord
  has_many :ratings, dependent: :destroy

  geocoded_by :address
  after_validation :geocode, if: :will_save_change_to_address?
end
