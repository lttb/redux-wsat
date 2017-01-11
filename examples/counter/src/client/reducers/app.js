import { handleActions } from 'redux-actions';
import { APP_WS_OPEN, APP_WS_CLOSE } from '~/constants/ActionTypes';

export default handleActions({
  [APP_WS_OPEN]: state => ({ ...state, wsStatus: 'inited' }),

  [APP_WS_CLOSE]: state => ({ ...state, wsStatus: 'closed' }),
}, { wsStatus: 'initing' });
