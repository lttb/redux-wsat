import { combineReducers } from 'redux';

import app from './app';
import counter from './counter';

export default combineReducers({ counter, app });
