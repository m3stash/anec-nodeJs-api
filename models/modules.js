var mongoose = require('mongoose');

var ModulesSchema = new mongoose.Schema({
  id: String,
  name: String,
});

module.exports = mongoose.model('Modules', ModulesSchema, 'modules');
