var express = require('express');
var router = express.Router();

var lastTime = new Date();//date and page was loaded
var timeOfLastRetrieval;
/*DEFINING CHART DATA FOR CHARTS*/
var newDataPoints;
var status;

//================== Setup MongoDB Database ==========================
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';                           // Connection URL
const dbName = 'RemotePatientSystem';   //<------------ Enter a name for your database

//========== Find Documents with a Query Filter ==============
const getPatientData = function (db, recName, callback) {
  const collection = db.collection(recName); // <------ Enter  name for your Database collection

  // Get the documents collection
  collection.find().sort({$natural: -1}).limit(1).next().then(function(doc) {
    lastTime=doc.time;
    //console.log(doc.time);
    },
    function(err) {
      console.log('Error:', err);
  });

  // Find some documents
  collection.find({time: {$gt: lastTime}}).toArray(function (err, docs) { 
    assert.equal(err, null);

    if(docs.length == 0){
      status=0;
    }
    else{
      status=1;
      timeOfLastRetrieval = new Date();
      //lastTime=(docs[docs.length-1]).time;//store date of last data retreived
      //console.log(docs[docs.length-1]);
    }
    newDataPoints=docs;//add records or record to new datapoint
    callback(docs);
  });

}

//Adds new bpm data to chart
router.post('/', function(req,res){
  
  MongoClient.connect(url, function (err, client) {// Use connect method to connect to the server
    assert.equal(null, err);
    const db = client.db(dbName);
    
    let recName = req.body.id;//patients ID number

    getPatientData(db, recName, function () {client.close(); });
  });//End of Database Connection

  
  if(status==1){ 
    res.send({dataPoints: newDataPoints, status: status, lastTime: lastTime});
    status=0;
  }else{
    res.send({status: status, lastTime: lastTime, con_stat: new Date()-timeOfLastRetrieval});
    //console.log(new Date()-lastTime);
  }
  //lastTime = new Date(req.body.lastTime);//creates date object with timestamp of last data sent to database
});

module.exports = router;