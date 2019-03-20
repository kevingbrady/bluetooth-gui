// @flow
import { FETCH_RAW_DATA } from '../actions/capture';
import type { Action } from './types';
import getPacketOverview from '../middleware/packet_utils';

const initialState = {

  raw_data: [],
  tableData: []
};

export default function captureViewerReducer(state=initialState, action: Action) {

  switch (action.type) {

    case FETCH_RAW_DATA: {

        let tableData = [];
        let rawData = [];

        if(action.response !== null){

          rawData = action.response;

          for(let i = 0; i < rawData.length; i++){

              tableData[i] = getPacketOverview(rawData[i]);
          }
      }
      return {...state, raw_data: rawData, tableData: tableData }
      break;
    }
}

return state
}
