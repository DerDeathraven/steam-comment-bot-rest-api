import { readFileSync, writeFileSync } from "fs";
import { RPCReturnType } from "../types/PluginTypes";

export class Settings {
  constructor(private controller: Controller) {
    this.controller = controller;
  }
  getQuoteFile(): RPCReturnType {
    const file = readFileSync(process.cwd() + "/quotes.txt", "utf8");
    return {
      result: file,
      status: 200,
    };
  }
  setQuoteFile(params: { quoteFile: string }): RPCReturnType {
    const file = params.quoteFile;
    console.log(file);
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
  getPlugins(): RPCReturnType {
    const plugins = Object.keys(this.controller.pluginSystem.pluginList);

    return {
      result: plugins,
      status: 200,
    };
  }
}
