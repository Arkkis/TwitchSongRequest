let userInfo = {};
let sessionId = "";

export function GetUserInfo() {
  return userInfo;
}

export async function SetUserInfo(newUserInfo) {
  const userInfoData = await newUserInfo;

  if (userInfoData !== undefined) {
    userInfo = userInfoData;
    return true;
  }

  return false;
}

export function GetSessionId() {
  return sessionId;
}

export function SetSessionId(newSessionId) {
  sessionId = newSessionId;
}

export function GetToken() {
  return localStorage.getItem("songRequest_Token");
}

export function SetToken(newToken) {
  localStorage.setItem("songRequest_Token", newToken);
}

export function SetChannel(channelName) {
  localStorage.setItem("songRequest_Twitch_ChannelName", channelName);
}

export function GetChannel() {
  return localStorage.getItem("songRequest_Twitch_ChannelName");
}

export function GetAppUrl() {
  return localStorage.getItem("songRequest_appUrl");
}

export function SetAppUrl(newUrl) {
  var fullUrl = new URL(newUrl);
  var strippedUrl = fullUrl.origin + fullUrl.pathname;
  localStorage.setItem("songRequest_appUrl", strippedUrl);
}
