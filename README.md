# C_Scores

![Sumarry, in poster form](https://github.com/Hmc-cs-tdubno/C_Scores/blob/views/Poster.pdf "")

## Architecture

![Architecture Diagram](https://github.com/Hmc-cs-tdubno/C_Scores/blob/views/Capture.PNG "")

This app uses a standard MVC architecture as shown above. Technologies of note include Ruby on Rails as the base, an
SQLite database, gems such as Devise (for users) and Boostrap (for styling), the javascript library D3 to generate graphs, 
and calls to a python script for prediction.

### Prerequisites

TODO: List what a user needs to have installed before running the installation instructions below (e.g., git, which versions of Ruby/Rails)

### Gems

TODO: List which gems your project is using, and the purpose each gem serves in your app.

## Installation
 Software and comands required to run and test project: 
 Python 3 and Pip.
 
 `git clone https://github.com/Hmc-cs-tdubno/C_Scores.git`
 `bundle install`
` rake db:migrate`
` pip install numpy`
 
 then to run run:
 `rails s`

## Functionality

TODO: Write usage instructions.

## Known Problems

TODO: Describe any known issues, bugs, odd behaviors or code smells. Provide steps to reproduce the problem / name a file or a function where the problem lives.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D
