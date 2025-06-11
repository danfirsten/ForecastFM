<script>
    import "./Playlist.css";
    import { onMount } from "svelte";
    import { logIn } from "./SpotifyTest.svelte";
    import { logOut } from "./SpotifyTest.svelte";
    import { fetchPlaylist } from "./SpotifyTest.svelte";
    import { refreshTokenClick } from "./SpotifyTest.svelte";
    import { push } from "svelte-spa-router";

    let allTrackIds = [];
    let displayedTracks = [];
    let isLoading = true;

    onMount(async () => {
        loadTrackIds();
    });

    async function loadTrackIds() {
        // Get track IDs from localStorage

        //console.log(localStorage.getItem("weather"));
        await fetchPlaylist();
        let _trackIds = localStorage.getItem("trackIds");
        const trackIds = _trackIds ? JSON.parse(_trackIds) : [];

        console.log("Loaded track IDs:", trackIds);

        if (trackIds.length === 0) {
            console.log(
                "No track IDs found in localStorage, using placeholder data",
            );
            // Placeholder track IDs for testing
            allTrackIds = [
                "4uLU6hMCjMI75M1A2tKUQC", // Never Gonna Give You Up - Rick Astley
                "6habFhsOp2NvshLv26DqMb", // Sweet Child O' Mine - Guns N' Roses
                "5ChkMS8OtdzJeqyybCc9R5", // Somebody to Love - Queen
                "0VjIjW4GlULA7QRbdAhGQk", // Blinding Lights - The Weeknd
                "4VqPOruhp5EdPBeR92t6lQ", // Uptown Funk - Mark Ronson ft. Bruno Mars
                "7qiZfU4dY1lWllzX7mPBI3", // Shape of You - Ed Sheeran
                "2WfaOiMkCvy7F5fcp2zZ8L", // Levitating - Dua Lipa
                "11dFghVXANMlKmJXsNCbNl", // Rather Be - Clean Bandit
                "60nZcImufyMA1MKQY3dcCH", // As It Was - Harry Styles
                "3n3Ppam7vgaVa1iaRUc9Lp", // Mr. Brightside - The Killers
                "5sdQOyqq2IDhvmx2lHOpwd", // Dancing Queen - ABBA
                "6dGnYIeXmHdcikdzNNDMm2", // I Will Survive - Gloria Gaynor
                "0tgVpDi06FyKpA1z0VMD4v", // Perfect - Ed Sheeran
                "1mea3bSkSGXuIRvnydlB5b", // Cruel Summer - Taylor Swift
                "3DYVWvPh3kGwPasp7yjahc", // Sunflower - Post Malone & Swae Lee
                "1Je1IMUlBXcx1Fz0WE7oPT", // Bohemian Rhapsody - Queen
                "6UelLqGlWMcVH1E5c4H7lY", // Watermelon Sugar - Harry Styles
                "4iV5W9uYEdYUVa79Axb7Rh", // New Rules - Dua Lipa
                "2takcwOaAZWiXQijPHIx7B", // Time After Time - Cyndi Lauper
                "7xGfFoTpQ2E7fRF5lN10tr", // Bad Guy - Billie Eilish
                "5Z01UMMf7V1o0MzF86s6WJ", // Don't Stop Me Now - Queen
                "0SF3otyb2oUWbJsOJAy1sn", // Anti-Hero - Taylor Swift
                "6WrI0LAC5M1Rw2MnX2ZvEg", // Counting Stars - OneRepublic
                "0KKkJNfGyhkQ5aFogxQAPU", // Someone Like You - Adele
                "6Qyc6fS4DsZjB2mRW9DsQs", // Senorita - Shawn Mendes & Camila Cabello
                "7lQ8MOhq6IN2w8EYcFNSUk", // Industry Baby - Lil Nas X ft. Jack Harlow
                "3cfOd4CMv2snFaKAnMdnvK", // Midnight City - M83
                "6f70BpkMDtFoIGwdaHMdpc", // Thunder - Imagine Dragons
                "6dBUzqjtbnIz1YMXvdyQKE", // Happier - Marshmello ft. Bastille
                "5ygDXis42ncn6kYG14lEZG", // Heat Waves - Glass Animals
            ];
        } else {
            allTrackIds = trackIds;
        }

        // Randomly sample 20 songs
        shuffleAndDisplayTracks();
        isLoading = false;
    }

    function shuffleAndDisplayTracks() {
        if (allTrackIds.length === 0) return;
        // Shuffle array and take 20 songs
        const shuffled = [...allTrackIds].sort(() => 0.5 - Math.random());
        const numberOfSongs = Math.min(20, shuffled.length);
        displayedTracks = shuffled.slice(0, numberOfSongs);
    }

    function refreshPlaylist() {
        shuffleAndDisplayTracks();
    }

    async function handleChangeLocation() {
        await logOut();
        await refreshTokenClick();
        // await logIn();
        push("/location");
    }

    let location = localStorage.getItem("location");
    let weather = localStorage.getItem("weather");
    let temperature = localStorage.getItem("temperature");
    let fullWeather = `${temperature}\u00B0F ${weather}`;
</script>

<div>
    <div class="header">
        <div class="playlist-title">ForecastFM</div>
        <div class="location-button" on:click={handleChangeLocation}>
            Change Location
        </div>
        <button class="logout-button" on:click={logOut}>Logout</button>
    </div>

    <div
        class={`page-container weather-${weather?.toLowerCase() || "default"}`}
    >
        <div class="message">Here's your playlist created for</div>

        <div class="weather">
            <!-- info pulled from the weather API -->
            <div class="logo">
                <img src={`/assets/${weather}.png`} alt={weather} />
            </div>
            <div class="weather-text">
                <!-- <div class="location">Davis, California</div>
                <div class="temperature">88&deg; Sunny</div> -->
                <div class="location">{location}</div>
                <div class="temperature">{fullWeather}</div>
            </div>
        </div>

        {#if isLoading}
            <div class="loading">
                <p>Loading your playlist...</p>
            </div>
        {:else if displayedTracks.length === 0}
            <div class="empty-state">
                <p>No tracks found.</p>
            </div>
        {:else}
            <div class="refresh-container">
                <button on:click={refreshPlaylist} class="refresh-btn"
                    >Refresh</button
                >
            </div>

            <div class="playlist">
                {#each displayedTracks as trackId, index (trackId)}
                    <div class="song-embed">
                        <iframe
                            title="Spotify Track {index + 1}"
                            style="border-radius:12px"
                            src="https://open.spotify.com/embed/track/{trackId}?utm_source=generator&theme=0"
                            width="100%"
                            height="100"
                            frameBorder="0"
                        ></iframe>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>
