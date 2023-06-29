import { readFileSync, writeFileSync } from "fs";
import { RPCReturnType } from "../types/PluginTypes";

export class Settings {
  constructor(private controller: Controller) {
    this.controller = controller;
  }
  getQuoteFile(): RPCReturnType<string> {
    const file = readFileSync(process.cwd() + "/quotes.txt", "utf8");
    return {
      result: file,
      status: 200,
    };
  }
  setQuoteFile(params: { quoteFile: string }): RPCReturnType<string> {
    const file = params.quoteFile;
    if (!file) {
      return {
        result: "Need a File",
        status: 400,
      };
    }
    writeFileSync(process.cwd() + "/quotes.txt", file, "utf8");
    return {
      result: "ok",
      status: 200,
    };
  }
  getPlugins(): RPCReturnType<string[]> {
    const plugins = Object.keys(this.controller.pluginSystem.pluginList);

    return {
      result: plugins,
      status: 200,
    };
  }
  getBootTime(): RPCReturnType<number> {
    return {
      // @ts-ignore
      result: this.controller.info.readyAfter,
      status: 200,
    };
  }
}
