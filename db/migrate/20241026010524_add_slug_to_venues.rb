class AddSlugToVenues < ActiveRecord::Migration[7.1]
  def change
    add_column :venues, :slug, :string
    add_index :venues, :slug, unique: true
  end
end
