// config/users-db.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://adminDb:@dm!nDb!01@ds037244.mongolab.com:37244/users-db');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection "users" error'));
db.once('open', function (callback) {
	console.log('connection db "users" ok')
});
module.exports = exports = mongoose;
