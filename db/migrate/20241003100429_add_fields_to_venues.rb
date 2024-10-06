class AddFieldsToVenues < ActiveRecord::Migration[7.1]
  def change
    add_column :venues, :hours, :text
    add_column :venues, :phone, :string
    add_column :venues, :website, :string
  end
end
