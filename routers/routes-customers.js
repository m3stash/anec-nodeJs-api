'user strict';

var Customers = require('../models/customers');
// var Users = require('../models/users');

//if params is null or undefined or "" : return true
fnUndefinedOrNull = function(param){
	if((_.isUndefined(param) || _.isNull(param)) === true){
		return true;
	}else{
		return false;
	}
}

module.exports = function(app, passport, jwt){
	//Customers GET
	app.get('/rest-api/customers/:id_customer?', passport.authenticate('bearer', { session: false }),
		function(req, res) {
      //for get all datas
      var idCustomers = req.params.id_customer;
      if(req.user.userAdmin === true && fnUndefinedOrNull(idCustomers)){
        Customers.find({}, {}, function(err, customers){
          if(err){
            return handleError(req, res, err);
          }
          return res.status(200).send({customers: customers});
        })
      }else{
        if(!fnUndefinedOrNull(idCustomers)){
          Customers.findOne({id_customer: idCustomers}, {'__v': 0}, function(err, customer){
            if(err){
              return handleError(req, res, err);
            }
            console.log('---customer-----',customer)
          });
        }else{
          return res.status(500).send('ERR_CUSTOMERS_ID');
        }
      }
		}
	);
	//Module get
}
