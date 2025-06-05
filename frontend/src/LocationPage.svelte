<script lang="ts">
  import './LocationPage.css';

  import { logOut } from './SpotifyTest.svelte';
  // import { handleLogout } from './Playlist.svelte';
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';

  // onMount(async () => {
  //   console.log("location page loads");
  //   document.getElementById("logout-btn")?.addEventListener("click", logOut);
  // }); 

  function geoFindMe() {
      console.log("Pressed");
          
      async function success(position: GeolocationPosition) {        
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Get weather data: 
          try {
            let api_url = `http://127.0.0.1:5000/weather/${latitude}/${longitude}`;
            let resp = await fetch(api_url);
            let resp_json = await resp.json();
            let data = resp_json["current"];
            let weatherCode = data["weather_code"];
            let temperature = data["temperature"];

            function getWeatherIcon(code: number) {
              if (code === 0) return "Sunny";
              if ([1, 2, 3].includes(code)) return "Cloudy";
              if ([45, 48].includes(code)) return "Foggy";
              if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
              if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rainy";
              if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy";
              if ([95, 96, 99].includes(code)) return "Stormy";
              return "Unknown"; 
            }

            let weather = getWeatherIcon(weatherCode);

            console.log("Weather:", weather, temperature + "°F");

            // Get location data:
            try {
              const geocode_url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
              const geocode_resp = await fetch(geocode_url);
              const geocode_data = await geocode_resp.json();
              const address = geocode_data.address;

              // Try multiple city field possibilities in order of preference
              let city = address.city || 
                        address.town || 
                        address.village || 
                        address.municipality || 
                        address.hamlet || 
                        address.suburb ||
                        address.neighbourhood ||
                        address.county ||
                        "Unknown City";
              
              let state = address.state || 
                          address.province || 
                          address.region || 
                          "Unknown State";

              console.log("location:", city, state);

              // Store everything
              localStorage.setItem("weather", weather);
              localStorage.setItem("temperature", temperature.toString());
              localStorage.setItem("city", city);
              localStorage.setItem("state", state);

              console.log("Completed- data stored");

              // Navigate to playlist page after successful data storage
              push('/playlist');

            } catch(geocodeError) {
              console.error("Geocoding failed:", geocodeError);
              // Still store weather data
              localStorage.setItem("weather", weather);
              localStorage.setItem("temperature", temperature.toString());
              localStorage.setItem("city", "Unknown City");
              localStorage.setItem("state", "Unknown State");

              // Still navigate even if geocoding fails
              push('/playlist');
            }
          } catch (weatherError) {
            console.error("Weather API failed:", weatherError);
          }
      }

      function error() {
          console.log("Geolocation error");
      }

      if (!navigator.geolocation) {
        console.log("Geolocation not supported");
      } else {
          console.log("Starting geolocation");
          navigator.geolocation.getCurrentPosition(success, error);
      }
  }
</script>

<div class="location-bg">
  <nav class="location-navbar">
    <div class="navbar-container">
      <span class="location-title">ForecastFM</span>
      <button id="logout-btn" on:click={logOut} class="logout-btn">Logout</button>
    </div>
  </nav>
  <div class="location-center-content">
    <div class="logo-hero-container">
      <img src="../img/ForecastFM_logo_transparent.png" alt="ForecastFM Logo" class="logo-hero" />
    </div>
    <h2 class="location-heading">Check the weather and get your playlist</h2>
    <div class="location-card">
      <div class="location-input-group">
        <input class="location-input" type="text" placeholder="Enter a location" />
        <button class="search-btn" aria-label="Search">
          <svg width="22" height="22" fill="none" stroke="#023047" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
      </div>
      <a href="#" class="current-location-link" on:click={geoFindMe}>Use my current location</a>
    </div>
  </div>
</div> 