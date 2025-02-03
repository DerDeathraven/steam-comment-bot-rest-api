import { EStatus } from "../types/ReturnTypes";

export interface Steambot_Plugin {
  load: () => void;
  unload?: () => void;
  ready?: () => void;
  statusUpdate?: (bot: Bot, oldStatus: EStatus, newStatus: EStatus) => void;
  steamGuardInput?: (bot: Bot, submitCode: (code: string) => void) => void;
  steamGuardQrCode?: (bot: Bot, challengeUrl: string) => void;
  dataUpdate?: (key: string, oldData: any, newData: any) => void;
}

export type RPCReturnType<T extends any> = {
  result: { error: string } | T;
  status: number;
};
