// @flow
import { FETCH_CONNECTIONS,
         DELETE_CONNECTIONS } from '../actions/devices';
import type { Action } from './types';

const { getMongoEntry, deleteCollection } = require('../utils/mongoFunctions')

const initialState = {

  connections: []

};

const dbName = 'bluetooth_data';
var newState = Object.assign({}, initialState);

export default function connectionReducer(state=initialState, action: Action) {

switch (action.type) {

  case FETCH_CONNECTIONS: {
      getMongoEntry(dbName, 'Connections', {}).then(data => {
        newState.connections = data;
      })
      if(state.connections.length !== newState.connections.length){
        return {...state,  connections: newState.connections }
      }
      break;
    }
  case DELETE_CONNECTIONS: {
      deleteCollection(dbName, 'Connections').then(response => {
        if(response !== 'Dropped Connections'){
          console.log(response);
        }})
      return {...state, connections: [] }
    }
  }

  return state
}
