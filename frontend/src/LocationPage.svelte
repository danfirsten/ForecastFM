<script>
  import './LocationPage.css';
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
      <a href="#" class="current-location-link">Use my current location</a>
    </div>
  </div>
</div> 