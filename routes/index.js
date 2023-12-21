var express = require('express');
var router = express.Router();

//================== Setup MongoDB Database ==========================
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017'; // Connection URL
const dbName = 'RemotePatientSystem';   //Name for your database

const getPatientInfo=function(db,recName,res,idNum){
  const collection = db.collection(recName); // <------ Enter  name for your Database collection

    // Find some documents
    collection.findOne({id: idNum},function (err, docs) { 
      assert.equal(err, null);
      console.log(docs);
      res.render('patient',docs);
    });
}

/* GET Pateint's page. */
router.get('/', function(req, res, next) {
  MongoClient.connect(url, function (err, client) {// Use connect method to connect to the server
    assert.equal(null, err);
    const db = client.db(dbName);
    
    let recName = 'Patients';//patients ID number

    getPatientInfo(db, recName, res,req.query.id);

    client.close();
  });//End of Database Connection
  // res.render('patient',{patientid: req.query.id});
});

module.exports = router;
