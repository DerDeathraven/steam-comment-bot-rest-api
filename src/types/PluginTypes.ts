import EventEmitter from "events";

export interface Steambot_Plugin {
  load: () => void;
  unload?: () => void;
  ready?: () => void;
}

export type RPCReturnType<T extends any> = {
  result: { error: string } | T;
  status: number;
};
