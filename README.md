# Meetup Planner
author@Jose Eduardo Perdomo

First Proyect of the Nanodegree for Senior Web Developer Nanodegree at Udacity

MeetUp Planner allows you to easily create an event, set guests and location.
Signup using facebook, google or your email

 [Live demo](http://meetupplanner-j.appspot.com).

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
4. Run this project locally from the command line:

   ```
   dev_appserver.py --port 3000 .
   ```

##Frontend

Made with angularJS and style with ngmaterial

to run locally:

1. install node dependencies with

	```
	npm install
	```

2. install bower dependencies with

	```
	bower install
	```

3. run this proyect locally from the command line:

	```
	gulp start:server
	```
