var mongoose = require('mongoose');

var Modules_typeSchema = new mongoose.Schema({
  idModule: String,
  id: String,
  name: String
});

module.exports = mongoose.model('Modules_type', Modules_typeSchema, 'modules_type');
