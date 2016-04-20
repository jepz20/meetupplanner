# Meetup Planner
author@Jose Eduardo Perdomo

First Proyect of the Nanodegree for Senior Web Developer Nanodegree at Udacity

MeetUp Planner allows you to easily create an event, set guests and location.
Signup using facebook, google or your email

##Live Version
Live version of the page: http://meetupplanner-j.appspot.com

##Backend

Made in python 2.7, usign the flask microframework and Google app engine.

To run locally

1. Install the [App Engine Python SDK](https://developers.google.com/appengine/downloads).
2. Clone this repo
3. Install dependencies in the project's lib directory.
   Note: App Engine can only import libraries from inside your project directory.

   ```
   pip install -r requirements.txt -t lib
   ```

##Frontend

Made with AngularJS and style with NgMaterial

to run locally:

1. install node dependencies with

	```
	npm install
	```

2. install bower dependencies with

	```
	bower install
	```

## Development

Run this project locally(you need to have google app engine in your path):

   ```
   gulp serve
   ```
   
 
   start the backend through the google app engine using the devapp.yaml file if you dont have dev_appserver.py in your path.
   To use the devapp.yaml, enter the Application Settings
   ![alt text](http://i.imgur.com/VeT14Zs.png "Application Setting")

   Add to the extra flags the complete path to the devapp.yaml
   ![alt text](http://i.imgur.com/l6oToNH.png "Extra Flag")

##Production

Build the proyect and serve its minifed version 
   ```
   gulp serve:prod
   ```

  start the backend through the google app engine using the app.yaml file if you dont have dev_appserver.py in your path
