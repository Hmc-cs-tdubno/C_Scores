Rails.application.routes.draw do
  get 'predictions/index'
  get 'predictions/analyze'

  devise_for :users
    resources :uploads do
      collection {post :import}
    end
  root  'uploads#index'

  get 'display' => 'uploads#display'

  get 'uploads/new'

  get 'uploads/create'
  
  get 'api/bar/' =>'graphing#bar'
  get 'api/scatter/' =>'graphing#scatter'
  get 'delete' => 'uploads#remove'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
