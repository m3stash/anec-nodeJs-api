// config/users-db.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Users');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection "users" ERROR'));
db.once('open', function (callback) {
		console.log('connection db "users" OK')
});
module.exports = exports = mongoose;
