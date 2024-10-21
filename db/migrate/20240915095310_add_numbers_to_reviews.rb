class AddNumbersToReviews < ActiveRecord::Migration[7.1]
  def change
    add_column :reviews, :total_rating, :decimal, precision: 2, scale: 1
    add_column :reviews, :chicken_rating, :decimal, precision: 2, scale: 1
    add_column :reviews, :crumb_rating, :decimal, precision: 2, scale: 1
    add_column :reviews, :topping_rating, :decimal, precision: 2, scale: 1
    add_column :reviews, :sides_rating, :decimal, precision: 2, scale: 1
    add_column :reviews, :venue_rating, :decimal, precision: 2, scale: 1
    add_column :reviews, :price, :decimal, precision: 4, scale: 2
  end
end
