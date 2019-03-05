// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import deviceReducer from './devices'
import connectionReducer from './connections'
import captureViewerReducer from './captureViewer'

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    deviceReducer,
    connectionReducer,
    captureViewerReducer
  });
}
