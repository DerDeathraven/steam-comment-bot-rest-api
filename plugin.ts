import express from "express";
import { PluginInterface, Steambot_Plugin } from "./types/PluginTypes";
import SteamUser from "steam-user";
import {
  getSteamUserInformation,
  getSteamUserProfile,
} from "./helpers/SteamUser";
import bodyParser from "body-parser";

enum PluginState {
  NOT_LOADED,
  LOADING,
  LOADED,
}

const DEV_FLAG = true;
class Plugin implements Steambot_Plugin {
  private currentState: PluginState;
  private controller: PluginSystem["controller"];
  private commandHandler: PluginSystem["commandHandler"];
  private reloadPlugins: PluginSystem["reloadPlugins"];
  app: ReturnType<typeof express>;
  constructor(sys: PluginSystem) {
    this.reloadPlugins = sys.reloadPlugins;
    this.currentState = PluginState.NOT_LOADED;
    this.app = express();
    this.controller = sys.controller;
    this.commandHandler = sys.commandHandler;
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
    this.app.get("/api/bots", async (req, res) => {
      const bots = this.controller.getBots(undefined, false);
      const respArray = [];
      for (let bot of bots) {
        {
          const user = bot.user as SteamUser;
          respArray.push({
            index: bot.index,
            status: bot.status,
            loginData: bot.loginData,
            user: await getSteamUserInformation(user),
          });
        }
      }
      res.send({ bots: respArray });
    });
    this.app.get("/frontend/getSteamProfile", async (req, res) => {
      const user = req.query.user as string;
      res.send(await getSteamUserProfile(user));
    });
    this.app.post("/api/comments", async (req, res) => {
      const { steamAccount, amount } = req.body;
      console.log(steamAccount, amount);
      //@ts-ignore
      // this.commandHandler.runCommand("comment", ["1", "76561198066931868"], "76561198066931868", () => {}, this, {});
      res.statusCode = 200;
      res.send();
    });
    this.app.get("/dev/reload", (req, res) => {
      this.reloadPlugins();
    });
    this.app.listen(4000);
  }
  ready() {
    this.currentState = PluginState.LOADED;
  }
}

module.exports = Plugin;
