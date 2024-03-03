import { readFileSync, writeFileSync } from "fs";
import { RPCReturnType } from "../types/PluginTypes";
import { Response } from "express";
import { Tail } from "tail";
export type Proxy = {
  port: string;
  host: string;
  username: string;
  password: string;
};
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
  getProxies(): RPCReturnType<Proxy[]> {
    const filteredProxies = this.controller.data.proxies;
    const proxies: Proxy[] = filteredProxies.map((e) => {
      const [userPass, hostPort] = e.proxy.split("@");
      const user = userPass.split(":")[0];
      const pass = userPass.split(":")[1];
      const [host, port] = hostPort.split(":");
      return {
        host,
        port,
        username: user,
        password: pass,
      };
    });
    return {
      result: proxies,
      status: 200,
    };
  }
  addProxy(params: { proxy: Proxy }): RPCReturnType<string> {
    const proxy = params.proxy;
    if (!proxy.host || !proxy.port || !proxy.username || !proxy.password) {
      return {
        result: { error: "Invalid proxy" },
        status: 400,
      };
    }
    const dataManager = this.controller.data;
    dataManager.proxies.push({
      proxyIndex: dataManager.proxies.length,
      proxy: `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`,
      isOnline: true,
      lastOnlineCheck: 0
    });
    dataManager.writeProxiesToDisk();
    return {
      result: "ok",
      status: 200,
    };
  }
  tailConsoleFile(params: {}, res: Response): Promise<RPCReturnType<string>> {
    return new Promise((resolve, reject) => {
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders(); // flush the headers to establish SSE with client
      const path = process.cwd() + "/output.txt";
      const outputFile = new Tail(path);
      outputFile.on("line", (line) => {
        res.write(`data:${line}\n\n`);
      });

      res.on("close", () => {
        outputFile.unwatch();
        res.end();
        reject({
          result: "ok",
          status: 600,
        });
      });
    });
  }
}
