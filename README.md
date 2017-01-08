# Redux Websocket Action Transfer

This package allows to create middleware that transfer **redux actions** between client and server via websocket.

## Why?

The main point is moving **redux actions** to the next level of services interactions and use it like messaging protocol between different service components, not only frontend. 
It can be useful for realtime applications with microservice architecture.

For example, your app sends actions from client to relay that passes them into the Service Bus, where they hangle by workers. So then workers send results to Service Bus like action again, and relay passes them to all clients, that need.

And on each service layer *action types* may be common or specified with convertions.

## Usage
ReduxWSAT takes to args: *WebSocket Initor* (required) and options.

In the current implementation inited socket instance need to have `onclose`, `onopen` and `onmessage` event handlers like [native WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).

For example (*configureStore.js*):

```js
import { createStore, applyMiddleware, compose } from 'redux';

import reduxWSAT from 'redux-wsat';

import rootReducer from '~/reducers';
import { wsConfig } from '~/config';

export default () => reduxWSAT(() => {
  const socket = new WebSocket(
    `${wsConfig.protocol}://${wsConfig.host}`,
  );

  socket.onerror = error => console.log('WS error', error);
  socket.onclose = () => console.log('WS connection closed');
  socket.onopen = () => console.log('WS connection established');

  return socket;
}).then(({ ws }) => createStore(rootReducer, {}, compose(
  applyMiddleware(ws),
)));

```

You can also check [counter example](https://github.com/lttb/redux-wsat/tree/master/examples/counter)
