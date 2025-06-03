from flask import Flask, jsonify, redirect, request, session
import os
import secrets
import base64
import hashlib
from urllib.parse import urlencode
from flask_cors import CORS
import requests

app = Flask(__name__)
app.secret_key = os.urandom(24)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

CLIENT_ID = '0553802b6f0b4a3f8357fabcbecc3817'
REDIRECT_URI = 'http://127.0.0.1:5173/callback'
SCOPES = 'user-read-private user-read-email'

def generate_code_verifier():
    return base64.urlsafe_b64encode(secrets.token_bytes(32)).rstrip(b'=').decode('utf-8')


def generate_code_challenge(verifier):
    digest = hashlib.sha256(verifier.encode()).digest()
    return base64.urlsafe_b64encode(digest).rstrip(b'=').decode('utf-8')

@app.route('/weather/<int:lat>/<int:lon>',methods=['GET'])
def getWeatherCode(lon, lat):
    ''' 
    Fetch weather code for given coords from open-meteo API
    (https://open-meteo.com)
    
    Args
    ----
    lon: int
        Longitude
    lat: int
        Latitude

    Returns
    -------
    str 
        String containing the weather code

    '''

    base_url = "https://api.open-meteo.com/v1/forecast"

    requestParams = {"longitude":lon, "latitude":lat, "current": "weather_code"}

    response = requests.get(base_url, requestParams).json()
    print(response)

    if "current" not in response:
        return "ERROR: bad query"
    
    return f"Weather Code: {response['current']['weather_code']}"

if __name__ == '__main__':
    app.run(debug=True)
