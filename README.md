# Redux Websocket Action Transfer

This package allows to create middleware that transfer **redux actions** between client and server via websocket.

## Why?

With Redux we can think in this way: our UI actions that we need to save to store we can describe as **redux-actions**.
We also have some UI-component logic, for example, that we can save only in UI Component State, but we don't need to save them to server.
So let's talk about only those actions, that we want so save to the store and to the server.

And we familiar with constructions like `crud.updateUser(...)` in the different places in the code.
Well, we use `redux-saga` and a lot of other great libs, but mostly, in my opinion, we need to **just keep the action**.

**The main point** of this project is moving **redux actions** to the next level of services interactions and use it like messaging protocol between different service components, not only frontend. 
It can be useful for realtime applications with microservice architecture.

For example, your app sends actions from client to relay that passes them into the Service Bus, where they handle by workers. Then workers send results to Service Bus like action again, and relay passes them to all clients, that need.

And on each service layer *action types* may be common or specified with conversions.

It also allows you to get rid of such this in your code: `crud.updateUser(...)`, because all action that you would like to send on server will send automatically.

> You can initialize WS-connection asynchronously by *action type* - pass it in options like: `
{ actions: { INIT } } `
> See [counter](https://github.com/lttb/redux-wsat/tree/master/examples/counter) for example.


## Usage

The default data-flow is:

1) UI produced some action;
2) WSAT middleware;
3) server handle that action and send to clients action that they need to dispatch;
4) clients recieve action from server, dispatch and update UI.

This flow allows you to have one data-flow direction and have more consistent data, espacially for collaborative working.


ReduxWSAT takes two arguments:

- *WebSocket Initor* (required). Returns socket or something that resolves `onmessage` and `onclose` (optional, for reconnect) and represent the interface like [native WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket): 
  - `{ onmessage, onclose, onerror }` - optional, for events handling from WSAT;
  - `{ send }` - required, for message sending to server.
- options. `{ retry: { timeout }, actions: { INIT }, helpers: { isWSAT, prepareAction, getAction, isClientFirst } }`
  - `retry: { timeout }` By default retries to connect without timeout;
  - `actions: { INIT }` By default {}. `INIT` is *action type* for async socket initialization;
  - `helpers: { isWSAT, prepareAction, getAction, isClientFirst }`
    - `isWSAT` - checks action for server sending. By default send all actions but `action.wsat === false`
    - `prepareAction` - prepare action for sending to server. By default `action => JSON.stringify({ action })`
    - `getAction` - returns action that received from socket, that would be dispatched (if Boolean(result)). By default return `{ wsat: false, ...action }`
    - `isClientFirst` - checks if you need to dispatch that action on client too. Be careful, you can dispatch this action twice, if server send this action back to author

Let's say we have this *configureStore.js*:

```js
import { createStore, applyMiddleware, compose } from 'redux';

import WSAT from 'redux-wsat';

import rootReducer from '~/reducers';
import { wsConfig } from '~/config';

export default () => {
  const wsat = WSAT(() => {
    const socket = new WebSocket(wsConfig.url);

    socket.onerror = error => console.log('WS error', error);
    socket.onclose = () => console.log('WS connection closed');
    socket.onopen = () => console.log('WS connection established');

    return socket;
  });

  const store = createStore(rootReducer, {}, compose(
    applyMiddleware(wsat),
  ));

  return store;
};
```

And stateless server, that keeps websocket connections and send received messages to all clients:
```js
wss.on('connection', ws =>
  ws.on('message', message =>
    wss.clients.forEach(client => client.send(message))));
```

So thats it - we send all **actions** from client to server and then transfer them for each client (includes author), where they dispatch and update clients store and UI.


You can also check [counter example](https://github.com/lttb/redux-wsat/tree/master/examples/counter) with async socket initialization and action dispatch in socket event listners
