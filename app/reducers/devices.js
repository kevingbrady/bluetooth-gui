// @flow
import { FETCH_DEVICES,
         DELETE_DEVICES } from '../actions/devices';

import type { Action } from './types';

const { getMongoEntry, deleteCollection } = require('../utils/mongoFunctions')

const initialState = {
    devices: []
};

const dbName = 'bluetooth_data';
var newState = Object.assign({}, initialState);

export default function deviceReducer(state=initialState, action: Action) {

  switch (action.type) {

    case FETCH_DEVICES: {
        getMongoEntry(dbName, 'Devices', {})
        .then(data => {
          newState.devices = data;
        })
        if(state.devices.length !== newState.devices.length){
          return {...state, devices: newState.devices }
        }
        break;
    }
    case DELETE_DEVICES: {
      deleteCollection(dbName, 'Devices').then(response => {
        if(response !== 'Dropped Devices'){
          console.log(response);
        }})
      return {...state, devices: []}
    }
  }

  return state
}
