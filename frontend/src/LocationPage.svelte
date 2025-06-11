<script lang="ts">
  import "./LocationPage.css";
  import { push } from "svelte-spa-router";
  import { logOut } from "./SpotifyTest.svelte";
  // import { getUserName } from "./SpotifyTest.svelte";
  // import { handleLogout } from './Playlist.svelte';
  import { onMount } from "svelte";

  // onMount(async () => {
  //   console.log("location page loads");
  //   document.getElementById("logout-btn")?.addEventListener("click", logOut);
  // });

  let status: HTMLParagraphElement | null = null;
  let locationInput = "";
  let display_name = "";

  // onMount(async () => {
  //   display_name = await getUserName();
  // });

  async function lookupLocation() {
    if (!status) return;

    if (locationInput.length == 0) {
      status.style.color = "red";
      status.textContent = "Please enter a location";
      return;
    }

    status.style.color = "black";
    status.textContent = "Locating…";

    const fetchURL = `https://nominatim.openstreetmap.org/search?format=json&q=${locationInput}`;
    let resp = await fetch(fetchURL);
    let data: object[] = await resp.json();

    if (data.length == 0) {
      status.style.color = "red";
      status.textContent = "Location not found";
      return;
    }

    let name = data[0].name;
    let latitude = data[0].lat;
    let longitude = data[0].lon;

    localStorage.setItem("location", name);

    console.log(data[0]);
    console.log(latitude + " " + longitude);
    status.style.color = "green";
    status.textContent = name;

    getWeather(latitude, longitude);
  }

  // keyboard 'enter' shortcut to search
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key == "Enter") lookupLocation();
  }

  function geoFindMe() {
    console.log("Link Pressed");

    if (!status) return;

    async function success(position: GeolocationPosition) {
      if (!status) return;

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // fetch name of location from reverse search API
      const fetchURL = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
      let resp = await fetch(fetchURL);
      let data = await resp.json();

      console.log(data);

      let name: string = getNameFromResponse(data);
      if (name.length == 0) name = "Current Location";

      localStorage.setItem("location", name);
      console.log(name);

      getWeather(latitude, longitude);
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

  function getNameFromResponse(resp: object) {
    let name = resp.name;
    if (name.length > 0) return name;
    return resp.display_name;
  }

  async function getWeather(latitude: number, longitude: number) {
    let api_url = `http://127.0.0.1:5000/weather/${latitude}/${longitude}`;
    console.log(api_url);
    let resp = await fetch(api_url);
    let resp_json = await resp.json();

    let data = resp_json["current"];

    console.log(data);

    let weatherCode = data["weather_code"];
    let temperature = data["temperature"];

    function getWeatherFromCode(code: number) {
      if (code === 0) return "Sunny";
      if ([1, 2, 3].includes(code)) return "Cloudy";
      if ([45, 48].includes(code)) return "Foggy";
      if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
      if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rainy";
      if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy";
      if ([95, 96, 99].includes(code)) return "Stormy";
      return "Unknown";
    }

    let weather = getWeatherFromCode(weatherCode);

    localStorage.setItem("weather", weather);
    localStorage.setItem("temperature", temperature);

    if (!status) return;
    status.textContent = weather + " " + temperature + "°F";

    push("/playlist");
  }
</script>

<div class="location-bg">
  <nav class="location-navbar">
    <div class="navbar-container">
      <span class="location-title">ForecastFM</span>
      <button id="logout-btn" on:click={logOut} class="logout-btn"
        >Logout</button
      >
    </div>
  </nav>
  <div class="location-center-content">
    <div class="logo-hero-container">
      <img
        src="../img/ForecastFM_logo_transparent.png"
        alt="ForecastFM Logo"
        class="logo-hero"
      />
    </div>
    <p id="welcome-msg">Welcome {display_name}!</p>
    <h2 class="location-heading">Check the weather and get your playlist</h2>
    <div class="location-card">
      <div class="location-input-group">
        <input
          class="location-input"
          type="text"
          placeholder="Enter a location"
          bind:value={locationInput}
          on:keydown={handleKeyDown}
        />
        <button
          on:click={lookupLocation}
          class="search-btn"
          aria-label="Search"
        >
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="#023047"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            viewBox="0 0 24 24"
            ><circle cx="11" cy="11" r="8" /><line
              x1="21"
              y1="21"
              x2="16.65"
              y2="16.65"
            /></svg
          >
        </button>
      </div>
      <a class="current-location-link" on:click={geoFindMe}
        >Use my current location</a
      >
      <p bind:this={status}></p>
    </div>
  </div>
</div>
