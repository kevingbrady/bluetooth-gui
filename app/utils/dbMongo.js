const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://127.0.0.1:27017/";

module.exports = {

  /*
   * Mongo Utility: Connect to client */

  clientConnect: async () => (

    client = await (() => (new Promise((resolve, reject) => (

      MongoClient.connect(url, {
        useNewUrlParser: true
      },
      (err, client) => {
        assert.equal(null, err);
        resolve(client);
      })
    )
  )))()),


  /*
   * Mongo Utility: Close client */

  clientClose: async (client) => {
    client.close();
    return true;
  }
};
