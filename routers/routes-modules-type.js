'user strict';

// var Customers = require('../models/customers');
// var Providers = require('../models/providers');
var Users = require('../models/users');
var Modules = require('../models/modules');
var Modules_type = require('../models/modules_type');
// var Contracts = require('../models/contracts');
// var Country = require('../models/country');
// var District = require('../models/district');
// var ModulesByDistrict = require('../models/modulesByDistrict');

//if params is null or undefined or "" : return true
fnUndefinedOrNull = function(param){
	if((_.isUndefined(param) || _.isNull(param)) === true){
		return true;
	}else{
		return false;
	}
}

module.exports = function(app, passport, jwt){
	app.get('/rest-api/modules/:id/modules_type/:idModType?', passport.authenticate('bearer', { session: false }),
		function(req, res) {
			var idModule = req.params.id;
			var idModType = req.params.idModType;
			if(fnUndefinedOrNull(idModule)){
				return res.status(500).send({error: 'id module must be not null'});
			}else{
				/*
					if idModType is not null : get single moduleType
					if idModType is null or undefined : get all moduleType
				*/
				if(!fnUndefinedOrNull(idModType)){
					Modules_type.findOne({'_id': idModType}, {'__v': 0}, function(err, moduleType){
						return res.status(200).send({'moduleTypeList': moduleType});
					});
				}else{
					Modules_type.find({}, {'__v': 0}, function(err, moduleType){
						return res.status(200).send({'moduleTypeList': moduleType});
					});
				}
			}
		}
	);
	//module_type POST
	app.post('/rest-api/modules/:id/modules_type', passport.authenticate('bearer', { session: false }),
		function(req, res) {
			var idModule = req.params.id;
			if(fnUndefinedOrNull(idModule)){
				return res.status(500).send('ID module must be not null');
			}else{
				if(fnUndefinedOrNull(req.body.name)){
					res.status(500).send('Property id name');
				}else{
					Modules_type.find({'name': req.body.name}, {'__v': 0}, function(err, moduleType){
						if(err){
							//res.status(500).send('Error server request db');
						}else{
							if(_.isEmpty(moduleType)){
								//create new entry
								var module_type = new Modules_type();
								module_type.idModule = idModule;
								module_type.name = req.body.name;
								module_type.create_date = new Date();
								module_type.save(function(err) {
									if(err){
										return res.status(500).send('Error server');
									}else{
										return res.status(200).send('Creation new modules_type succes');
									}
								});
							}else{
								//err module_type already exist
								return res.status(500).send('ERR_MDT_ADD_01');
							}
						}
					});
				}
			}
		}
	);
	//module_type PUT
	app.put('/rest-api/modules/:id/modules_type/:idModType', passport.authenticate('bearer', { session: false }),
		function(req, res) {
			if(fnUndefinedOrNull(req.params.idModType)){
				return res.status(500).send({'error': 'the id_module can\'t be null'});
			}else{
				Modules_type.find({'name': req.body.name}, {'__v': 0}, function(err, moduleType){
					if (err) {
						return res.status(500).send('error put module_type');
					}else{
						if(!_.isEmpty(moduleType)){
							//if module_type name already exist
							return res.status(500).send('ERR_MDT_ADD_01');
						}else{
							Modules_type.findByIdAndUpdate(req.params.idModType,
									{ $set: { name: req.body.name, last_modif_date: new Date()}}, {new: true}, function (err, test) {
								if (err) {
									return res.status(500).send('error update module_type');
								}else{
									return res.status(200).send({message :'SUCCESS_MDT_UPDATE'});
								}
							});
						}
					}
				});
			}
		}
	);
	//module_type DELETE
	app.delete('/rest-api/modules/:id/modules_type', passport.authenticate('bearer', { session: false }),
		function(req, res) {
			if(_.isArray(req.body) && req.body.length > 0){
				Modules_type.remove({'_id': { $in: req.body }}, function (err) {
		      if(err){
						//error save bdd
						return res.status(500).send('ERR_MDT_DEL_02');
					}else{
						return res.status(200).send('SUCCESS');
					}
    		});
			}else{
				//the id list can't be null
				return res.status(500).send('ERR_MDT_DEL_01');
			}
		}
	);
	//Module get
}
