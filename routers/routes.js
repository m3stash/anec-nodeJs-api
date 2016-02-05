'user strict';

var Customers = require('../models/customers');
var Providers = require('../models/providers');
var Users = require('../models/users');
var Modules = require('../models/modules');
var Modules_type = require('../models/modules_type');
var Contracts = require('../models/contracts');
var Country = require('../models/country');
var District = require('../models/district');
var ModulesByDistrict = require('../models/modulesByDistrict');

//if params is null or undefined or "" : return true
fnUndefinedOrNull = function(param){
	if((_.isUndefined(param) || _.isNull(param)) === true){
		return true;
	}else{
		return false;
	}
}

module.exports = function(app, passport, jwt){

	app.post('/rest-api/login', function(req, res) {
		Users.findOne({login: req.body.login, pwd: req.body.password}, function (err, users) {
		  if (users === null){
				res.status(401).send('Unauthorized');
			} else {
				var payload = { date: new Date().getTime() };
				var secret = 'S3cret!Qu3st59';
				//validity 4 hours
				var token_validity = 14400000;
				var token_encoded = jwt.encode(payload, secret);
				var token_expires_in = new Date().getTime() + token_validity;
				var token = {
					expire: token_expires_in,
					token: token_encoded
				}
				users.token = token;
				users.save(function(err){
				    if(err){
				    	console.log('error save usr', err);
				    } else {
							var user = {};
							user.civility = users.civility;
							user.lastName = users.lastName;
							user.firstName = users.firstName;
							user.contact = users.contact;
							user.isAdmin = users.userAdmin;
							//console.log('save token ok', users);
							return res.status(200).send({
								'token' : token.token,
								'user' : user
							});
						}
				});
			}
		});
	});

	//country
	app.get('/rest-api/logout', passport.authenticate('bearer', { session: false }),
		function(req, res) {
			Users.findOne({'_id' : req.user._id}, function(err, user){
				if(fnUndefinedOrNull(user)){
					return res.status(500).send('error server');
				}
				if(err){
					//
				}
				user.token.expire = null;
				user.token.token = null;
				user.save(function(err){
			    if(err){
			    	//
			    } else {
						return res.status(200).send('logout');
					}
				});
			});
		}
	);

	//country
	app.get('/rest-api/country/read', passport.authenticate('bearer', { session: false }),
		function(req, res) {
			Country.find({}, {'_id': 0}, function(err, country){
				if(country !== null){
					return res.status(200).send({'countryList' : country});
				}
			});
		}
	);

	//district
	app.get('/rest-api/district', passport.authenticate('bearer', { session: false }),
		function(req, res) {
			var id_country = parseInt(req.body.id_country);
			if(isNaN(id_country) === false){
				District.find({'id_country': id_country}, {'_id': 0, 'id_country': 0}, function(err, district){
					console.log('DISTRICT',district)
					if(district !== null){
						console.log('XXXX',district)
						return res.status(200).send({'districtList': district});
					}
				});
			}else{
				return res.status(400).send('error id_country must be a Number');
			}
		}
	);

	//modulesByDistrict
	app.post('/rest-api/modulesByDistrict', passport.authenticate('bearer', { session: false }),
		function(req, res) {
			// ModulesByDistrict.save(obj);
			}
	);

	//get module_type
	app.get('/rest-api/modules/:id/modules_type/:idModType?', passport.authenticate('bearer', { session: false }),
		function(req, res) {
			var idModule = req.params.id;
			var idModType = req.params.idModType;
			if(idModule === null){
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

	//POST module_type
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

	//PUT module_type
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

	//DELETE module_type
	app.delete('/rest-api/modules/:id/modules_type', passport.authenticate('bearer', { session: false }),
		function(req, res) {
			if(_.isArray(req.body) && req.body.length > 0){
				Modules_type.remove({'_id': { $in: req.body }}, function (err) {
		      if (err){
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

	//Module
	app.get('/rest-api/modules', passport.authenticate('bearer', { session: false }),
	  function(req, res) {
			Modules.find({}, {'__v': 0}, function(err, modules){
				if(err){
					console.log(err)
				}
				return res.status(200).send({'modulesList': modules});
			});
			// Customers.findOne({'id_customer': req.user.id_customer}, function (err, customer){
			// 	console.log('lala',customer);
			// 	var countryId = customer.address.country.id;
			// 	var provinceId = customer.address.province.id;
			// 	ModulesByDistrict.findOne({'country.id':countryId}, function(err, modules){
			// 		console.log('t',modules)
			// 	});
			// });


			//on récupère la liste des contracts par rapport au id_customers du user
			/*Contracts.findOne({'id_customer':req.user.id_customer}, function(err, contract){
				if(err){
					res.status(500).send({error: "problème serveur la requete des modules n'a pas aboutie"});
				};
				if(contract !== null){
					var modulesListId = [];
					var found = false;x
					//liste des contracts
					for(var i = 0; i < contract.contract_list.length; i++){
						var list = contract.contract_list[i];
						//liste des modules
						for(var j = 0; j < list.modules.length; j++){
							var idMod = list.modules[j].id;
							//récupérations des ids modules
							for(var k = 0; k < modulesListId.length; k++){
								if(idMod === modulesListId[k].id){
									var found = true;
									//ajout de l'id module et des types si l'id existe déjà
									//boucle sur la liste des types afin de les ajouter au types existant
									for(var l = 0; l < list.modules[j].types.length; l++){
										console.log('-------->',list.modules[l].types[l])
										modulesListId[k].types.push(list.modules[l].types[l]);
									}
									modulesListId[k].types.push(list.modules[j].types)
								}
							};
							//ajout de l'id module et des types si pas dans la liste
							if(!found){
								modulesListId.push({
									id: idMod,
									types: list.modules[j].types
								});
								found = false;
							}
						};
					};
					res.status(200).send({modulesList: modulesListId});
				}else{
					res.status(500).send({error: "aucun contract existant"});
				}
			})*/
		}
	);

	app.get('/rest-api/modules/create', passport.authenticate('bearer', { session: false }),
		function(req, res) {
			Modules.findOne({}, function(err, modules){
				obj = new Modules();
				obj.id = "MOD_OO1";
				obj.name = "energie";
				obj.types = [
					{
						id:"MOD_TYPE_001",
						name: "mazoute",
						providers: [
							{id: "PRO_001"},
							{id: "PRO_002"}
						]
					},
					{
						id:"MOD_TYPE_002",
						name: "gaz",
						providers: [
							{id: "PRO_002"}
						]
					}
				];
				obj.save(function(err){
						if(err){
							console.log('error save module', err);
						} else {
							console.log('save OK');
						}
				});
			});
		}
	);

	app.post('/rest-api/contracts/create', passport.authenticate('bearer', { session: false }),
		function(req, res) {
			Contracts.find({}, function(err, contracts){
				obj = new Contracts();
				// obj.id_customer = "CUS_001",
				// obj.contract_list = [{
				// 	id_contract : "CTN_001",
				// 	provider: "PRO_001",
				// 	month_term: "6",
				// 	create_date: "Mon Jan 01 2015 00:00:00 GMT+0100 (CET)",
				// 	start_date: "Mon Jan 01 2015 00:00:00 GMT+0100 (CET)",
				// 	end_date: "Mon Jan 01 2016 23:59:59 GMT+0100 (CET)",
				// 	modules: [{
				// 		id: "MOD_001",
				// 		types: [{
				// 			id: "MDT_001"
				// 		}]
				// 	}]
				// }];
				obj.contract_list = [{
					id_provider: "PRO_002",
					create_date: "Mon Jan 01 2015 00:00:00 GMT+0100 (CET)",
					start_date: "Mon Jan 01 2015 00:00:00 GMT+0100 (CET)",
					end_date: "Mon Jan 01 2016 23:59:59 GMT+0100 (CET)",
				}];
				obj.save(function(err){
						if(err){
							console.log('save contrats -> error', err);
						} else {
							console.log('save contracts -> OK');
							res.status(200).send({'contract' : 'ok'});
						}
				});
			});
		}
	);

}
