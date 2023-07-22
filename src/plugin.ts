import express from "express";
import { RPCReturnType, Steambot_Plugin } from "./types/PluginTypes";
import bodyParser from "body-parser";
import { Bots } from "./RPCHandlers/Bots";
import { CommentHandler } from "./RPCHandlers/Comment";
import { Settings } from "./RPCHandlers/Settings";
import { Docs } from "./RPCHandlers/Docs";
import { Frontend } from "./RPCHandlers/Frontend";
import { Commands } from "./RPCHandlers/Commands";
import { Server, createServer } from "http";
import { readdirSync } from "fs";
import { resolve } from "path";

enum PluginState {
  NOT_LOADED,
  LOADING,
  LOADED,
}

type RPCHandlers = {
  Bots: Bots;
  Comment: CommentHandler;
  Settings: Settings;
  Docs: Docs;
  Frontend?: Frontend;
  Commands: Commands;
};

class Plugin implements Steambot_Plugin {
  private currentState: PluginState;
  private controller: PluginSystem["controller"];
  private commandHandler: PluginSystem["commandHandler"];
  private reloadPlugins: PluginSystem["reloadPlugins"];
  private pluginSystem: PluginSystem;
  private rpcHandlers: RPCHandlers;
  private config: Record<string, string>;
  app: ReturnType<typeof express>;
  private server: Server;
  private pluginCommandHandler: Record<string, any>;

  constructor(sys: PluginSystem) {
    this.reloadPlugins = sys.reloadPlugins.bind(sys);
    this.currentState = PluginState.NOT_LOADED;
    this.app = express();
    this.controller = sys.controller;
    this.commandHandler = sys.commandHandler;
    this.config = {};
    this.pluginSystem = sys;
    this.server = createServer(this.app);
    this.pluginCommandHandler = {};
    const SettingsHandler = new Settings(this.controller);

    //@ts-expect-error
    sys.addRPCPlugin = this.addPluginHandler.bind(this);

    this.rpcHandlers = {
      Bots: new Bots(this.controller),
      Comment: new CommentHandler(this.commandHandler, this.controller),
      Settings: SettingsHandler,
      Docs: new Docs(SettingsHandler),
      Commands: new Commands(this.commandHandler, this.controller),
    };
  }
  async loadConfig() {
    const config = await this.pluginSystem.loadPluginConfig(
      "steam-comment-bot-rest"
    );
    this.config = config as Record<string, string>;
  }
  addPluginHandler(pluginName: string, handler: any) {
    try {
      handler = new handler(this);
    } catch (e) {
      logger("error", `Error loading plugin ${pluginName}: ${e}`);
    }
    this.pluginCommandHandler[pluginName] = handler;
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
      if (!this.config.devMode) {
        res.sendStatus(403);
        return;
      }
      res.sendStatus(200);

      this.reloadPlugins();
    });
    if (this.config.headless !== undefined && !this.config.headless) {
      logger("info", "[REST-API] Serving Frontend on http://localhost:4000");
      this.loadFrontendFunctions();
    } else {
      logger("info", "[REST-API] Starting headless mode");
    }
    this.startRPCHandlers();

    this.server.listen(this.config.port || 4000);
  }

  /**
   * Those are endpoints that extend the functionality of the frontend
   * and are not needed in headless mode.
   */
  loadFrontendFunctions() {
    this.rpcHandlers.Frontend = new Frontend();
  }

  ready() {
    this.currentState = PluginState.LOADED;
  }
  steamGuardInput(bot: Bot, submitCode: (code: string) => void) {
    this.rpcHandlers.Bots._addSteamguardBot(bot.index, submitCode);
  }
  startRPCHandlers() {
    const handlers = Object.entries(this.rpcHandlers);
    const pluginHandlers = Object.entries(this.pluginCommandHandler);
    this._startRPCHandlers(handlers);
    try {
      this._startRPCHandlers(pluginHandlers);
    } catch (e) {
      logger("error", `Error loading plugin RPC Handler: ${e}`);
    }
  }
  _startRPCHandlers(handlers: any) {
    for (const [index, handler] of handlers) {
      const prototype = Object.getPrototypeOf(handler);
      const functions = Object.getOwnPropertyNames(prototype);

      for (const name of functions) {
        const func = handler[name];
        const isNotFunction = typeof func !== "function";
        const startsWith_ = name.startsWith("_");
        const isConstructor = name === "constructor";

        if (isNotFunction || startsWith_ || isConstructor) {
          continue;
        }

        this.app.get("/rpc/" + index + "." + func.name, (req, res) => {
          const params = req.query;
          const result = func.bind(handler)(params, res);

          if (result.then) {
            result
              .then((result: RPCReturnType<any>) => {
                res.statusCode = result.status;
                res.send({ result: result.result });
              })
              .catch((err: Error) => {});
          } else {
            res.statusCode = result.status;
            res.send({ result: result.result });
          }
        });
        this.app.post("/rpc/" + index + "." + func.name, (req, res) => {
          console.log("test");
          const params = req.body;
          const result = func.bind(handler)(params, res);
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
  unload() {
    this.server.close();
    readdirSync(__dirname + "/RPCHandlers").forEach((file) => {
      delete require.cache[require.resolve(__dirname + "/RPCHandlers/" + file)];
    });
  }
}

module.exports = Plugin;
