var mongoose = require('mongoose');
var Providers = new mongoose.Schema({
  id: String
});
var ModulesSchema = new mongoose.Schema({
  id: String,
  name: String,
  types: [{
    id: String,
    name: String,
    providers: [Providers]
  }]
});

module.exports = mongoose.model('Modules', ModulesSchema, 'modules');
