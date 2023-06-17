export async function TriggerReward(event) {
  console.log(event);

  const rewardName = localStorage.getItem("songRequest_rewardName");

  switch (event.reward.title) {
    case rewardName:
      await RequestSong(event.user_input);
      break;

    default:
      break;
  }
}

async function RequestSong(song) {
  let accessToken = localStorage.getItem("songRequest_spotify_access_token");

  song = decodeURIComponent(song);

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${song}&type=track&limit=1`,
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );

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
}
