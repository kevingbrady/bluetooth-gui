// @flow
import { FETCH_DEVICES } from '../actions/devices';
import type { Action } from './types';

const { getMongoEntry } = require('../utils/mongoFunctions')

const initialState = {
    devices: []
};

export default function deviceReducer(state=initialState, action: Action) {

  switch (action.type) {

    case FETCH_DEVICES: {
        return {...state, devices: action.response }
        break;
    }
  }

  return state
}
