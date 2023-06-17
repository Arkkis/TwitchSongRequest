import { SubscribeRedeem } from "./subscriptions.js";
import { SetSessionId, SetUserInfo, SetAppUrl } from "./shared.js";
import { FetchUserInfo, SubscribeTopic } from "./api.js";
import { OauthRedirectHandler, SpotifyOauthRedirectHandler } from "./oauth.js";
import { TriggerReward } from "./rewards.js";

setInterval(async () => {
  let accessToken = localStorage.getItem("songRequest_spotify_access_token");

  const response = await fetch(`https://api.spotify.com/v1/me`, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });

  if (!response.ok) {
    SpotifyLogin();
  }

  const success = await SetUserInfo(FetchUserInfo());

  if (!success) {
    TwitchLogin();
  }
}, 30000);

SetAppUrl(window.location.href);
OauthRedirectHandler();
SpotifyOauthRedirectHandler();

if (localStorage.getItem("songRequest_rewardName") === null) {
  throw new Error("Reward name not specified");
}

const socket = new WebSocket("wss://eventsub.wss.twitch.tv/ws");
const keepAliveInSeconds = 50;
let lastKeepAlive = new Date();

socket.onopen = function (event) {
  console.log("WebSocket connection opened: ", event);
};

setInterval(() => {
  if (Date.now() > lastKeepAlive.getTime() + keepAliveInSeconds * 1000) {
    location.reload();
  }
}, keepAliveInSeconds * 1000);

// keepalive
socket.onmessage = async function (event) {
  const message = JSON.parse(event.data);
  const messageType = message.metadata.message_type;
  if (messageType === "session_keepalive") {
    lastKeepAlive = new Date();
  }
};

// session_welcome
socket.addEventListener(
  "message",
  async function (event) {
    const message = JSON.parse(event.data);
    const messageType = message.metadata.message_type;

    if (messageType === "session_welcome") {
      console.log("Welcome: ", message);
      SetSessionId(message.payload.session.id);
      const success = await SetUserInfo(FetchUserInfo());

      if (success) {
        await SubscribeTopic(SubscribeRedeem());
      }
    }
  },
  false
);

// notification
socket.addEventListener(
  "message",
  async function (event) {
    const message = JSON.parse(event.data);
    const messageType = message.metadata.message_type;
    const eventData = message.payload.event;

    if (messageType === "notification") {
      const subscriptionType = message.metadata.subscription_type;

      switch (subscriptionType) {
        case "channel.channel_points_custom_reward_redemption.add":
          await TriggerReward(eventData);
          break;

        default:
          break;
      }
    }
  },
  false
);

socket.onclose = function (event) {
  console.log("WebSocket connection closed: ", event);
};

socket.onerror = function (error) {
  console.error("WebSocket error: ", error);
};
