import { GetToken } from "./shared.js";

export async function FetchUserInfo() {
  try {
    const response = await fetch("https://api.twitch.tv/helix/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GetToken()}`,
        "Client-Id": "mzjhkpny9ltq6j95kebqo6qiq16ald",
      },
    });

    if (!response.ok) {
      return undefined;
    }

    const data = await response.json();
    return data.data[0];
  } catch (error) {
    console.error(error);
  }
}

export async function SubscribeTopic(topic) {
  try {
    const response = await fetch(
      "https://api.twitch.tv/helix/eventsub/subscriptions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GetToken()}`,
          "Client-Id": "mzjhkpny9ltq6j95kebqo6qiq16ald",
        },
        body: JSON.stringify(topic),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
