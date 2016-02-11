// set up ======================================================================
var express  = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan'); // log requests to the console (express4)
var http = require('http');
var url = require('url');
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var jwt = require('jwt-simple');
global._ = require('underscore');

//mongo connect ================================================================
var options = {
  server: { poolSize: 1 },
}
mongoose.connect('localhost:27017/db', options); // connect to our database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection db error:'));
db.once('open', function (callback) {
	console.log('connection db ok')
});

//passport config ===============================================================
require('./server/config/passport')(passport, jwt);

// configuration ===============================================================
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // parse application/json
app.use(cookieParser()); // read cookies

// routes app ==================================================================
require('./routers/routes')(app, passport, jwt);

// start serveur ===============================================================
app.listen(9999);

process.on('exit', (code) => {
  console.log('-------About to exit with code:', code);
});
