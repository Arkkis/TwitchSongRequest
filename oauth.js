import { GetAppUrl, GetToken, SetToken } from "./shared.js";

export function OauthRedirectHandler() {
  const tokenHash = document.location.hash;

  if (tokenHash.includes("#access_token=")) {
    const token = tokenHash.split("#access_token=")[1].split("&")[0];
    SetToken(token);
    window.location.replace(`${GetAppUrl()}`);
  }

  if (GetToken() === null) {
    TwitchLogin();
  } else {
    let supportLinkElement = document.getElementById("support");
    document.getElementById("twitch_login").remove();
    supportLinkElement.style.display = "inline";
  }
}

export function SpotifyOauthRedirectHandler() {
  const params = new URLSearchParams(window.location.search);

  if (params.has("code")) {
    let code = params.get("code");
    let codeVerifier = localStorage.getItem("songRequest_code_verifier");
    let clientId = localStorage.getItem("songRequest_spotify_clientId");
    let redirectUri = localStorage.getItem("songRequest_spotify_redirecturi");

    let body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier,
    });

    const response = fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    })
      .then((response) => {
        if (response.status === 400) {
          window.location.replace(`${GetAppUrl()}`);
        } else if (!response.ok) {
          throw new Error("HTTP status " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem(
          "songRequest_spotify_access_token",
          data.access_token
        );
        window.location.replace(`${GetAppUrl()}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  if (localStorage.getItem("songRequest_spotify_access_token") === null) {
    //alert("Not logged in");
  } else {
    let supportLinkElement = document.getElementById("support");
    document.getElementById("spotify_login").remove();
    supportLinkElement.style.display = "inline";
  }
}
