const { getMongoEntry } = require('../utils/mongoFunctions');

export const FETCH_RAW_DATA = 'FETCH_RAW_DATA';

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
