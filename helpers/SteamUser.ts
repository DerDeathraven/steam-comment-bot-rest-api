import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import SteamUser from "steam-user";
import SteamID from "steamid";

export async function getSteamUserInformation(user: SteamUser) {
  return {
    steamID: user.steamID?.getSteamID64(),
    accountInformation: user.accountInfo,
    friends: user.myFriends,
    profileDump: await getSteamUserProfile(user.steamID!.getSteamID64()),
  };
}

export async function getSteamUserProfile(steamID: string) {
  const resp = await axios({
    method: "get",
    url: `https://steamcommunity.com/profiles/${steamID}?xml=1`,
    headers: {
      Accept: "application/xml",
    },
  });
  const parser = new XMLParser();
  return parser.parse(resp.data).profile;
}

export async function getSteamProfilePicture(steamID: string) {
  const account = await getSteamUserProfile(steamID);
  return account.avatarFull;
}
