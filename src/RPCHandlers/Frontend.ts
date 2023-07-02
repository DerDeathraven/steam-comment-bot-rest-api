import { getSteamUserProfile } from "../helpers/SteamUser";
import { RPCReturnType } from "../types/PluginTypes";

export class Frontend {
  constructor() {}
  async getSteamProfile(params: { user: string }): Promise<RPCReturnType<any>> {
    const { user } = params;
    if (!user) {
      return {
        status: 400,
        result: {
          error: "user is required",
        },
      };
    }
    return {
      status: 200,
      result: await getSteamUserProfile(user),
    };
  }
}
