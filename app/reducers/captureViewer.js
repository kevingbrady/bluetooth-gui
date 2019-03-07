// @flow
import { FETCH_RAW_DATA,
         DELETE_RAW_DATA,
         ROW_SELECTION } from '../actions/capture';
import type { Action } from './types';
import getPacketOverview from '../middleware/packet_utils'
import sleep from '../middleware/capture_utils';

var equal = require('fast-deep-equal');

const initialState = {

  raw_data: [],
  tableData: [],
  rowSelection: 1

};

const dbName = 'bluetooth_data';
var newState = Object.assign({}, initialState);

export default function captureViewerReducer(state=initialState, action: Action) {

  switch (action.type) {

    case FETCH_RAW_DATA: {

        let tableData = [];

        for(let i = 0; i < action.response.length; i++){

            tableData[i] = getPacketOverview(action.response[i]);
        }
        return {...state, raw_data: action.response, tableData: tableData }
    }

  case DELETE_RAW_DATA: {
    if(action.response !== 'Dropped raw_data'){
        console.log(response);
    }
    return {...state, raw_data: [], tableData: [] }
  }
}

return state
}
