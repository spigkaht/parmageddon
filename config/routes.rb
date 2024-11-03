Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
  get '/sitemap.xml', to: redirect('/sitemap.xml.gz')

  root to: "pages#index"
  get "contact", to: "pages#contact", as: "contact"
  post "contact", to: "contacts#create"
  post "locations", to: "locations#find_nearby"

  resources :venues, only: [:index, :show] do
    resources :ratings, only: [:new, :create]
  end
end
