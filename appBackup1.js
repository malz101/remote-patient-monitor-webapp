var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cons = require('consolidate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

// view engine setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/Insert', usersRouter);

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


//================== Setup MongoDB Database ==========================
// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');
// const url = 'mongodb://localhost:27017';                           // Connection URL
// const dbName = 'RemotePatientSystem';   //<------------ Enter a name for your database
// const recName = 'Patient0';

// //================== Connect to MongoDB Database ==========================
// MongoClient.connect(url, function (err, client) {                  // Use connect method to connect to the server
//   assert.equal(null, err);
//   console.log("CONNECTED TO DATABASE");


//   const db = client.db(dbName);

//   const example = {"ID": "0001", "HR": 0, "TEMP": 0, 'POS': "Nan", "ALERT": "Nan"}   // <---- Insert a few data in your database// 

//    insertDocuments(db, example, function () {
//        client.close();
//    });

//   findDocuments(db, function () { client.close(); });

// });


// //========== Find Documents with a Query Filter ==============
// const findDocuments = function (db, callback) {

//   // Get the documents collection
//   const collection = db.collection(recName); // <------ Enter  name for your Database collection where you have 'Student' or leave as is
//   // Find some documents
//   collection.find({}).toArray(function (err, docs) { // <------ Enter  json format text which will be use to query your database
//     assert.equal(err, null);
//     console.log("app.js # OF RECORDS FOUND");
//     //console.log("Found the following records");
//     console.log(docs.length);
//     callback(docs);
//   });

// }



// //========== Insert Documents with a Query Filter ==============
// const insertDocuments = function (db, req, callback) {
//   // Get the documents collection
//   const collection = db.collection(recName);  // <------ Enter  name for your Database collection where you have 'Student' or leave as is

//   // Insert some documents
//   collection.insertMany([req], function (err, result) {

//     assert.equal(err, null);
//     console.log("passed err");
//     assert.equal(1, result.result.n);
//     console.log("passed num of results");
//     assert.equal(1, result.ops.length);
//     console.log("Inserted 1 documents into the collection");
//     callback(result);
//   });


// };

module.exports = app;
