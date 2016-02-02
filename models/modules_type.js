var mongoose = require('mongoose');

var Modules_typeSchema = new mongoose.Schema({
  idModule: String,
  name: String,
  create_date : {type: Date}
});

module.exports = mongoose.model('Modules_type', Modules_typeSchema, 'modules_type');
