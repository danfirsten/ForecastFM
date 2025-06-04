from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5173"])

@app.route('/weather/<string:lat>/<string:lon>',methods=['GET'])
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
        JSON containing the weather code and temp of specified coordinates

    '''

    # convert coords from strings to floats
    try:
        lon = float(lon)
        lat = float(lat)
    except:
        return "ERROR: invalid coords"

    # build url for query
    base_url = "https://api.open-meteo.com/v1/forecast"

    requestParams = {"longitude":lon, "latitude":lat, 
                     "current": "temperature,weather_code",
                     "temperature_unit": "fahrenheit"}

    response = requests.get(base_url, requestParams).json()
    print(response)

    if "current" not in response:
        return "ERROR: bad query"
    
    return response


if __name__ == '__main__':
    app.run(debug=True)
