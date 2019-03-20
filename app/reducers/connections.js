// @flow
import { FETCH_CONNECTIONS } from '../actions/connections';
import type { Action } from './types';

const { getMongoEntry } = require('../utils/mongoFunctions')

const initialState = {

  connections: []

};

export default function connectionReducer(state=initialState, action: Action) {

switch (action.type) {

  case FETCH_CONNECTIONS: {
      return {...state,  connections: action.response };
      break;
    }
  }

  return state
}
