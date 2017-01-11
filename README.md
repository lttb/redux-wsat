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

> You can initialize WS-connection asynchronously by *action type* - pass it in options like:

> ```js
{ actions: { INIT } }
```
> See [counter](https://github.com/lttb/redux-wsat/tree/master/examples/counter) for example.


## Usage
ReduxWSAT takes to args: *WebSocket Initor* (required) and options.

In the current implementation inited socket instance need to have `onclose`, `onopen` and `onmessage` event handlers like [native WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).

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
