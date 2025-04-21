export type CommandDescription = {
  name: string;
  description: string;
  args: CommandArgDescription[];
};
export type CommandArgDescription = {
  name: string;
  description: string;
  type: string;
};
export const commands: Array<CommandDescription> = [
  {
    name: "help",
    description:
      "Returns a list of commands available to you and a link to the commands documentation wiki page",
    args: [],
  },
  {
    name: "comment",
    description:
      "Request comments from all available bot accounts for a profile, group, sharedfile, discussion or review",
    args: [
      {
        name: "amount",
        description: "The amount of comments to request",
        type: "string",
      },
      {
        name: "ID",
        description:
          "The link, steamID64 or vanity of the profile, group, sharedfile, discussion or review to comment on (Owner only)",
        type: "steamID64",
      },
      {
        name: "custom quotes",
        description:
          "Array of strings to use as quotes in this comment request instead of the default quotes.txt set (Owner only)",
        type: "string",
      },
    ],
  },
  {
    name: "upvote",
    description:
      "Upvotes a sharedfile/review with all bot accounts that haven't yet voted on that item. Requires unlimited accounts!",
    args: [
      {
        name: "amount",
        description: "The amount of upvotes to request",
        type: "string",
      },
      {
        name: "ID",
        description: "The link/id of the sharedfile or link of the review to vote on",
        type: "string",
      },
    ],
  },
  {
    name: "downvote",
    description:
      "Downvotes a sharedfile/review with all bot accounts that haven't yet voted on that item. Requires unlimited accounts! (Owner only)",
    args: [
      {
        name: "amount",
        description: "The amount of downvotes to request",
        type: "string",
      },
      {
        name: "ID",
        description: "The link/id of the sharedfile or link of the review to vote on",
        type: "string",
      },
    ],
  },
  {
    name: "funnyvote",
    description:
      "Votes with funny on a review with all bot accounts that haven't yet voted on that item. Requires unlimited accounts!",
    args: [
      {
        name: "amount",
        description: "The amount of funnyvotes to request",
        type: "string",
      },
      {
        name: "ID",
        description: "The link of the review to vote on",
        type: "string",
      },
    ],
  },
  {
    name: "favorite",
    description:
      "Favorizes a sharedfile with all bot accounts that haven't yet favorized that item",
    args: [
      {
        name: "amount",
        description: "The amount of favorites to request",
        type: "string",
      },
      {
        name: "ID",
        description: "The link or sharedfile ID to vote on",
        type: "string",
      },
    ],
  },
  {
    name: "unfavorite",
    description:
      "Unfavorizes a sharedfile with all bot accounts that have favorized that item. (Owner only)",
    args: [
      {
        name: "amount",
        description: "The amount of unfavorites to request",
        type: "string",
      },
      {
        name: "ID",
        description: "The link or sharedfile ID to vote on",
        type: "string",
      },
    ],
  },
  {
    name: "follow",
    description:
      "Follows a user/curator/workshop item with all bot accounts that haven't yet done so",
    args: [
      {
        name: "amount",
        description: "The amount of follows to request",
        type: "string",
      },
      {
        name: "ID",
        description: "The link, steamID64 or vanity of the profile/curator/workshop item to follow (Owner only)",
        type: "string",
      },
    ],
  },
  {
    name: "unfollow",
    description:
      "Unfollows a user/curator/workshop item with all bot accounts that have followed them",
    args: [
      {
        name: "amount",
        description: "The amount of unfollows to request",
        type: "string",
      },
      {
        name: "ID",
        description: "The link, steamID64 or vanity of the profile/curator/workshop item to unfollow (Owner only)",
        type: "string",
      },
    ],
  },
  {
    name: "ping",
    description:
      "Returns ping in ms to Steam's servers. Can be used to check if the bot is responsive",
    args: [],
  },
  {
    name: "info",
    description:
      "Returns useful information and statistics about the bot and you",
    args: [],
  },
  {
    name: "owner",
    description: "Returns a link to the owner's profile set in the config.json",
    args: [],
  },
  {
    name: "group",
    description:
      "Sends an invite or responds with the group link set as yourgroup in the config",
    args: [],
  },
  {
    name: "abort",
    description:
      "Abort your own comment process or one on another ID you have started. Owners can also abort requests started by other users",
    args: [
      {
        name: "ID",
        description:
          "The link, steamID64 or vanity of the profile, group or sharedfile to abort the request of",
        type: "string",
      },
    ],
  },
  {
    name: "resetcooldown",
    description:
      "Clear your, the ID's or the comment cooldown of all bot accounts (global). (Owner only)",
    args: [
      {
        name: 'ID or "global"',
        description:
          "The link, steamID64 or vanity of the profile to clear the cooldown of or the word global to clear the cooldown of all bot accounts",
        type: "string",
      },
    ],
  },
  {
    name: "settings",
    description: "Change a value in the config. (Owner only)",
    args: [
      {
        name: "config key",
        description: "Name of the config key to update",
        type: "string",
      },
      {
        name: "new value",
        description: "New value of the config key",
        type: "string",
      },
    ],
  },
  {
    name: "lang",
    description: "Changes the language the bot will reply to you in. Call without params to see all supported languages.",
    args: [
      {
        name: "language",
        description: "Name of the language",
        type: "string",
      },
    ],
  },
  {
    name: "failed",
    description:
      "Displays the exact errors of the last request for your profile. Alternatively provide an ID of a request you have started. Owners can also view errors for requests started by other users.",
    args: [
      {
        name: "ID",
        description:
          "The link, steamID64 or vanity of the profile, group or sharedfile to view the errors of",
        type: "steamID64",
      },
    ],
  },
  {
    name: "sessions",
    description: "Displays all active requests. (Owner only)",
    args: [],
  },
  {
    name: "mysessions",
    description: "Displays all active requests that you have started.",
    args: [],
  },
  {
    name: "about",
    description:
      "Displays information about this project. The message also contains a disclaimer as well as a link to the owner's profile set in the config.json",
    args: [],
  },
  {
    name: "addfriend",
    description:
      "Adds the ID with amount/all available bot accounts. Requires unlimited accounts! (Owner only)",
    args: [
      {
        name: "amount",
        description: "The amount of accounts to request to add",
        type: "string",
      },
      {
        name: "ID",
        description: "The link, steamID64 or vanity of the profile to add",
        type: "string",
      },
    ],
  },
  {
    name: "unfriend",
    description:
      "Unfriends a user from all logged in accounts. (Owner only) Providing no argument will let all bots unfriend you. (Available to normal users)",
    args: [
      {
        name: "ID",
        description: "The link, steamID64 or vanity of the profile to unfriend",
        type: "steamID64",
      },
    ],
  },
  {
    name: "unfriendall",
    description: "Unfriends everyone with all bot accounts. (Owner only)",
    args: [
      {
        name: '"abort"',
        description: "Aborts a unfriendall request if it did not start yet",
        type: "string",
      },
    ],
  },
  {
    name: "joingroup",
    description: "Joins a Steam Group with amount/all available bot accounts. (Owner only)",
    args: [
      {
        name: "amount",
        description: "The amount of accounts to request to join",
        type: "string",
      },
      {
        name: "ID",
        description: "The link or groupID64 of the group to join",
        type: "string",
      },
    ],
  },
  {
    name: "leavegroup",
    description: "Leaves a group with all bot accounts. (Owner only)",
    args: [
      {
        name: "ID",
        description: "The link or groupID64 of the group to leave",
        type: "string",
      },
    ],
  },
  {
    name: "leaveallgroups",
    description: "Leaves all groups with all bot accounts. (Owner only)",
    args: [
      {
        name: '"abort"',
        description: "Aborts a leaveallgroups request if it did not start yet",
        type: "string",
      },
    ],
  },
  {
    name: "block",
    description: "Blocks a user with all bot accounts on Steam. (Owner only)",
    args: [
      {
        name: "ID",
        description: "The link, steamID64 or vanity of the profile to block",
        type: "steamID64",
      },
    ],
  },
  {
    name: "unblock",
    description:
      "Unblocks a user with all bot accounts on Steam. Note: The user can still get ignored by Steam for a while. (Owner only)",
    args: [
      {
        name: "ID",
        description: "The link, steamID64 or vanity of the profile to unblock",
        type: "steamID64",
      },
    ],
  },
  {
    name: "jobs",
    description: "Lists all currently registered jobs (Owner only)",
    args: [],
  },
  {
    name: "reload",
    description:
      "Reloads all commands and plugins without needing to restart. Please only use it for testing/development. (Owner only)",
    args: [],
  },
  {
    name: "restart",
    description:
      "Restarts the bot and checks for available updates. (Owner only)",
    args: [],
  },
  {
    name: "stop",
    description: "Stops the bot. (Owner only)",
    args: [],
  },
  {
    name: "update",
    description:
      "Checks for an available update and installs it if automatic updates are enabled and no requests are active. 'true' forces an update. Blocks new requests if it currently waits for one to be completed. (Owner only)",
    args: [
      {
        name: '"true"',
        description: "Forces an update",
        type: "string",
      },
    ],
  },
  {
    name: "log",
    description: "Shows the last 15 lines of the log. (Owner only)",
    args: [],
  },
  {
    name: "plugins",
    description: "Lists all installed plugins. (Owner only)",
    args: [],
  },
  {
    name: "manage",
    description: "Interact with the manage module to administrate the active set of bot accounts. (Owner only)",
    args: [
      {
        name: "mode",
        description: `Available modes: 'addAccount, removeAccount, filterAccounts, proxyStatus'`,
        type: "string",
      },
      {
        name: "argument",
        description: "Argument(s) the selected mode requires. Run command without this parameter to display help for the selected mode",
        type: "string",
      }
    ],
  },
  {
    name: "stats",
    description: "Returns statistics about the amount of fulfilled requests.",
    args: [],
  },
];
