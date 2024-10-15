class AddSuburbToVenues < ActiveRecord::Migration[7.1]
  def change
    add_column :venues, :suburb, :string
  end
end
