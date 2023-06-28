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

enum PluginState {
  NOT_LOADED,
  LOADING,
  LOADED,
}

type RPCHandlers = {
  Bots: Bots;
  Comment: CommentHandler;
  Settings: Settings;
};

const DEV_FLAG = true;
class Plugin implements Steambot_Plugin {
  private currentState: PluginState;
  private controller: PluginSystem["controller"];
  private commandHandler: PluginSystem["commandHandler"];
  private reloadPlugins: PluginSystem["reloadPlugins"];
  private steamGuardBots: Record<number, (code: string) => void> = {};
  private rpcHandlers: RPCHandlers;
  app: ReturnType<typeof express>;

  constructor(sys: PluginSystem) {
    this.reloadPlugins = sys.reloadPlugins;
    this.currentState = PluginState.NOT_LOADED;
    this.app = express();
    this.controller = sys.controller;
    this.commandHandler = sys.commandHandler;
    this.rpcHandlers = {
      Bots: new Bots(this.controller),
      Comment: new CommentHandler(this.commandHandler, this.controller),
      Settings: new Settings(this.controller),
    };
  }
  load() {
    this.currentState = PluginState.LOADING;
    this.app.get("/", (req, res) => {
      if (DEV_FLAG) {
        res.redirect("http://localhost:5173");
      }
    });
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.get("/api/state", (req, res) => {
      res.send({ state: this.currentState });
    });

    this.app.get("/dev/reload", (req, res) => {
      this.reloadPlugins();
    });

    this.loadFrontendFunctions();
    this.startRPCHandlers();

    this.app.listen(4000);
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
      const functions = Object.getOwnPropertyNames(
        Object.getPrototypeOf(handler)
      );
      for (const name of functions) {
        //@ts-expect-error
        const func = handler[name];
        if (
          typeof func !== "function" ||
          name.startsWith("_") ||
          name === "constructor"
        ) {
          continue;
        }
        console.log("/rpc/" + index + "." + func.name);

        this.app.get("/rpc/" + index + "." + func.name, async (req, res) => {
          const params = req.query;
          console.log(params);
          const result = func.bind(handler)(params);
          console.log(result);
          if (result.then) {
            result.then((result: RPCReturnType) => {
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
}

module.exports = Plugin;
