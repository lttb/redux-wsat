import { createStore, applyMiddleware, compose } from 'redux';

import rootReducer from '~/reducers';
import { wsConfig } from '~/config';

import { appWSOpen, appWSClose, appWSInit } from '~/actions';
import { APP_WS_INIT } from '~/constants/ActionTypes';

import WSAT from 'redux-wsat';


const INIT_TIMEOUT = 1000;

const onSocketInit = store => store.dispatch(appWSInit());
const onSocketOpen = store => store.dispatch(appWSOpen());
const onSocketClose = store => store.dispatch(appWSClose());

export default () => {
  const wsat = WSAT((store) => {
    const ws = new WebSocket(wsConfig.url);

    ws.onerror = error => console.log('WS error', error);
    ws.onclose = () => onSocketClose(store);
    ws.onopen = () => {
      console.log('WS connection established!');

      onSocketOpen(store);
    };

    return ws;
  }, {
    actions: { INIT: APP_WS_INIT },
  });

  const store = createStore(rootReducer, {}, compose(
    applyMiddleware(wsat),
  ));

  setTimeout(() => onSocketInit(store), INIT_TIMEOUT);

  return store;
};
