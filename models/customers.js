var mongoose = require('mongoose');
var CustomersSchema = new mongoose.Schema({
  id_customer : String,
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

/*// methods ======================
// generating a hash
Sch_company_profile.methods.generateHash = function(id) {
    return bcrypt.hashSync(id, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
Sch_company_profile.methods.validPassword = function(id) {
    return bcrypt.compareSync(id, this.local.id);
};
*/
// create the model for users and expose it to our app
module.exports = mongoose.model('Customers', CustomersSchema, 'customers');
