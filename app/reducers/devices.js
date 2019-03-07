// @flow
import { FETCH_DEVICES,
         DELETE_DEVICES } from '../actions/devices';

import type { Action } from './types';

const { getMongoEntry, deleteCollection } = require('../utils/mongoFunctions')

var equal = require('fast-deep-equal');

const initialState = {
    devices: []
};

export default function deviceReducer(state=initialState, action: Action) {

  switch (action.type) {

    case FETCH_DEVICES: {
        return {...state, devices: action.response }
    }
    case DELETE_DEVICES: {
      if(action.response !== 'Dropped Devices'){
          console.log(action.response);
      }
      return {...state, devices: []}
    }
  }

  return state
}
