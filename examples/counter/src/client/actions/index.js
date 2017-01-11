import * as types from '../constants/ActionTypes';


export const counterIncrement = () => ({
  type: types.COUNTER_INCREMENT,
});

export const counterDecrement = () => ({
  type: types.COUNTER_DECREMENT,
});


export const appWSInit = () => ({
  type: types.APP_WS_INIT,
});

export const appWSOpen = () => ({
  type: types.APP_WS_OPEN,
  wsat: false,
});

export const appWSClose = () => ({
  type: types.APP_WS_CLOSE,
  wsat: false,
});
