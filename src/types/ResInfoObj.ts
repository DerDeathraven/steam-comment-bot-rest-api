/**
 * Documentation of the default/commonly used content the resInfo object can/should contain
 */
export type resInfo = {
    /**
     * Prefix your command execution handler uses. This will be used in response messages referencing commands. Default: !
     */
    cmdprefix?: string;

    /**
     * ID of the user who executed this command. Will be used for command default behavior (e.g. commenting on the requester's profile), to check for owner privileges, apply cooldowns and maybe your respondModule implementation for responding. Strongly advised to include.
     */
    userID: string;

    /**
     * Can be provided to overwrite `config.ownerid` for owner privilege checks. Useful if you are implementing a different platform and so `userID` won't be a steamID64 (e.g. discord)
     */
    ownerIDs?: string[];

    /**
     * Supported by the Steam Chat Message handler: Overwrites the default index from which response messages will be cut up into parts
     */
    charLimit?: number;

    /**
     * Custom chars to search after for cutting string in parts to overwrite cutStringsIntelligently's default: [" ", "\n", "\r"]
     */
    cutChars?: string[];

    /**
     * Set to true if your command handler is receiving messages from the Steam Chat and `userID` is therefore a `steamID64`. Will be used to enable command default behavior (e.g. commenting on the requester's profile)
     */
    fromSteamChat?: boolean;

    /**
     * Do not provide this argument, you'll receive it from commands: Steam Chat Message prefixes like /me. Can be ignored or translated to similar prefixes your platform might support
     */
    prefix?: string;
};