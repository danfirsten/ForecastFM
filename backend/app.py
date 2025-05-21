from flask import Flask
import requests

app = Flask(__name__)

@app.route('/weather/<int:lat>/<int:lon>',methods=['GET'])
def getWeatherCode(lon, lat):
    ''' 
    Fetch weather code for given coords from open-meteo API
    (https://open-meteo.com)
    
    Args
    ---
    lon: int
        Longitude
    lat: int
        Latitude

    Returns
    ------
    int 
        The weather code

    '''

    base_url = "https://api.open-meteo.com/v1/forecast"
    query = "current=weather_code"

    fetch_url = f"{base_url}?longitude={str(lon)}&latitude={str(lat)}&{query}"

    print(fetch_url)

    response = requests.get(fetch_url).json()
    print(type(response))

    if "current" not in response:
        return "ERROR: bad query"
    
    return f"Weather Code: {str(response["current"]["weather_code"])}"

if __name__ == '__main__':
    app.run(debug=True)
