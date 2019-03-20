const { clientConnect, clientClose } = require('./dbMongo');

module.exports = {

  /*
   * Authentication: Get Signed In User Data
   * Inputs: username
   */
  getMongoEntry: async (dbName, collectionName, query) => (await (() => (
    new Promise((resolve, reject) =>(clientConnect().then(client => {

     //go ahead and make the query...
      client
       .db(dbName)
       .collection(collectionName)
       .find(
         query
      )
      .toArray((err, data) => {

         clientClose(client);
         resolve(data);

     });
    })
  ))))()),
}; //end exports
