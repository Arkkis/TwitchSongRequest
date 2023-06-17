const params = new URLSearchParams(window.location.search);

if (params.has("rewardname")) {
  let rewardName = params.get("rewardname");

  if (rewardName.length <= 0) {
    throw new Error("Too short reward name");
  } else {
    localStorage.setItem("songRequest_rewardName", rewardName);
  }
} else {
  throw new Error("Reward name not specified");
}

if (params.has("controls")) {
  let showControls = params.get("controls");

  if (showControls === "true") {
    document.getElementById("links").style.display = "block";
  } else {
    document.getElementById("links").style.display = "none";
  }
}

function SpotifyLogin() {
  const clientId = "37372faf5818414abd5354d6e0391c57";
  const redirectUri = "https://arkkis.com/twitchsongrequest";

  localStorage.setItem("songRequest_spotify_clientId", clientId);
  localStorage.setItem("songRequest_spotify_redirecturi", redirectUri);

  let codeVerifier = generateRandomString(128);

  generateCodeChallenge(codeVerifier).then((codeChallenge) => {
    let state = generateRandomString(16);
    let scope = "user-modify-playback-state";

    localStorage.setItem("songRequest_code_verifier", codeVerifier);

    let args = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      state: state,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
    });

    window.location = "https://accounts.spotify.com/authorize?" + args;
  });
}

function ResetApp() {
  localStorage.removeItem("songRequest_Token");
  localStorage.removeItem("songRequest_appUrl");
  localStorage.removeItem("songRequest_rewardName");
  localStorage.removeItem("songRequest_spotify_access_token");
  localStorage.removeItem("songRequest_spotify_redirecturi");
  localStorage.removeItem("songRequest_spotify_clientId");
  localStorage.removeItem("songRequest_code_verifier");
  location.reload();
}

function SendEvent(eventName, object) {
  console.log(eventName + ": " + object);

  const event = new CustomEvent(eventName, {
    detail: object,
  });

  window.dispatchEvent(event);
}

function generateRandomString(length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  function base64encode(string) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);

  return base64encode(digest);
}
