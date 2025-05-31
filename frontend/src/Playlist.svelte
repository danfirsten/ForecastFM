<script>
    import './Playlist.css';
  </script>

  <div>
    <div class="header">
        <div class="title">ForecastFM</div>
        <div class="location-button">Change Location</div>
        <div class="logout-button">Logout</div>
    </div>
    <div class="message">Here's your curated playlist created for</div>
    <div class="weather">
        <!-- info pulled from the weather API -->
        <!-- replace placeholders with stuff from Weather API  -->
        <div class="logo">
            <img src="/assets/Sunny.png" alt="Sunny" />
        </div>
        <div class="weather-text">
            <div class="location">Davis, California</div>
            <div class="temperature">88&deg; Sunny</div>
        </div>
    </div>
    <div class="playlist">
        <div class="song">
            <!-- info pulled from the spotify API -->
            <!-- replace placeholders with populated items from Spotify API -->
            <div class="album-image"></div>
            <div class="song-info">
                <div class="song-name">Song name</div>
                <div class="artist">Artist</div>
            </div>
        </div>
        <div class="song">
            <!-- info pulled from the spotify API -->
            <!-- replace placeholders with populated items from Spotify API -->
            <div class="album-image"></div>
            <div class="song-info">
                <div class="song-name">Song name</div>
                <div class="artist">Artist</div>
            </div>
        </div>
    </div>
  </div>