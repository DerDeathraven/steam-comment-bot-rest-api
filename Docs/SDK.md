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
