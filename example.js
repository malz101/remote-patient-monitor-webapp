var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var chartsRouter = require('./routes/updateCharts');
var usersRouter = require('./routes/users');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/Insert', usersRouter);
app.use('/addDatatoChart',chartsRouter);

// Error Handler for 404 Pages
app.use(function(req, res, next) {
    var error404 = new Error('Route Not Found');
    error404.status = 404;
    next(error404);
});


app.listen(3000, function(){
  console.log('Server listening on port 3000!')
});

module.exports = app;
