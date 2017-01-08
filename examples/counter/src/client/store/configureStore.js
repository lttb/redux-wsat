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
