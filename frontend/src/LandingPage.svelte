<script>
  import { onMount } from "svelte";
  import "./LandingPage.css";
  import { logIn } from "./SpotifyTest.svelte";
  import "./SpotifyTest.svelte";
  import { push } from "svelte-spa-router";

  window.onload = async () => {
    document
      .getElementById("forecast-button")
      ?.addEventListener("click", logIn);

    goToLocation();
  };

  function goToLocation() {
    console.log("check if logged in");
    const params = new URLSearchParams(window.location.search);
    let userCode = params.get("code");
    if (userCode) { 
      // logged in
      push("/location");
    }
  }
</script>

<div class="landing-outer">
  <div class="landing-container">
    <div class="title">ForecastFM</div>
    <div class="subtitle">
      Music that matches your mood. Powered by the weather.
    </div>
    <button id="forecast-button" class="cta-btn">Get My Forecast</button>
  </div>
  <div class="how-section">
    <div class="how-title">How it Works</div>
    <div class="steps">
      <div class="step">
        <div class="circle">
          <div class="circle-number">1</div>
          <div class="circle-desc">Connect your Spotify</div>
        </div>
      </div>
      <div class="step">
        <div class="circle">
          <div class="circle-number">2</div>
          <div class="circle-desc">Enter your Location</div>
        </div>
      </div>
      <div class="step">
        <div class="circle">
          <div class="circle-number">3</div>
          <div class="circle-desc">Enjoy your playlist</div>
        </div>
      </div>
    </div>
  </div>
</div>