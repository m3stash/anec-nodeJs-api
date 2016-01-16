var mongoose = require('mongoose');
var CountrySchema = new mongoose.Schema({
  id: Number,
  name: String
});

module.exports = mongoose.model('Country', CountrySchema, 'country');
