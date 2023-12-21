var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cons = require('consolidate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var chartsRouter = require('./routes/updateCharts');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/Patients', indexRouter);
app.use('/Insert', usersRouter);
app.use('/addDatatoChart',chartsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// //================== Setup MongoDB Database ==========================
// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');
// const url = 'mongodb://localhost:27017';                           // Connection URL
// const dbName = 'RemotePatientSystem';   //<------------ Enter a name for your database

// //========== Create Collections for patients ==============
// const insertDocuments = function (db,recName,document, callback) {

//   // Get the documents collection
//   let collection = db.collection(recName);  // <------ Enter  name for your Database collection where you have 'Student' or leave as is

//   // Insert a document
//   collection.insertOne(document, function (err, result) {
    
//     assert.equal(err, null);
//     assert.equal(1, result.result.n);
//     assert.equal(1, result.ops.length);
//     callback(result);
//   });
// };

// /*Create Collections for Patients Data*/
// MongoClient.connect(url, function (err, client) { // Use connect method to connect to the server
    
//   assert.equal(null, err);
//   console.log("CONNECTED TO DATABASE");

//   const db = client.db(dbName);
//     /*Creating Patient Information Collection*/
//   let recName = "Patients";//gets the name of the record that should be updated
//   //new Date(year, month, day, hours, minutes, seconds, milliseconds)
//   let document = {id: "0001", fname: "Malik", lname: "Edwards", gender: "Male",rstatus:"Single",
//                   dob: "1997/1/24",
//                   tele: "876-555-3456",
//                   home: "876-995-3238",
//                   email: "malwards@gmail.com",
//                   address: ["23 One Stop Ave", "St. John's Road", "Spanish Town", "St. Catherine"],
//                   staus: "Active",
//                   estatus: "Full Time",
//                   problems: ["DIABETES MELLITUS (ICD-250.)","HYPERTENSION, BENIGN ESSENTIAL (ICD-401.1)"],
//                   medications: ["PRINIVIL TABS 20 MG (LISINOPRIL) 1 po qd","Last Refill: #30 x 2 : Carl Savem MD (27/08/2010)","HUMULIN INJ 70/30 (INSULIN REG & ISOPHANE (HUMAN)) 20 units ac breakfast"]
//                 };
//   insertDocuments(db,recName,document,function(){});// <---- Insert a document data in your database


//   /*Create collection for last data retreived from databae*/
//   // recName = "LastDataRetrieved";
//   // document = {id: "0001", time: new Date()};
//   // collection = db.collection(recName);
//   // insertDocuments(db,recName,document,function(){});// <---- Insert a document data in your database//
  
//   client.close();
// });

module.exports = app;
