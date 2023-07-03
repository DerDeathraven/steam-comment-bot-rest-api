# Steam Comment Bot Rest API

A Rest API for the [Steam Comment Bot](https://github.com/HerrEurobeat/steam-comment-service-bot)

## Headless

This Plugin supports headless mode. This deactivates the frontend but still provides all the functionality
for that change the config file like this:

```json
{
  "headless": true
}
```

## Frontend

an official frontend is currently under development. The source code can be found [here](https://github.com/DerDeathraven/steam-comment-service-bot-frontend)

version 1.0 will be shipped with this plugin when ready

## Implementation

This Plugins uses RPC to communicate with the backend
Calls look like this:
`localhost:4000/rpc/${Class}.${MethodName}?${params}`

Request can either be GET or POST for POST params are taken from the body <br />
this allows longer strings of texts or similar to be parsed

## SDK

this plugin comes with an [SDK](./Client/SDK.ts) file that helps with the development of clients

## Doc

```typescript
class Bots {
  botCount(); // returns the amount of bots present
  getBots(); // returns an array of Bot objects
  addBot(name: string, password: string); // starts the authentication process and returns the index for the steamguard function
  removeBot(name: string); // removes the specified bot from the bot pool please note that it will be back after reboot
  submitSteamGuardCode(botIndex: string, steamGuardCode: string); // enters the steamguard code
}
```

```typescript
class Settings {
  getQuoteFile(); // Returns the content of the quote file
  setQuoteFile(quoteFile: string); // sets the content of the quote file
  getPlugins(); // returns an array of installed plugins
  getBootTime(); // returns the time needed to start
}
```

```typescript
class Comment {
  comment(count: string, steamID: string); // Starts a comment que
  commentCount(); // Returns the number of comments since the last reboot
}
```
