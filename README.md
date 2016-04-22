# Meetup Planner
author@Jose Eduardo Perdomo

First Proyect for the Senior Web Developer Nanodegree at Udacity

MeetUp Planner allows you to easily create an event, set guests and location.
Signup using facebook, google or your email. 

MeetUp Planner uses the flask microframework to serve the content and AngularJs with NgMaterial as the frontend framework

###Live Version
Live version of the page: http://meetupplanner-j.appspot.com


##Installation

###Backend

Made in python 2.7, usign the flask microframework and Google app engine.

To run locally

1. Install the [App Engine Python SDK](https://developers.google.com/appengine/downloads).
2. Clone this repo
3. Install dependencies in the project's lib directory.
   Note: App Engine can only import libraries from inside your project directory.

   ``pip install -r requirements.txt -t lib``

###Frontend

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

##License
MIT License

Copyright (c) 2016 Jose Perdomo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.