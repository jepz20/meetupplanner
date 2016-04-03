import os

DEBUG = True

TOKEN_SECRET = os.environ.get('SECRET_KEY') or 'JWT Token Secret String'
FACEBOOK_SECRET = os.environ.get('FACEBOOK_SECRET') or '928ae654ea9973b5e974fae7aeffbc55'
GOOGLE_SECRET = os.environ.get('GOOGLE_SECRET') or 'lrzmg1NewBzjz4EFjwIPIbN4'
