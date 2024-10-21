class ChangeAddressOnVenues < ActiveRecord::Migration[7.1]
  def change
    remove_column :venues, :street
    remove_column :venues, :city
    remove_column :venues, :state
    remove_column :venues, :postcode
    add_column :venues, :address, :string
  end
end
