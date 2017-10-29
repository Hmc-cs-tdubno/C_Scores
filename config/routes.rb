Rails.application.routes.draw do
  devise_for :users
    resources :uploads do
      collection {post :import}
    end
  root  'uploads#index'

  get 'display' => 'uploads#display'

  get 'uploads/new'

  get 'uploads/create'
  
  get 'api/bar/' =>'graphing#bar'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
