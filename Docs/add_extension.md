# Adding your own RPC Handler for your plugin

this plugin allows you to add your own custom RPC handlers. Handlers have to follow the following pattern:

- every function name that doesnt start with `_` will be available as `/rpc/${plugin}.${method}`
- function should follow this pattern `function test(params: {arg1: string}, res: Response)=> RPCReturnType<any>`
- function can be sync or async
- the handler gets the instance of the rest api as an argument
