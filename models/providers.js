var mongoose = require('mongoose');
var ProvidersSchema = new mongoose.Schema({
  id_provider : String,
  name : String,
  company_contact : {
    fistName : String,
    lastName : String,
    civility : String,
    contact : {
      fix : {
          prefixe : String,
          number : Number
      },
      fax : {
          prefixe : String,
          number : Number
      },
      mobile : {
          prefixe : String,
          number : Number
      },
      email : String
    }
  },
  user_contact : {
    fistName : String,
    lastName : String,
    civility : String,
    contact : {
      fix : {
          prefixe : String,
          number : Number
      },
      fax : {
          prefixe : String,
          number : Number
      },
      mobile : {
          prefixe : String,
          number : Number
      },
      email : String
    }
  },
  address : {
      country : String,
      region: String,
      add1 : String,
      add2 : String,
      zip : String,
      city : String
  }
});

module.exports = mongoose.model('Providers', ProvidersSchema, 'providers');
