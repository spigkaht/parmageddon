# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_10_26_010542) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "contacts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email"
    t.string "subject"
    t.text "message"
  end

  create_table "friendly_id_slugs", force: :cascade do |t|
    t.string "slug", null: false
    t.integer "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.string "scope"
    t.datetime "created_at"
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true
    t.index ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type"
    t.index ["sluggable_type", "sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_type_and_sluggable_id"
  end

  create_table "ratings", force: :cascade do |t|
    t.bigint "venue_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "comment"
    t.decimal "total_rating", precision: 2, scale: 1
    t.decimal "chicken_rating", precision: 2, scale: 1
    t.decimal "crumb_rating", precision: 2, scale: 1
    t.decimal "topping_rating", precision: 2, scale: 1
    t.decimal "sides_rating", precision: 2, scale: 1
    t.decimal "venue_rating", precision: 2, scale: 1
    t.decimal "price", precision: 4, scale: 2
    t.index ["venue_id"], name: "index_ratings_on_venue_id"
  end

  create_table "venues", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "latitude", precision: 10, scale: 6
    t.decimal "longitude", precision: 10, scale: 6
    t.decimal "total_rating_average", precision: 2, scale: 1
    t.decimal "chicken_rating_average", precision: 2, scale: 1
    t.decimal "crumb_rating_average", precision: 2, scale: 1
    t.decimal "topping_rating_average", precision: 2, scale: 1
    t.decimal "sides_rating_average", precision: 2, scale: 1
    t.decimal "venue_rating_average", precision: 2, scale: 1
    t.decimal "price_average", precision: 4, scale: 2
    t.string "address"
    t.text "hours"
    t.string "phone"
    t.string "website"
    t.string "suburb"
    t.string "postcode"
    t.string "places_id"
    t.string "slug"
    t.index ["slug"], name: "index_venues_on_slug", unique: true
  end

  add_foreign_key "ratings", "venues"
end
