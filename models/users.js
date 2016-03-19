var mongoose = require('mongoose');
var UsersSchema = new mongoose.Schema({
  superUser: Boolean,
  userAdmin: Boolean,
  id_customer: String,
  name_customer: String,
  login : String,
  pwd : String,
  token : {
    expire : Date,
    token : String,
  },
  firstName : String,
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
module.exports = mongoose.model('Users', UsersSchema, 'users');
