import { GetChannel, GetToken } from "./shared.js";

let chatClient = null;
let channel = null;

export function ConnectChat() {
  channel = GetChannel();

  if (channel === undefined || channel === null || chatClient !== null) {
    return;
  }

  const client = new tmi.Client({
    identity: {
      username: channel,
      password: `oauth:${GetToken()}`,
    },
    channels: [channel],
  });

  client.connect();

  chatClient = client;
}

export function GetChatClient() {
  return chatClient;
}

export function GetChatClientChannel() {
  return channel;
}
