# C_Scores

![The poster created for this app](https://github.com/Hmc-cs-tdubno/C_Scores/blob/views/README%20images/Poster.png "The poster created for this app")

This app aims to make use of data gained from the Parker Team Player Survey, an survey on teamwork style. It acheives this in two ways. One, by allowing the user to upload datasets consisting of results from the survey and displaying these in helpful, visual ways. In addition, it uses data from teams who have completed a survey desinged by our team to measure success as well as the PTPS, and assigns measures of success to a hypothetical team inputted by the user. 

## Architecture

![Architecture Diagram](https://github.com/Hmc-cs-tdubno/C_Scores/blob/views/README%20images/Architecture.PNG "")

This app uses a standard MVC architecture as shown above. Technologies of note include Ruby on Rails as the base, an
SQLite database, gems such as Devise (for users) and Boostrap (for styling), the javascript library D3 to generate graphs, 
and calls to a python script for prediction.

### Prerequisites
Ruby on Rails version 4
Python 3 and Pip.<br />

### Gems

Here is the list of non-default gems we use:
* **Boostrap Gems:** These gems allow us to use bootstrap css classes and javscript code in our views, css files, and javascript files.
  - bootstrap:  version = 4.0.0.alpha6
  - sprockets-rails: dependencies 'sprockets/railtie'
  - popper_js
* **Jquery Gem:** This gem installs the jquery javascript library into our app's asset pipeline allowing us to use jquery in our views and javascript files and is required for installing bootstrap.
  - jquery-rails
* **D3 Gem:** This gem installs the D3 javascript library into our app's asset pipeline allowing us to use D3 in our views and javascript files.
  - d3_rails
* **Devise Gem:** This gem installs the Devise Rails library, which handles user sign up, loggining in, and remembering passwords.
  - devise
* **Testing Gems:**
  - rspec-rails: used for unit testing
  - rails-controller-testing: a library for rspec to unit test controllers
  - database_cleaner: used for cleaning up our test DB after each run ou our testing suite
  - factory_bot_rails: used for creating User model objects before testing, populating our database with those objects, and loggining a particular user in before each test in the test suite
  - selenium-webdriver: used for end-to-end testing (i.e. feature testing)
  - capybara: used for filling in and submitting forms during unit tests
 

## Installation
comands required to run and test project:
`git clone https://github.com/Hmc-cs-tdubno/C_Scores.git`<br />
 `bundle install`<br />
  `rake db:migrate`<br />
 ` pip install numpy`<br />
  
 then to run run:<br />
 `rails s`

## Functionality

### Login:

In order to access the fundamental functionality of our application, the
user must first be signed up for the service. The login page is as
described by figure 1. To create an account follow the procedure visible
from figure 2.

![ScreenShot 1](https://github.com/Hmc-cs-tdubno/C_Scores/blob/views/README%20images/Functionality1.png "")

Once the user has an account, they can access their previously uploaded
data by logging in on the login page. After entering a previously used
email address and password, pressing the login button redirects the user
to the uploads page.

![ScreenShot 2](https://github.com/Hmc-cs-tdubno/C_Scores/blob/views/README%20images/Functionality2.png "")

If desired, the user can check remember me box when logging in, after
which they no longer need to log in again on their device until they
clear their cookies.

### Upload Data:

Once a user is logged in, they are redirected the upload page. To upload
data, the user clicks the ’choose file’ button and selects a properly
formated CSV or JSON file\[1\] and then clicks the "upload CSV/JSON"
button to upload the data to the web app. If the user has already
uploaded data and doesn’t want to upload more at this time they may
click the ’Insights’ button on the navigation bar to access
visualizations the data (functionality described below).

![ScreenShot 3](https://github.com/Hmc-cs-tdubno/C_Scores/blob/views/README%20images/Functionality3.png "")

### Visualize Data:

Once data is uploaded by the logged in user, they are able to see
visualizations of the data that can provide insights into the data. The
first graph that appears is a bar graph that indicates the distribution
of primary styles in the user’s data. This is a bar graph with Parker
Team Player Survey teamwork style is the X-axis. The Y-axis is the
number of people in the user’s uploaded dataset that have each style as
their main style. Clicking on the insights tab located in the navigation
bar pulls down three tabs, and clicking on any of these redirects the
user to a different insight. The links are for ’Bar Graph’, ’Scatter
Plot’, and ’Stats’. Clicking the ’Bar Graph’ link will result in the bar
graph image in figure 4.

![ScreenShot 4](https://github.com/Hmc-cs-tdubno/C_Scores/blob/views/README%20images/Functionality4.png "")
For any of the data visualizations you can select the dataset in the
check boxes seen in the figures below and visualize those datasets that
were selected. Clicking on the scatter graph link will redirect the user
to see a scatter plot and a legend. The legend contains two drop down
menus in each containing all four Parker Team Player styles. Selecting
the X-axis and the Y-axis styles and pressing ’Go\!’ generates a scatter
plot where the X-axis and Y-axes are the scores of the styles selected
in the legend. Plotted on the scatter graph is the scores of people in
the user’s dataset, X-axis score vs Y-Axis score plotted as points.
Changing the legend values and pressing go again generates a new scatter
graph with the selected values.

![ScreenShot 5](https://github.com/Hmc-cs-tdubno/C_Scores/blob/views/README%20images/Functionality5.png "")

Click on the statistics link in the insights tab redirects the user to
the a page listing interesting statistics about the data. These
statistics can be used to gain a deeper level of insight about the
uploaded data.

![ScreenShot 6](https://github.com/Hmc-cs-tdubno/C_Scores/blob/views/README%20images/Functionality6.png "")

### Prediction:

The user can access the predictions page through a link in the
navigation bar. The predictions page enables the user to get a
prediction of the success of a potential team. The user enters the four
style scores of four team members in their row of a form. After entering
the data the user can press the ’Submit’ button, and a list of metrics
to determine the success of the potential team is displayed to the user
as seen in the figure 7

![ScreenShot 7](https://github.com/Hmc-cs-tdubno/C_Scores/blob/views/README%20images/Functionality7.png "")

### CSV formatting:

In the top row, put the name of each field: ’Challenger’,
’Collaborator’, ’Communicator’, ’Contributor’, ’q1’, ’q2’,...,’q18’.
Each row after the first represents a particular person. In the first
four columns put a number representing a person’s score in that style.
In the remaining columns, put a string such as ’1234’ or ’1342’
representing the order of selections made on that question.

## Known Problems
* Nav bar links and other html components flash on page load
    - **Potential Solution:** Edit css and javascript on pages so elements do not flash
* D3 code is cluttured and a lot of code to generate graphs is repeated
    - **Potential Solution:** Try to condense code by creating helper functions that create scales and axes for graphs, reading data request parameters from html elements, etc. We've tried doing this, but for some reason JavaScript behaved very strangely caused other code to break.
* Seed data for prediction
    1. There are no column labels for the seed data, making it hard to understand and recreate.
    2 We have to recluster every time we do a prediction along with classifying a team, this is quite inefficient.
    - **Potential Solutions:** 1. Create a specification for formatting the seed data csv. 2. Save the cluster data after our first system call so we can reuse it for each classification.
* Code smell in graph update code 
    - Currently when we request data to update graphs we just add parameters to our request url manually by grabbing their values from html elements instead of using a proper html form or even a rails form:
    - **Potential Solution** Find a way to use a rails form to select which datasets will be used to update the graphs.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D
