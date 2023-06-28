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

## Implementation

This Plugins uses RPC to communicate with the backend
Calls look like this:
`localhost:4000/rpc/${Class}.${MethodName}?${params}`

## Doc

```typescript
class Bots {
  botCount(); // returns the amount of bots present
  getBots(); // returns an array of Bot objects
  addBot(name: string, password: string); // starts the authentication process and returns the index for the steamguard function
  submitSteamGuardCode(botIndex: string, steamGuardCode: string); // enters the steamguard code
}
```

```typescript
class Settings {
  getQuoteFile(); // Returns the content of the quote file
  setQuoteFile(quoteFile: string); // sets the content of the quote file
  getPlugins(); // returns an array of installed plugins
}
```

```typescript
class Comment {
  comment(count: string, steamID: string); // Starts a comment que
  commentCount(); // Returns the number of comments since the last reboot
}
```
