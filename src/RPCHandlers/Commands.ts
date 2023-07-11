import { CommandDescription, commands } from "../schemes/commands";
import { RPCReturnType } from "../types/PluginTypes";
import { resInfo } from "../types/ResInfoObj";

export class Commands {
  constructor(
    private commandHandler: CommandHandler,
    private controller: Controller
  ) {
    this.controller = controller;
    this.commandHandler = commandHandler;
  }
  getCommandList(): RPCReturnType<CommandDescription[]> {
    return {
      status: 200,
      result: commands,
    };
  }
  executeCommand(params: {
    command: string;
    args: string[];
    resInfo: resInfo;
  }): RPCReturnType<string> {
    const { command, args, resInfo } = params;
    const needsArgs = commands.find((c) => c.name === command)?.args.length;
    if (!command || (needsArgs && !args)) {
      return {
        status: 400,
        result: "Command and arguments are required",
      };
    }
    if (!commands.find((c) => c.name === command)) {
      return {
        status: 404,
        result: "Command not found",
      };
    }
    try {
      let info: any;
      this.commandHandler.runCommand(
        command,
        args,
        (context, infoData, data) => {
          console.log(data);
          info = data;
        },
        this,
        resInfo
      );
      return {
        status: 200,
        result: info,
      };
    } catch (err) {
      return {
        status: 500,
        result: "Error executing command",
      };
    }
  }
}
