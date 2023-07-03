type CommandDescription = {
  name: string;
  description: string;
  args: CommandArgDescription[];
};
type CommandArgDescription = {
  name: string;
  description: string;
  type: string;
};
export const commands: Array<CommandDescription> = [
  {
    name: "comment",
    description: "Commands the bots to comment on a account or group",
    args: [
      {
        name: "amount",
        description: "The ammount to comment",
        type: "string",
      },
      {
        name: "steamID",
        description: "The steamID or groupID to comment on",
        type: "string",
      },
    ],
  },
];
