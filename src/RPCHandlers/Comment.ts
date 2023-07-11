import { RPCReturnType } from "../types/PluginTypes";
import { resInfo } from "../types/ResInfoObj";

export class CommentHandler {
  constructor(
    private commandHandler: CommandHandler,
    private controller: Controller
  ) {
    this.commandHandler = commandHandler;
    this.controller = controller;
  }
  comment(params: { count: string; steamID: string, resInfo: resInfo }): RPCReturnType<string> {
    const { count, steamID, resInfo } = params;
    if (!count || !steamID) {
      return {
        status: 400,
        result: "count and steamId are required",
      };
    }

    this.commandHandler.runCommand(
      "comment",
      [count, steamID],
      () => {},
      this,
      resInfo
    );
    return {
      status: 200,
      result: "ok",
    };
  }
  commentCount(): RPCReturnType<number> {
    return {
      status: 200,
      // @ts-ignore
      result: this.controller.info.commentCounter,
    };
  }
}
