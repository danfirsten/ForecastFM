<script lang="ts">
    const clientId = "0553802b6f0b4a3f8357fabcbecc3817"; // get from spotify Dev portal
    // ^ TODO Put this in env file later
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code"); // if undef then user isn't authorized

    const playlist_ids = {"sunny": "1xaUPRpVCbNaAzgsKrHHMp", "rainy": "47S4MBG0EEXwA0GdJUA4Ur", "night": }

    window.onload = async () => {
        console.log("spotify test loaded");
        if (!code) {
            redirectToSpotify(clientId);
        } else {
            const accessToken = await getAccessToken(clientId, code);
            console.log(accessToken);
            const spotifyData = await getSpotifyData(accessToken);
            console.log(spotifyData);
            // TODO - add code to extract specific data from spotify
            // and add queries to get playlist
        }
    };

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
        params.append("scope", "user-read-private user-read-email");
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

    // ^^ Code taken from spotify ^^

    async function getAccessToken(clientId: string, code: string) {
        const verifier = localStorage.getItem("verifier");

        //console.log("debug access token");

        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", "http://127.0.0.1:5173/callback");
        params.append("code_verifier", verifier!);

        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params,
        });

        const { access_token } = await result.json();
        return access_token;
    }

    async function getSpotifyData(accessToken: string) {
        /*
            Ideas for retrieving relevant songs:
            - put weather into query and find a playlist
            - put weather into query and find 10-15 songs and create our own playlist 
            on the site
            - manually map certain weather patterns to specific playlists and pull 
            10-15 random songs from that playlist when the weather matches


            search queries:
            - sunny mix
            - rainy day mix
            - 
        */
        // const url =
        //     "https://api.spotify.com/v1/search?q=jazz&type=playlist&limit=15&offset=0";
        // const url =
        //     "https://api.spotify.com/v1/playlists/37i9dQZF1EIhkGftn1D0Mh";
        //const url =
        //"https://api.spotify.com/v1/recommendations?seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical%2Ccountry&seed_tracks=0c6xIDDpzE81m2q797ordA");
        const url =
            "https://api.spotify.com/v1/browse/categories/dinner/playlists";

        const result = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        return result.json();
    }
</script>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Forecast FM</title>
</head>
<body> </body>
