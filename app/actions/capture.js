const { getMongoEntry, deleteCollection } = require('../utils/mongoFunctions');

export const FETCH_RAW_DATA = 'FETCH_RAW_DATA';
export const DELETE_RAW_DATA = 'DELETE_RAW_DATA';
export const ROW_SELECTION = 'ROW_SELECTION';

var dbName = 'bluetooth_data';

export const getRawData = () => {

  return dispatch => {
    getMongoEntry(dbName, 'raw_data', {})
    .then(data => dispatch({
        type: FETCH_RAW_DATA,
        response: data
      }))
  }
};

export const deleteRawData = () => {

  return dispatch => {
    deleteCollection(dbName, 'raw_data')
    .then(response => dispatch({
      type: DELETE_RAW_DATA,
      response: response
    }))
  }
};
