class AddPlacesIdToVenues < ActiveRecord::Migration[7.1]
  def change
    add_column :venues, :places_id, :string
  end
end
