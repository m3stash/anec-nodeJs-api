var mongoose = require('mongoose');
var ContractsSchema = new mongoose.Schema({
  contract_list: [{
    id_provider: String,
    create_date : { type: Date, default: Date.now },
    start_date: { type: Date },
    end_date: { type: Date }
  }]
});

module.exports = mongoose.model('Contracts', ContractsSchema, 'contracts');
