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

export function GetAppUrl() {
  return localStorage.getItem("songRequest_appUrl");
}

export function SetAppUrl(newUrl) {
  var index = newUrl.indexOf("?");
  var strippedUrl = index === -1 ? newUrl : newUrl.substring(0, index);
  console.log(strippedUrl);

  localStorage.setItem("songRequest_appUrl", strippedUrl);
}
