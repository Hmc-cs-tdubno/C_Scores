Rails.application.routes.draw do
  # Predictions routes
  get 'predictions/index'
  post 'predictions/analyze'

  devise_for :users

  # Uploads routes
  resources :uploads do
    collection {post :import}
  end
  root  'uploads#index'
  get 'display' => 'uploads#display'
  get 'uploads/new'
  get 'uploads/create'
  get 'delete' => 'uploads#remove'
  get 'delete_individuals' => 'uploads#delete_individuals'

  # Ajax Routes
  get 'check_dataset_id' => 'uploads#check_dataset_id'

  # D3 REST API
  get 'api/bar/' =>'graphing#bar'
  get 'api/scatter/' =>'graphing#scatter'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
