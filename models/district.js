var mongoose = require('mongoose');
var DistrictSchema = new mongoose.Schema({
  id: Number,
  name: String
});

module.exports = mongoose.model('District', DistrictSchema, 'district');
