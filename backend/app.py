from flask import Flask
import requests

app = Flask(__name__)

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
    
    return f"Weather Code: {response["current"]["weather_code"]}"

if __name__ == '__main__':
    app.run(debug=True)
