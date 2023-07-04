import { Proxy, getBotsResponse } from "./types/returnTypes";
class AbstractRPC {
  static ClassName = "";
  static async _generateMethodCall(
    methodname: string,
    params: Record<string, any>
  ) {
    const method = Object.entries(params);

    let paramStr = method.length ? "?" : "";
    method.forEach(([key, value]) => {
      paramStr += `${key}=${value}&`;
    });
    const res = await fetch(
      "/rpc/" + this.ClassName + "." + methodname + paramStr
    );
    const json = await res.json();
    return json.result;
  }
  static async _generatePOSTMethodCall(methodname, params) {
    const res = await fetch("/rpc/" + this.ClassName + "." + methodname, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    const json = await res.json();
    return json.result;
  }
}

export class Bots extends AbstractRPC {
  static ClassName = "Bots";
  public static async getBots(): Promise<getBotsResponse> {
    return await this._generateMethodCall("getBots", {});
  }
  public static async botCount(): Promise<number> {
    return await this._generateMethodCall("botCount", {});
  }
  public static async addBot(
    name: string,
    password: string
  ): Promise<{ error: string } | number> {
    return await this._generateMethodCall("addBot", { name, password });
  }
  public static async submitSteamGuardCode(
    botIndex: number,
    steamGuardCode: string
  ) {
    return await this._generateMethodCall("submitSteamGuardCode", {
      botIndex,
      steamGuardCode,
    });
  }
  public static async removeBot(name: string) {
    return await this._generateMethodCall("removeBot", { name });
  }
}

export class Settings extends AbstractRPC {
  static ClassName = "Settings";
  public static async getQuoteFile() {
    return await this._generateMethodCall("getQuoteFile", {});
  }
  public static async setQuoteFile(quoteFile: string) {
    return await this._generatePOSTMethodCall("setQuoteFile", { quoteFile });
  }
  public static async getPlugins() {
    return await this._generateMethodCall("getPlugins", {});
  }
  public static async getProxies(): Promise<Proxy[]> {
    return await this._generateMethodCall("getProxies", {});
  }
  public static async addProxy(proxy: Proxy) {
    return await this._generatePOSTMethodCall("addProxy", { proxy });
  }
  public static tailConsoleFile() {
    return new EventSource("/rpc/Settings.tailConsoleFile");
  }
}

export class Comments extends AbstractRPC {
  static ClassName = "Comment";
  public static async comment(count: string, steamID: string) {
    return await this._generateMethodCall("comment", { count, steamID });
  }
  public static async commentCount() {
    return await this._generateMethodCall("commentCount", {});
  }
}

export class Docs extends AbstractRPC {
  static ClassName = "Docs";
  public static async getDocFolders() {
    return await this._generateMethodCall("getDocFolders", {});
  }
  public static async getDocFile(file: string) {
    return await this._generateMethodCall("getDocFile", { file });
  }
  public static async getLatestChangelog() {
    return await this._generateMethodCall("getLatestChangelog", {});
  }
}

export class Frontend extends AbstractRPC {
  static ClassName = "Frontend";
  public static async getSteamProfile(steamID: string) {
    return await this._generateMethodCall("getSteamProfile", { steamID });
  }
}

export class Commands extends AbstractRPC {
  static ClassName = "Commands";
  public static async getCommandList() {
    return await this._generateMethodCall("getCommandList", {});
  }
  public static async executeCommand(command: string, args: any[]) {
    return await this._generateMethodCall("executeCommand", { command, args });
  }
}
