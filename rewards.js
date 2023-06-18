import { GetToken, GetUserInfo } from "./shared.js";
import { GetChatClient, GetChatClientChannel } from "./twitchchat.js";

const rewardName = localStorage.getItem("songRequest_rewardName");

export async function TriggerReward(event) {
  switch (event.reward.title) {
    case rewardName:
      await RequestSong(event);
      break;

    default:
      break;
  }
}

async function RequestSong(event) {
  let accessToken = localStorage.getItem("songRequest_spotify_access_token");

  const song = decodeURIComponent(event.user_input);

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${song}&type=track&limit=1`,
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );

  if (!response.ok) {
    await RefundPoints(event);
    return;
  }

  const data = await response.json();
  const artist = data.tracks.items[0].artists[0].name;
  const songName = data.tracks.items[0].name;
  const songUri = data.tracks.items[0].uri;

  const addPlaylistResponse = await fetch(
    `https://api.spotify.com/v1/me/player/queue?uri=${songUri}`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );

  if (addPlaylistResponse.ok) {
    const channel = GetChatClientChannel();
    const client = GetChatClient();
    client.say(channel, `${artist} - ${songName} added to queue!`);
  } else {
    await RefundPoints(event);
    return;
  }
}

async function RefundPoints(event) {
  const token = GetToken();
  const userInfo = GetUserInfo();

  const response = await fetch(
    `https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions?broadcaster_id=${userInfo.id}&reward_id=${event.reward.id}&id=${event.id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "client-id": "mzjhkpny9ltq6j95kebqo6qiq16ald",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "CANCELED",
      }),
    }
  );
}

export async function CreateCustomReward() {
  const token = GetToken();
  const userInfo = GetUserInfo();

  const response = await fetch(
    `https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${userInfo.id}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "client-id": "mzjhkpny9ltq6j95kebqo6qiq16ald",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: rewardName,
        cost: 500,
        is_user_input_required: true,
        prompt: "Request song from Spotify",
      }),
    }
  );
}
