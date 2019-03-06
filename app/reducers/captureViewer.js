// @flow
import { FETCH_RAW_DATA,
         DELETE_RAW_DATA,
         ROW_SELECTION } from '../actions/devices';
import type { Action } from './types';
import getPacketOverview from '../middleware/packet_utils'

const { getMongoEntry, deleteCollection } = require('../utils/mongoFunctions')

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
      getMongoEntry(dbName, 'raw_data', {}).then(data => {
        newState.raw_data = data;
      })

      if(!equal(state.raw_data, newState.raw_data)){

        return {...state, raw_data: newState.raw_data }

      }

      if(state.tableData.length !== state.raw_data.length){

          for(let i = 0; i < newState.raw_data.length; i++){

            newState.tableData[i] = getPacketOverview(state.raw_data[i]);
          }

          return {...state, tableData: newState.tableData }
      }

      console.log(state.tableData.length, state.raw_data.length)

      break;
    }

  case DELETE_RAW_DATA: {
    deleteCollection(dbName, 'raw_data').then(response => {
      if(response !== 'Dropped raw_data'){
        console.log(response);
      }})
    return {...state, raw_data: [], tableData: [] }
  }

  case ROW_SELECTION: {

    if(action.value !== undefined && state.rowSelection !== action.value){
      return {...state, rowSelection: action.value }
    }
    break;
  }
}

return state
}
