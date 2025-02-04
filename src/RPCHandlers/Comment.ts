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
  async comment(params: { count: string; steamID: string, resInfo: resInfo }): Promise<RPCReturnType<string>> {
    const { count, steamID, resInfo } = params;
    if (!count || !steamID) {
      return {
        status: 400,
        result: "count and steamId are required",
      };
    }

    const result = await this.commandHandler.runCommand(
      "comment",
      [count, steamID],
      () => {},
      this,
      resInfo
    );

    return {
      status: result.success ? 200 : 400,
      result: result.reason,
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
