Rails.application.routes.draw do
  root  'uploads#index'

  get 'display' => 'uploads#display'

  get 'uploads/new'

  get 'uploads/create'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
