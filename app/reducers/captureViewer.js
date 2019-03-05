// @flow
import { SET_LOADING,
         FETCH_RAW_DATA,
         DELETE_RAW_DATA,
         ROW_SELECTION } from '../actions/devices';
import type { Action } from './types';
import getPacketOverview from '../middleware/packet_utils'

const { getMongoEntry, deleteCollection } = require('../utils/mongoFunctions')

const initialState = {

  isLoading: true,
  raw_data: [],
  tableData: [],
  rowSelection: 1

};

const dbName = 'bluetooth_data';
var newState = Object.assign({}, initialState);

export default function captureViewerReducer(state=initialState, action: Action) {

switch (action.type) {

  case SET_LOADING: {
    return {...state, isLoading: action.value }
  }

  case FETCH_RAW_DATA: {
      getMongoEntry(dbName, 'raw_data', {}).then(data => {
        newState.raw_data = data;
      })

      if (state.tableData.length !== newState.raw_data.length){

        for(var i = 0; i < newState.raw_data.length; i++){

          newState.tableData[i] = getPacketOverview(newState.raw_data[i]);
        }

        return {...state, isLoading: false, raw_data: newState.raw_data, tableData: newState.tableData }

      } else if(state.raw_data.length !== newState.raw_data.length){

        return {...state, isLoading: false, raw_data: newState.raw_data }
      }
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
