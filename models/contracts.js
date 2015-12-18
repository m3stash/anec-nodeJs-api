var mongoose = require('mongoose');
var ContractsSchema = new mongoose.Schema({
  id_customer: String,
  contract_list: [{
    id_contract: String,
    provider: String,
    month_term: Number,
    create_date : { type: Date, default: Date.now },
    start_date: { type: Date },
    end_date: { type: Date },
    modules: [{
      id: String,
      types: [{
        id: String,
      }]
    }]
  }]
});

module.exports = mongoose.model('Contracts', ContractsSchema, 'contracts');
