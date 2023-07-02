import { resolve } from "path";
import {  RPCReturnType } from "../types/PluginTypes";
import { existsSync, readFileSync, readdirSync } from "fs";
import { Settings } from "./Settings";

export class Docs {
  constructor(private settingsHandler: Settings) {
    this.settingsHandler = settingsHandler;

  }
  getLatestChangelog(): RPCReturnType<string> {
    const changelogPath = resolve(process.cwd(), "docs", "wiki", "changelogs");
    const changelogFolder = readdirSync(changelogPath).sort();
    const latestChangelog = changelogFolder.pop();
    if (!latestChangelog) {
      return {
        status: 404,
        result: { error: "No changelog found" },
      };
    }
    const fileContent = readFileSync(
      resolve(changelogPath, latestChangelog!),
      "utf8"
    );
    return {
      status: 200,
      result: fileContent,
    };
  }
  getDocFolders(): RPCReturnType<any> {
    const folderPath = resolve(process.cwd(), "docs", "wiki");
    const folderStructure: Record<string, string[]> = {};
    for (const file of readdirSync(folderPath)) {
      if (file.match(/\./)) {
        folderStructure[file] = [];
      } else {
        folderStructure[file] = readdirSync(resolve(folderPath, file));
      }
    }
    const resultObj = Object.assign(folderStructure, this._getPluginDocs())

    return {
      status: 200,
      result: resultObj,
    };
  }
  _getPluginDocs(){
    const plugins = this.settingsHandler.getPlugins().result as string[];
   
    const pluginDocs: Record<string,string[]> = {}
    for (const plugin of plugins) {
        const pluginPath = resolve(process.cwd(), "node_modules", plugin, "docs");
        if(!existsSync(pluginPath)) continue

        const pluginFolder = readdirSync(pluginPath);
        pluginDocs[plugin] = pluginFolder;

    }
    return pluginDocs

  }
  getDocFile(file: string): RPCReturnType<any> {
    let filePath = "";
    try {
      filePath = resolve(process.cwd(), "docs", "wiki", file);
    } catch (e) {
      return {
        status: 404,
        result: { error: "File not found" },
      };
    }
    const fileContent = readFileSync(filePath, "utf8");
    return {
      status: 200,
      result: fileContent,
    };
  }
  
}
