import EventEmitter from "events";

export interface Steambot_Plugin {
  load: () => void;
  unload?: () => void;
  ready?: () => void;
}



export type PluginInterface = {
  controller: Controller;
};
