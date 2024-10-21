class AddNumbersToVenues < ActiveRecord::Migration[7.1]
  def change
    add_column :venues, :latitude, :decimal, precision: 10, scale: 6
    add_column :venues, :longitude, :decimal, precision: 10, scale: 6
    add_column :venues, :total_rating_average, :decimal, precision: 2, scale: 1
    add_column :venues, :chicken_rating_average, :decimal, precision: 2, scale: 1
    add_column :venues, :crumb_rating_average, :decimal, precision: 2, scale: 1
    add_column :venues, :topping_rating_average, :decimal, precision: 2, scale: 1
    add_column :venues, :sides_rating_average, :decimal, precision: 2, scale: 1
    add_column :venues, :venue_rating_average, :decimal, precision: 2, scale: 1
    add_column :venues, :price_average, :decimal, precision: 4, scale: 2
  end
end
