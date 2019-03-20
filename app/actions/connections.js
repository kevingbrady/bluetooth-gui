const { getMongoEntry } = require('../utils/mongoFunctions');

export const FETCH_CONNECTIONS = 'FETCH_CONNECTIONS';

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
