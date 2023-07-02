import { getSteamUserProfile } from "../helpers/SteamUser";
import { RPCReturnType } from "../types/PluginTypes";

export class Frontend {
  constructor() {}
  async getSteamProfile(params: {
    steamID: string;
  }): Promise<RPCReturnType<any>> {
    const { steamID } = params;
    if (!steamID) {
      return {
        status: 400,
        result: {
          error: "user is required",
        },
      };
    }
    return {
      status: 200,
      result: await getSteamUserProfile(steamID),
    };
  }
}
