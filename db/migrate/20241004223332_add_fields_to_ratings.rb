class AddFieldsToRatings < ActiveRecord::Migration[7.1]
  def change
    add_column :ratings, :comment, :text
    add_column :ratings, :total_rating, :decimal, precision: 2, scale: 1
    add_column :ratings, :chicken_rating, :decimal, precision: 2, scale: 1
    add_column :ratings, :crumb_rating, :decimal, precision: 2, scale: 1
    add_column :ratings, :topping_rating, :decimal, precision: 2, scale: 1
    add_column :ratings, :sides_rating, :decimal, precision: 2, scale: 1
    add_column :ratings, :venue_rating, :decimal, precision: 2, scale: 1
    add_column :ratings, :price, :decimal, precision: 4, scale: 2
  end
end
