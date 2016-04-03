from datetime import datetime, timedelta
import os
from flask import Flask, g, send_file, request, redirect, url_for, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import requests
import logging
from functools import wraps
from urlparse import parse_qs, parse_qsl
from urllib import urlencode
from requests_oauthlib import OAuth1
import jwt
from jwt import DecodeError, ExpiredSignature
try:
    # For c speedups
    from simplejson import loads, dumps
except ImportError:
    from json import loads, dumps
from firebase import firebase

current_path = os.path.dirname(__file__)
client_path = os.path.abspath(os.path.join(current_path, 'app'))
app = Flask(__name__, static_url_path='', static_folder=client_path)
app.config.from_object('config')
firebase = firebase.FirebaseApplication('https://popping-heat-5589.firebaseio.com/',None)

def create_token(user):
    payload = {
        'sub': user.id,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(days=14)
    }
    token = jwt.encode(payload, app.config['TOKEN_SECRET'])
    return token.decode('unicode_escape')


def parse_token(req):
    token = req.headers.get('Authorization').split()[1]
    return jwt.decode(token, app.config['TOKEN_SECRET'])


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.headers.get('Authorization'):
            response = jsonify(message='Missing authorization header')
            response.status_code = 401
            return response

        try:
            payload = parse_token(request)
        except DecodeError:
            response = jsonify(message='Token is invalid')
            response.status_code = 401
            return response
        except ExpiredSignature:
            response = jsonify(message='Token has expired')
            response.status_code = 401
            return response

        g.user_id = payload['sub']

        return f(*args, **kwargs)

    return decorated_function


# Routes

@app.route('/')
def index():
    return send_file(os.path.join(client_path, 'index.html'))


@app.route('/auth/login', methods=['POST'])
def login():
    user = User.query.filter_by(email=request.json['email']).first()
    if not user or not user.check_password(request.json['password']):
        response = jsonify(message='Wrong Email or Password')
        response.status_code = 401
        return response
    token = create_token(user)
    return jsonify(token=token)


@app.route('/auth/signup', methods=['POST'])
def signup():
    userGet = firebase.get('/users',request.json['email'].replace('@','at').replace('.','dot'))
    if userGet is not None:
        print userGet
        existingUser = userGet
        existingUser['name'] = request.json['name']
        existingUser['password'] = request.json['password']
        userData = existingUser
    else:
        userData = {"name": request.json['name'], "email": request.json['email'],
        'password': request.json['password']}
    result = firebase.put('/users',request.json['email'].replace('@','at').replace('.','dot'), userData)
    return dumps(result)
    # /jsonify(token=token)


@app.route('/auth/facebook', methods=['POST'])
def facebook():
    access_token_url = 'https://graph.facebook.com/v2.5/oauth/access_token'
    graph_api_url = 'https://graph.facebook.com/v2.5/me?fields=email,name,picture'
    try:
        params = {
            'client_id': request.json['clientId'],
            'redirect_uri': request.json['redirectUri'],
            'client_secret': app.config['FACEBOOK_SECRET'],
            'code': request.json['code']
        }
    except Exception, e:
        return "paso esto %s" % e

    # Step 1. Exchange authorization code for access token.
    r = requests.get(access_token_url, params=params)
    access_token = loads(r.text)
    # Step 2. Retrieve information about the current user.
    r = requests.get(graph_api_url, params=access_token)
    # try:
    profile = json.loads(r.text)
    userGet = firebase.get('/users',profile['email'].replace('@','at').replace('.','dot'))
    if userGet is not None:
        print userGet
        existingUser = userGet
        existingUser['name'] = profile['name']
        existingUser['email'] = profile['email']
        existingUser['facebook_id'] = profile['id']
        userData = existingUser
    else:
        userData = {"name": profile['name'], "email": profile['email'],
        'facebook_id': profile['id']}
    result = firebase.put('/users',profile['email'].replace('@','at').replace('.','dot'), userData)

    return dumps(userData)


@app.route('/auth/google', methods=['POST'])
def google():
    access_token_url = 'https://accounts.google.com/o/oauth2/token'
    people_api_url = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect'
    print request.json
    payload = dict(client_id=request.json['clientId'],
                   redirect_uri=request.json['redirectUri'],
                   client_secret=app.config['GOOGLE_SECRET'],
                   code=request.json['code'],
                   grant_type='authorization_code')

    # Step 1. Exchange authorization code for access token.
    r = requests.post(access_token_url, data=payload)
    token = json.loads(r.text)
    headers = {'Authorization': 'Bearer {0}'.format(token['access_token'])}

    # Step 2. Retrieve information about the current user.
    r = requests.get(people_api_url, headers=headers)
    profile = json.loads(r.text)
    userGet = firebase.get('/users',profile['email'].replace('@','at').replace('.','dot'))
    if userGet is not None:
        print userGet
        existingUser = userGet
        existingUser['name'] = profile['name']
        existingUser['email'] = profile['email']
        existingUser['google_id'] = profile['sub']
        userData = existingUser
    else:
        userData = {"name": profile['name'], "email": profile['email'],
        'google_id': profile['sub']}
    result = firebase.put('/users',profile['email'].replace('@','at').replace('.','dot'), userData)
    print profile
    # user = User.query.filter_by(google=profile['sub']).first()
    # if user:
    #     token = create_token(user)
    #     return jsonify(token=token)
    # u = User(google=profile['sub'],
    #          display_name=profile['name'])
    # db.session.add(u)
    # db.session.commit()
    # token = create_token(u)

    return dumps(userData)

# if __name__ == '__main__':
#     app.run(port=3000)

def log_exception(sender, exception, **extra):
    """ Log an exception to our logging framework """
    sender.logger.debug('Got exception during processing: %s', exception)

from flask import got_request_exception
got_request_exception.connect(log_exception, app)