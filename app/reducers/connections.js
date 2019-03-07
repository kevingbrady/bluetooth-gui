// @flow
import { FETCH_CONNECTIONS,
         DELETE_CONNECTIONS } from '../actions/connections';
import type { Action } from './types';

const { getMongoEntry, deleteCollection } = require('../utils/mongoFunctions')

var equal = require('fast-deep-equal');

const initialState = {

  connections: []

};

export default function connectionReducer(state=initialState, action: Action) {

switch (action.type) {

  case FETCH_CONNECTIONS: {
      return {...state,  connections: action.response };
      break;
    }
  case DELETE_CONNECTIONS: {
      if(action.response !== 'Dropped Connections'){
          console.log(action.response);
      }
      return {...state, connections: [] };
      break;
    }
  }

  return state
}
