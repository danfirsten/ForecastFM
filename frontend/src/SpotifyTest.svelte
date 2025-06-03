<script lang="ts" context="module">
    const clientId = "0553802b6f0b4a3f8357fabcbecc3817"; // get from spotify Dev portal
    // ^ TODO Put this in env file later
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code"); // if undef then user isn't authorized

    const tokenEndpoint = "https://accounts.spotify.com/api/token";
    const scope = 'user-read-private user-read-email';
 
    const currentToken = {
        get access_token() { return localStorage.getItem('access_token'); },
        get refresh_token() { return localStorage.getItem('refresh_token'); },
        get expires_in() { return localStorage.getItem('refresh_in') },
        get expires() { return localStorage.getItem('expires')},

        save: function (response) {
            const { access_token, refresh_token, expires_in } = response;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            localStorage.setItem('expires_in', expires_in);

            const now = new Date();
            const expiry = new Date(now.getTime() + (expires_in * 1000));
            localStorage.setItem('expires', expiry);
        }
    };

    export async function logIn() {
        console.log("spotify test loaded");
        if (!code) {
            redirectToSpotify(clientId);
        } else {
            const accessToken = await getAccessToken(clientId, code);
            const spotifyData = await getSpotifyData(accessToken);
            console.log(spotifyData);
            // TODO - add code to extract specific data from spotify
            // and add queries to get playlist
        }
    }

    // vv API Code taken from devloper.spotify.com vv
    async function redirectToSpotify(clientId: string) {
        const verifier = generateCodeVerifier(128);
        const challenge = await generateCodeChallenge(verifier);

        localStorage.setItem("verifier", verifier);
        console.log("redirectTest");
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

    // ^^ Code taken from spotify ^^

    async function getAccessToken(clientId: string, code: string) {
        const verifier = localStorage.getItem("verifier");

        console.log("debug access token");

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

    async function getSpotifyData(accessToken: string) {}
</script>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Forecast FM</title>
</head>
<body> </body>
