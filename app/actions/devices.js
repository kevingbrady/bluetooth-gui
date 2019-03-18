const { getMongoEntry, getCollectionCount, deleteCollection } = require('../utils/mongoFunctions');

export const FETCH_DEVICES = 'FETCH_DEVICES';
export const DELETE_DEVICES = 'DELETE_DEVICES';

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

export const deleteDevices = () => {
  return dispatch => {
    getCollectionCount(dbName, 'Devices').then(count => {
      if(count > 0){
        deleteCollection(dbName, 'Devices').then(response => dispatch({
          type: DELETE_DEVICES,
          response: response
        }));
      }})
  }
};
