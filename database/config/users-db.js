// config/users-db.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://api-users:apiUsers!01@ds051534.mongolab.com:51534/rest-api-db');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection "users" error'));
db.once('open', function (callback) {
	console.log('connection db "users" ok')
});
module.exports = exports = mongoose;
