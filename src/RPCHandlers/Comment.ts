import { RPCReturnType } from "../types/PluginTypes";

export class CommentHandler {
  constructor(
    private commandHandler: CommandHandler,
    private controller: Controller
  ) {
    this.commandHandler = commandHandler;
    this.controller = controller;
  }
  comment(params: { count: string; steamID: string }): RPCReturnType<string> {
    const { count, steamID } = params;
    if (!count || !steamID) {
      return {
        status: 400,
        result: "count and steamId are required",
      };
    }

    this.commandHandler.runCommand(
      "comment",
      [count, steamID],
      steamID,
      () => {},
      this,
      {}
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
