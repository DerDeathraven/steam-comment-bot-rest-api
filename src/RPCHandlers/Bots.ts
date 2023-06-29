import SteamUser from "steam-user";
import { RPCReturnType } from "../types/PluginTypes";
import { getSteamUserInformation } from "../helpers/SteamUser";

export class Bots {
  steamGuardBots: Record<number, (code: string) => void>;
  constructor(private controller: Controller) {
    this.controller = controller;
    this.steamGuardBots = {};
  }
  botCount(): RPCReturnType<number> {
    return {
      status: 200,
      result: this.controller.getBots(undefined, false).length,
    };
  }

  async getBots(): Promise<RPCReturnType<any>> {
    const bots = this.controller.getBots(undefined, false);
    const respArray = [];
    for (let bot of bots) {
      {
        const user = bot.user as SteamUser;
        respArray.push({
          index: bot.index,
          status: bot.status,
          loginData: bot.loginData,
          name: bot.name,
          // @ts-ignore
          user: await getSteamUserInformation(user),
        });
      }
    }
    return {
      status: 200,
      result: respArray,
    };
  }
  addBot(params: {
    name: string;
    password: string;
  }): RPCReturnType<{ error: string } | { bot: number }> {
    const { name, password } = params;
    if (!name || !password) {
      return {
        status: 400,
        result: {
          error: "Missing name or password",
        },
      };
    }
    this.controller.data.logininfo[name] = {
      accountName: name,
      password: password,
      sharedSecret: "",
      steamGuardCode: null,
      machineName: `'s Comment Bot`, // For steam-user
      deviceFriendlyName: `'s Comment Bot`, // For steam-session
    };
    this.controller.login(false);
    const newIndex = Object.keys(this.controller.data.logininfo).length;
    const respObject = {
      bot: newIndex,
    };
    return {
      status: 200,
      result: respObject,
    };
  }
  removeBot(params: {
    name: string;
  }): RPCReturnType<{ error: string } | string> {
    const { name } = params;
    if (!name) {
      return {
        status: 400,
        result: {
          error: "Missing name",
        },
      };
    }
    delete this.controller.data.logininfo[name];
    delete this.controller.bots[name];

    this.controller.login(false);

    return {
      status: 200,
      result: "ok",
    };
  }
  _addSteamguardBot(index: number, submitCode: (code: string) => void) {
    this.steamGuardBots[index] = submitCode;
  }
  submitSteamGuardCode(params: {
    botIndex: number;
    steamGuardCode: string;
  }): RPCReturnType<string> {
    const { botIndex, steamGuardCode } = params;
    if (!botIndex || !steamGuardCode) {
      return {
        status: 400,
        result: {
          error: "Missing botIndex or steamGuardCode",
        },
      };
    }
    if (!botIndex) {
      return {
        status: 400,
        result: {
          error: "botIndex is required",
        },
      };
    }
    const submitCode = this.steamGuardBots[botIndex];
    if (submitCode) {
      submitCode(steamGuardCode);
      return {
        status: 200,
        result: "Success",
      };
    }
    return {
      status: 400,
      result: {
        error: "botIndex is invalid",
      },
    };
  }
}
