export enum EStatus {
  OFFLINE,
  ONLINE,
  ERROR,
  SKIPPED,
  POSTPONED
}

export type getBotsResponse = {
  /**
   * Login index of this bot account
   */
  index: number;
  /**
   * Status of this bot account
   */
  status: EStatus;

  /**
   * Additional login related information for this bot account
   */
  loginData: any;
  user: {
    accountInformation: {
      name: string;
      country: string;
      authedMachines: number;
      facebookID: string;
      facebookName: string;
      flags: number;
    };
    friends: Record<string, number>;
    profileDump: {
      avatarFull: string;
      avatarIcon: string;
      avatarMedium: string;
      customURL: string;
      groups: {
        group: string[];
      };
      headline: string;
      hoursPlayed2Wk: number;
      isLimitedAccount: number;
      location: string;
      memberSince: string;
      onlineState: string;
      privacyState: string;
      realname: string;
      stateMessage: string;
      steamID: string;
      steamID64: string;
      steamRating: string;
      summary: string;
      tradeBanState: string;
      vacBanned: number;
      visibiliyState: number;
    };
    steamID: string;
  };
}[];
