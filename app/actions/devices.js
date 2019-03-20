const { getMongoEntry } = require('../utils/mongoFunctions');

export const FETCH_DEVICES = 'FETCH_DEVICES';

var dbName = 'bluetooth_data';

export const getDevices = () => {
  return dispatch => {
    getMongoEntry(dbName, 'Devices', {})
    .then(data => dispatch({
        type: FETCH_DEVICES,
        response: data
      }))
  }
};
