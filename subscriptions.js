import { GetUserInfo, GetSessionId } from "./shared.js";

export function SubscribeRedeem() {
  let base = SubscriptionBase();
  base.type = "channel.channel_points_custom_reward_redemption.add";
  base.condition = { broadcaster_user_id: GetUserInfo().id };
  return base;
}

function SubscriptionBase() {
  return {
    version: "1",
    condition: {},
    transport: {
      method: "websocket",
      session_id: GetSessionId(),
    },
  };
}
