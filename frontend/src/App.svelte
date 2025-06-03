<script lang="ts">
    // testing spotify api
    import SpotifyTest from "./SpotifyTest.svelte";
    import { onMount } from "svelte";

    onMount(async () => {
        console.log("app mounted");

        let _trackIds = localStorage.getItem("trackIds");
        const trackIds = _trackIds ? JSON.parse(_trackIds) : [];
        //console.log("my track ids: ", trackIds);
    });
</script>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Forecast FM</title>
</head>
<body>
    <SpotifyTest />
    <p>testing svelte</p>

    <iframe
        title="paint it black"
        style="border-radius:12px"
        src="https://open.spotify.com/embed/track/63T7DJ1AFDD6Bn8VzG6JE8?utm_source=generator&theme=0"
        width="50%"
        height="100"
        frameBorder="0"
        loading="lazy"
    ></iframe>

    <iframe
        title="Feel Good"
        style="border-radius:12px"
        src="https://open.spotify.com/embed/track/0d28khcov6AiegSCpG5TuT?utm_source=generator&theme=0"
        width="50%"
        height="100"
        frameBorder="0"
        loading="lazy"
    ></iframe>
</body>
