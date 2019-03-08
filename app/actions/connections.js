const { getMongoEntry, deleteCollection } = require('../utils/mongoFunctions');

export const FETCH_CONNECTIONS = 'FETCH_CONNECTIONS';
export const DELETE_CONNECTIONS = 'DELETE_CONNECTIONS';

var dbName = 'bluetooth_data';

export const getConnections = () => {
  return dispatch => {
    getMongoEntry(dbName, 'Connections', {})
    .then(data => dispatch({
        type: FETCH_CONNECTIONS,
        response: data
      }))
  }
};

export const deleteConnections = () => {
  return dispatch => {
    deleteCollection(dbName, 'Connections')
    .then(response => dispatch({
      type: DELETE_CONNECTIONS,
      response: response
    }))
  }
}
