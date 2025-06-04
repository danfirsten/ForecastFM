<script lang="ts">
  import './LocationPage.css';

  let status: HTMLParagraphElement | null = null;

  function geoFindMe() {
        console.log("Pressed");
        
        if (!status) return;
        
        // temperature.textContent = "";

        async function success(position: GeolocationPosition) {
            if (!status) return;
            
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            let api_url = `http://127.0.0.1:5000/weather/${latitude}/${longitude}`;
            console.log(api_url);
            let resp = await fetch(api_url);
            let resp_json = await resp.json();

            let data = resp_json["current"];

            console.log(data);

            let weatherCode = data["weather_code"];
            let temperature = data["temperature"];

            localStorage.setItem("weatherCode",weatherCode);
            localStorage.setItem("temperature",temperature);

            // // get city name from coordinates
            // const city_url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
            // resp = await fetch(city_url);
            // data = await resp.json();



            status.textContent = data["weather_code"] + " " + data["temperature"] + "°F";
        }

        function error() {
            if (!status) return;

            status.style.color = "red";
            status.textContent = "Unable to retrieve your location";
        }

        if (!navigator.geolocation) {
            status.style.color = "red";
            status.textContent = "Geolocation is not supported by your browser";
        } else {
            status.style.color = "black";
            status.textContent = "Locating…";
            navigator.geolocation.getCurrentPosition(success, error);
        }
  }
</script>

<div class="location-bg">
  <nav class="location-navbar">
    <div class="navbar-container">
      <span class="location-title">ForecastFM</span>
      <button class="logout-btn">Logout</button>
    </div>
  </nav>
  <div class="location-center-content">
    <div class="logo-hero-container">
      <img src="../img/ForecastFM_fav.png" alt="ForecastFM Logo" class="logo-hero" />
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
      <p bind:this={status}></p>
    </div>
  </div>
</div> 