<script>
    import './Playlist.css';
  </script>

  <div>
    <div class="header">
        <div class="title">ForecastFM</div>
        <div class="location-button">Change Location</div>
        <div class="Logout-button">Logout</div>
    </div>
    <div class="message">Here's your curated playlist created for</div>
    <div class="weather">
        <!-- info pulled from the weather API -->
        <div class="logo"></div>
        <div class="location"></div>
        <div class="temperature"></div>
    </div>
    <div class="playlist">
        <div class="song">
            <!-- info pulled from the spotify API -->
            <div class="album-image"></div>
            <div class="song"></div>
            <div class="artist"></div>
        </div>
    </div>
  </div>