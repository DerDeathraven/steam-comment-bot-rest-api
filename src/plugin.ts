import express from "express";
import { RPCReturnType, Steambot_Plugin } from "./types/PluginTypes";
import SteamUser from "steam-user";
import {
  getSteamUserInformation,
  getSteamUserProfile,
} from "./helpers/SteamUser";
import bodyParser from "body-parser";
import { getBotsResponse } from "./types/ReturnTypes";
import { readFileSync, readdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import { Bots } from "./RPCHandlers/Bots";
import { CommentHandler } from "./RPCHandlers/Comment";
import { Settings } from "./RPCHandlers/Settings";
import { Docs } from "./RPCHandlers/Docs";

enum PluginState {
  NOT_LOADED,
  LOADING,
  LOADED,
}

type RPCHandlers = {
  Bots: Bots;
  Comment: CommentHandler;
  Settings: Settings;
  Docs: Docs
};

const DEV_FLAG = true;
class Plugin implements Steambot_Plugin {
  private currentState: PluginState;
  private controller: PluginSystem["controller"];
  private commandHandler: PluginSystem["commandHandler"];
  private reloadPlugins: PluginSystem["reloadPlugins"];
  private pluginSystem: PluginSystem;
  private rpcHandlers: RPCHandlers;
  private config: Record<string, string>;
  app: ReturnType<typeof express>;

  constructor(sys: PluginSystem) {
    this.reloadPlugins = sys.reloadPlugins;
    this.currentState = PluginState.NOT_LOADED;
    this.app = express();
    this.controller = sys.controller;
    this.commandHandler = sys.commandHandler;
    this.config = {};
    this.pluginSystem = sys;
    const SettingsHandler = new Settings(this.controller)
    this.rpcHandlers = {
      Bots: new Bots(this.controller),
      Comment: new CommentHandler(this.commandHandler, this.controller),
      Settings: SettingsHandler,
      Docs: new Docs(SettingsHandler)
    };
  }
  async loadConfig() {
    const config = await this.pluginSystem.loadPluginConfig(
      "steam-comment-bot-rest"
    );
    this.config = config as Record<string, string>;
  }
  async load() {
    await this.loadConfig();
    this.currentState = PluginState.LOADING;
    this.app.get("/", (req, res) => {
      const paths = this.app._router.stack;
      const cleanPaths = paths.map(
        (layer: any) =>
          `<a href="${layer.route?.path}">${layer.route?.path}</a>`
      );
      const filteredPaths = new Set(cleanPaths);
      res.send([...filteredPaths].join("<br/>"));
    });
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.get("/api/state", (req, res) => {
      res.send({ state: this.currentState });
    });

    this.app.get("/dev/reload", (req, res) => {
      this.reloadPlugins();
    });
    if (this.config.headless !== undefined && !this.config.headless) {
      logger("info", "[REST-API] Serving Frontend on http://localhost:4000");
      this.loadFrontendFunctions();
    } else {
      logger("info", "[REST-API] Starting headless mode");
    }
    this.startRPCHandlers();

    this.app.listen(this.config.port || 4000);
  }

  /**
   * Those are endpoints that extend the functionality of the frontend
   * and are not needed in headless mode.
   */
  loadFrontendFunctions() {
    this.app.get("/frontend/getSteamProfile", async (req, res) => {
      const user = req.query.user as string;
      res.send(await getSteamUserProfile(user));
    });
    this.app.get("/frontend/getLatestChangelog", async (req, res) => {
      const changelogPath = resolve(
        process.cwd(),
        "docs",
        "wiki",
        "changelogs"
      );
      const changelogFolder = readdirSync(changelogPath).sort();
      const latestChangelog = changelogFolder.pop();
      if (!latestChangelog) {
        res.status(404).send();
      }
      const fileContent = readFileSync(
        resolve(changelogPath, latestChangelog!),
        "utf8"
      );
      res.send({ file: fileContent });
    });
  }

  ready() {
    this.currentState = PluginState.LOADED;
  }
  steamGuardInput(bot: Bot, submitCode: (code: string) => void) {
    this.rpcHandlers.Bots._addSteamguardBot(bot.index, submitCode);
  }
  startRPCHandlers() {
    const handlers = Object.entries(this.rpcHandlers);
    for (const [index, handler] of handlers) {
      const prototype = Object.getPrototypeOf(handler);
      const functions = Object.getOwnPropertyNames(prototype);

      for (const name of functions) {
        //@ts-expect-error
        const func = handler[name];
        const isNotFunction = typeof func !== "function";
        const startsWith_ = name.startsWith("_");
        const isConstructor = name === "constructor";

        if (isNotFunction || startsWith_ || isConstructor) {
          continue;
        }

        this.app.get("/rpc/" + index + "." + func.name, (req, res) => {
          const params = req.query;
          const result = func.bind(handler)(params);
          if (result.then) {
            result.then((result: RPCReturnType<any>) => {
              res.statusCode = result.status;
              res.send({ result: result.result });
            });
          } else {
            res.statusCode = result.status;
            res.send({ result: result.result });
          }
        });
        this.app.post("/rpc/" + index + "." + func.name, (req, res) => {
          const params = req.body;
          const result = func.bind(handler)(params);
          if (result.then) {
            result.then((result: RPCReturnType<any>) => {
              res.statusCode = result.status;
              res.send({ result: result.result });
            });
          } else {
            res.statusCode = result.status;
            res.send({ result: result.result });
          }
        });
      }
    }
  }
  unload() {}
}

module.exports = Plugin;
