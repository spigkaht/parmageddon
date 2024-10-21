class AddFieldsToContact < ActiveRecord::Migration[7.1]
  def change
    add_column :contacts, :email, :string
    add_column :contacts, :subject, :string
    add_column :contacts, :message, :text
  end
end
