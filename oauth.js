import { GetAppUrl, GetToken, SetChannel, SetToken } from "./shared.js";

export async function ValidateTwitch() {
  const token = GetToken();

  const response = await fetch("https://id.twitch.tv/oauth2/validate", {
    headers: {
      Authorization: `OAuth ${token}`,
    },
  });

  if (!response.ok) {
    return false;
  } else {
    const data = await response.json();
    SetChannel(data.login);
    return true;
  }
}

export async function OauthRedirectHandler() {
  const tokenHash = document.location.hash;

  const success = await ValidateTwitch();

  if (tokenHash.includes("#access_token=")) {
    const token = tokenHash.split("#access_token=")[1].split("&")[0];
    SetToken(token);

    window.location.replace(`${GetAppUrl()}`);
    return;
  }

  if (success) {
    if (document.getElementById("twitch_login")) {
      document.getElementById("twitch_login").remove();
    }

    const supportLinkElement = document.getElementById("support");
    supportLinkElement.style.display = "inline";
  }

  if (GetToken() !== null && !success) {
    TwitchLogin();
  }
}

export async function SpotifyOauthRedirectHandler() {
  const params = new URLSearchParams(window.location.search);
  let clientId = localStorage.getItem("songRequest_spotify_clientId");

  if (params.has("code")) {
    let code = params.get("code");
    let codeVerifier = localStorage.getItem("songRequest_code_verifier");
    let redirectUri = GetAppUrl();

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
          return;
        } else if (!response.ok) {
          throw new Error("HTTP status " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        localStorage.setItem(
          "songRequest_spotify_access_token",
          data.access_token
        );
        localStorage.setItem(
          "songRequest_spotify_refresh_token",
          data.refresh_token
        );
        window.location.replace(`${GetAppUrl()}`);
        return;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  let accessToken = localStorage.getItem("songRequest_spotify_access_token");
  let refreshToken = localStorage.getItem("songRequest_spotify_refresh_token");

  if (accessToken !== null) {
    const response = await fetch(`https://api.spotify.com/v1/me`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });

    if (!response.ok) {
      let body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
      });

      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      });

      const data = await response.json();

      localStorage.setItem(
        "songRequest_spotify_access_token",
        data.access_token
      );
      localStorage.setItem(
        "songRequest_spotify_refresh_token",
        data.refresh_token
      );
    }

    let supportLinkElement = document.getElementById("support");

    if (document.getElementById("spotify_login")) {
      document.getElementById("spotify_login").remove();
    }

    supportLinkElement.style.display = "inline";
  }
}
