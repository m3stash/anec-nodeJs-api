// set up ========================
var express  = require('express');
var app = express();                              // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan   = require('morgan');             // log requests to the console (express4)
var http     = require('http');
var url      = require('url');
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var configDB = require('./server/config/database.js');
//npm install -g node-gyp ?? apparement fait fonctionner le plugin suite au probleme de BSON

// mongo connect =================
mongoose.connect(configDB.url); // connect to our database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection database error:'));
db.once('open', function (callback) {
	console.log('connection ok calback ->', callback)
});

// require('./server/libs/btSerial');

// configuration ==============================================================
app.use(morgan('dev'));                                         // log every request to the console
//app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(cookieParser()); // read cookies (needed for auth)

//routes app ======================================
require('./server/routes')(app);

// listen (start app with node server.js) ======================================
/*var server = http.createServer(app).listen(9000, function (request, response) {
    console.log('listening on port 9000');
});*/
app.listen(9000);
