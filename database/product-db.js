// config/product-db.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://adminDb:@dm!nDb!01@ds031591.mongolab.com:31591/products-db');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection "Product" error'));
db.once('open', function (callback) {
	console.log('connection db "Product" ok')
});
module.exports = exports = mongoose;
