<script lang="ts">
    // testing spotify api
    import SpotifyTest from "./SpotifyTest.svelte";
    import Geolocation from "./Geolocation.svelte";
    import { onMount } from "svelte";

    onMount(async () => {
        console.log("app mounted");
    });
</script>

<!-- <SpotifyTest /> -->
<p>Testing app.svelte</p>
<Geolocation />
