import { resolve } from "path";
import { RPCReturnType } from "../types/PluginTypes";
import { existsSync, readFileSync, readdirSync } from "fs";
import { Settings } from "./Settings";

export class Docs {
  constructor(private settingsHandler: Settings) {
    this.settingsHandler = settingsHandler;
  }
  getLatestChangelog(): RPCReturnType<string> {
    const changelogPath = resolve(process.cwd(), "docs", "wiki", "changelogs");
    const changelogFolder = readdirSync(changelogPath).sort((a, b) => {
      a = a.split("CHANGELOG_v").pop() || "";
      let main_version_a = a.split(".")[0];
      let sub_version_a = a.split(".")[1];

      b = b.split("CHANGELOG_v").pop() || "";
      let main_version_b = b.split(".")[0];
      let sub_version_b = b.split(".")[1];

      if (main_version_a == main_version_b) {
        if (sub_version_a == "x") return 1;
        if (sub_version_b == "x") return -1;
        if (sub_version_a == sub_version_b) return 0;
        if (parseInt(sub_version_a) < parseInt(sub_version_b)) {
          return 1;
        } else {
          return -1;
        }
      } else if (main_version_a < main_version_b) {
        return 1;
      } else {
        return -1;
      }
    });
    const latestChangelog = changelogFolder.shift();
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
    const folderStructure: {
      files: string[];
      folders: Record<string, string[]>;
      plugins: Record<string, string[]>;
    } = { files: [], folders: {}, plugins: {} };
    for (const file of readdirSync(folderPath)) {
      if (file.match(/\./)) {
        folderStructure.files.push(file);
      } else {
        folderStructure.folders[file] = readdirSync(resolve(folderPath, file));
      }
    }
    folderStructure.plugins = this._getPluginDocs();

    return {
      status: 200,
      result: folderStructure,
    };
  }
  _getPluginDocs() {
    const plugins = this.settingsHandler.getPlugins().result as string[];

    const pluginDocs: Record<string, string[]> = {};
    for (const plugin of plugins) {
      const pluginPath = resolve(process.cwd(), "node_modules", plugin, "docs");
      if (!existsSync(pluginPath)) continue;

      const pluginFolder = readdirSync(pluginPath);
      pluginDocs[plugin] = pluginFolder;
    }
    return pluginDocs;
  }
  getDocFile(params: { file: string }): RPCReturnType<any> {
    const { file } = params;
    const plugins = this.settingsHandler.getPlugins().result as string[];
    if (!file) {
      return {
        result: { error: "No file provided" },
        status: 400,
      };
    }
    let filePath = "";
    const pluginName = file.split("/")[0];
    const fileName = file.split("/")[1];
    const isPlugin = !!plugins.find((plugin) => plugin === pluginName);
    try {
      if (isPlugin) {
        filePath = resolve(
          process.cwd(),
          "node_modules",
          pluginName,
          "docs",
          fileName
        );
        const fileContent = readFileSync(filePath, "utf8");
        return {
          status: 200,
          result: fileContent,
        };
      } else {
        filePath = resolve(process.cwd(), "docs", "wiki", file);
        const fileContent = readFileSync(filePath, "utf8");
        return {
          status: 200,
          result: fileContent,
        };
      }
    } catch (e) {
      return {
        status: 404,
        result: { error: "File not found" },
      };
    }
  }
}
