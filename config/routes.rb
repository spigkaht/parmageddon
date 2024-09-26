Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  root to: "pages#index"
  post "locations", to: "locations#find_nearby"
  resources :venues, only: [:index, :show]
end
