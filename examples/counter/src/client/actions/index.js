import * as types from '../constants/ActionTypes';


export function counterIncrement() {
  return { type: types.COUNTER_INCREMENT };
}

export function counterDecrement() {
  return { type: types.COUNTER_DECREMENT };
}
