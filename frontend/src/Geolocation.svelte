<script lang="ts">
    let status: HTMLParagraphElement | null = null;
    let mapLink: HTMLAnchorElement | null = null;
    
    function geoFindMe() {
        console.log("Pressed");
        
        if (!status || !mapLink) return;
        
        mapLink.href = "";
        mapLink.textContent = "";

        function success(position: GeolocationPosition) {
            if (!status || !mapLink) return;
            
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            status.textContent = "";
            mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
            mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
        }

        function error() {
            if (!status || !mapLink) return;

            status.textContent = "Unable to retrieve your location";
        }

        if (!navigator.geolocation) {
            status.textContent = "Geolocation is not supported by your browser";
        } else {
            status.textContent = "Locating…";
            navigator.geolocation.getCurrentPosition(success, error);
        }
}
</script>

<h3>Geolocation</h3>
<button id="findme" on:click={geoFindMe}>Show my location</button><br />
<p bind:this={status}></p>
<a bind:this={mapLink} target="_blank"></a>