var express = require('express');
var router = express.Router();

const dict = {L: "Left Side", R: "Ride Side", FU: "Face Up", FD: "Face Down", UpR: "Upright"}

//================== Setup MongoDB Database ==========================
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017'; // Connection URL
const dbName = 'RemotePatientSystem';   //Name for your database

//========== Insert Documents with a Query Filter ==============
const insertDocument = function (db, req, callback) {
  //console.log(req.headers);
  const now = new Date();
  let recName = req.body.id;//gets the name of the record that should be updated
  let document = {id: req.body.id, bpm: parseInt(req.body.hr), temp: parseFloat(req.body.temp), pos: dict[req.body.pos], 
                accl: parseFloat(req.body.accl), 
                alert: req.body.alert, time: now}//parse data to insert into database  

  // Get the documents collection
  let collection = db.collection(recName);  // <------ Enter  name for your Database collection where you have 'Student' or leave as is

  // Insert a document
  collection.insertOne(document, function (err, result) {
    
    assert.equal(err, null);
    console.log("passed err");
    assert.equal(1, result.result.n);
    console.log("passed num of results");
    assert.equal(1, result.ops.length);
    console.log("Inserted 1 document into the collection");
    callback(result);
  });

};

//====POST TO ARDUINO=======
router.post('/',function(req, res, next) {
  console.log(req.body);
    //================== Connect to MongoDB Database ==========================
  MongoClient.connect(url, function (err, client) { // Use connect method to connect to the server
    
    assert.equal(null, err);
    console.log("CONNECTED TO DATABASE");
    //console.log(res);

    const db = client.db(dbName);  

    insertDocument(db, req, function () {// <---- Insert a document data in your database// 
         client.close();
    });

    res.append('data', 'LED=1');
    
    res.removeHeader('X-Powered-By');
    //res.write('LED=ON');
    //res.write('HELLO');
    res.end();
    client.close();
  });

});

module.exports = router;
