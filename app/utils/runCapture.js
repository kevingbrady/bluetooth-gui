
export default function runCapture(capture_type, capture_file) {

  var url = "";
  var capture_program = "/../../python/run_capture.py"

  clearData();

  if(capture_type === 'live') {
    url = capture_program + " -c " + capture_type;
    $.ajax({
        type: "POST",
        url: url
      });
    }
  else if(capture_type === 'file') {
     url = capture_program + " -c " + capture_type + " -f " + capture_file;
     $.ajax({
         type: "POST",
         url: url
       });
  }
  else {
    ; //handle incorrect input here
  }
}

function clearData() {

  var mongo = require('mongodb');
  const dbName = "bluetooth_data";
  const url = "mongodb://127.0.0.1:27017/" + dbName;
  var MongoClient = mongo.MongoClient;

  MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {

    if (err) throw err;
    const db = client.db(dbName);
    db.dropDatabase(dbName);
  });

  client.close();
}
