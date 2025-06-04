<script lang="ts" context="module">
    import { push } from 'svelte-spa-router';
    import './LocationPage.svelte';
    const clientId = "0553802b6f0b4a3f8357fabcbecc3817"; // get from spotify Dev portal
    // ^ TODO Put this in env file later
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code"); // if undef then user isn't authorized
    const redirectUrl = "http://127.0.0.1:5173";


    const tokenEndpoint = "https://accounts.spotify.com/api/token";
    const scope = 'user-read-private user-read-email';
 
    // const currentToken = {
    //     get access_token() { return localStorage.getItem('access_token'); },
    //     get refresh_token() { return localStorage.getItem('refresh_token'); },
    //     get expires_in() { return localStorage.getItem('refresh_in') },
    //     get expires() { return localStorage.getItem('expires')},

    //     save: function (response) {
    //         const { access_token, refresh_token, expires_in } = response;
    //         localStorage.setItem('access_token', access_token);
    //         localStorage.setItem('refresh_token', refresh_token);
    //         localStorage.setItem('expires_in', expires_in);

    //         const now = new Date();
    //         const expiry = new Date(now.getTime() + (expires_in * 1000));
    //         localStorage.setItem('expires', expiry);
    //     }
    // };


    let weather = ""; // get weather from weather api
    let tracks = [];

    let playlist_ids = new Map([
        ["sunny", "1xaUPRpVCbNaAzgsKrHHMp"],
        ["rainy", "47S4MBG0EEXwA0GdJUA4Ur"],
        ["night", "5elnsQozvPDX2m0WEOV1z4"],
        ["cloudy", "7dt4XvrQt8U8BQFQBKFV6u"],
    ]); // hardcoded playlists, put in env file?


    export async function logIn() {
        await fetchWeather();
        try {
            const accessToken = await getAccessToken(clientId, code);
            //console.log(accessToken);
            const spotifyData = await getSpotifyData(accessToken);
            //console.log(spotifyData);
            tracks = await getTracksFromPlaylist(spotifyData);                    
            localStorage.setItem("trackIds", JSON.stringify(tracks));
            //console.log(tracks);
                // TODO - add code to extract specific data from spotify
                // and add queries to get playlist                 
        } catch (error) {
            console.log("error: ", error);
        //    redirectToSpotify(clientId);
        }
        if (code) {
            console.log("login success"); 
            push('/location'); // redirect to locationpage
        } else {
            redirectToSpotify(clientId);
        }
    }

    export async function logOut() {
        console.log("log out");
        localStorage.clear();
        push('/');
        window.location.href = redirectUrl;
    }

    async function fetchWeather() {
        // fetch weather from backend
        // need location

        weather = "sunny";
    }

    // vv API Code taken from devloper.spotify.com vv
    async function redirectToSpotify(clientId: string) {
        const verifier = generateCodeVerifier(128);
        const challenge = await generateCodeChallenge(verifier);

        localStorage.setItem("verifier", verifier);
        //console.log("redirectTest");
        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("response_type", "code");
        params.append("redirect_uri", "http://127.0.0.1:5173/callback");
        params.append("scope", scope);
        params.append("code_challenge_method", "S256");
        params.append("code_challenge", challenge);

        document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
    }

    function generateCodeVerifier(length: number) {
        let text = "";
        let possible =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < length; i++) {
            text += possible.charAt(
                Math.floor(Math.random() * possible.length),
            );
        }
        return text;
    }

    async function generateCodeChallenge(codeVerifier: string) {
        const data = new TextEncoder().encode(codeVerifier);
        const digest = await window.crypto.subtle.digest("SHA-256", data);
        return btoa(
            String.fromCharCode.apply(null, [...new Uint8Array(digest)]),
        )
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    }

    async function getAccessToken(clientId: string, code: string) {
        const verifier = localStorage.getItem("verifier");

        //console.log("debug access token");

        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", "http://127.0.0.1:5173/callback");
        params.append("code_verifier", verifier!);

        const result = await fetch(tokenEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params,
        });

        const { access_token } = await result.json();
        return access_token;
    }


    async function refreshToken() {

        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("grant_type", 'refresh_token');
        params.append("refresh_token", currentToken.refresh_token);

        const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params,
    });

  return await response.json();
}

    // ^^ Code taken from spotify ^^

    async function getSpotifyData(accessToken: string) {
        /*
            Ideas for retrieving relevant songs:
            - put weather into query and find a playlist
            - put weather into query and find 10-15 songs and create our own playlist 
            on the site
            - manually map certain weather patterns to specific playlists and pull 
            10-15 random songs from that playlist when the weather matches
        */

        let playlist_id = playlist_ids.get(weather);
        const url = "https://api.spotify.com/v1/playlists/" + playlist_id;

        const result = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        return result.json();
    }

    async function getTracksFromPlaylist(playlistData: any) {
        let trackIds: Array<string> = [];
        let trackInfo = playlistData.tracks.items;
        // itr
        //console.log(trackInfo);
        Object.entries(trackInfo).forEach((entry: Array<any>) => {
            //console.log(entry[1].track.id);
            trackIds.push(entry[1].track.id);
        });

        return trackIds;
    }

</script>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Forecast FM</title>
</head>
<body> </body>
