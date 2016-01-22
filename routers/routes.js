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

	app.get('/rest-api/country/read', passport.authenticate('bearer', { session: false }),
		function(req, res) {
			Country.find({}, {'_id': 0}, function(err, country){
				if(country !== null){
					res.status(200).send({'countryList' : country});
				}
			});
		}
	);

	app.get('/rest-api/district', passport.authenticate('bearer', { session: false }),
		function(req, res) {
			var id_country = parseInt(req.body.id_country);
			if(isNaN(id_country) === false){
				District.find({'id_country': id_country}, {'_id': 0, 'id_country': 0}, function(err, district){
					console.log('DISTRICT',district)
					if(district !== null){
						console.log('XXXX',district)
						res.status(200).send({'districtList': district});
					}
				});
			}else{
				res.status(400).send('error id_country must be a Number');
			}
		}
	);

	app.post('/rest-api/login', function(req, res) {
		Users.findOne({login: req.body.login, pwd: req.body.password}, function (err, users) {
		  if (users === null){
				res.status(401).send('Unauthorized');
			} else {
				var payload = { date: new Date().getTime() };
				var secret = 'S3cret!Qu3st59';
				var token_validity = 5000;
				var token_encoded = jwt.encode(payload, secret);
				var token_expires_in = new Date().getTime() + token_validity
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
							//console.log('save token ok', users);
							res.status(200).send({
								'token' : token.token,
								'user' : user
							});
						}
				});
			}
		});
	});

	app.post('/rest-api/modulesByDistrict', passport.authenticate('bearer', { session: false }),
		function(req, res) {
			// ModulesByDistrict.save(obj);
			}
	);

	app.get('/rest-api/modules/:id/modules_type/:idModType?', passport.authenticate('bearer', { session: false }),
		function(req, res) {
			var idModule = req.params.id;
			var idModType = req.params.idModType;
			if(idModule === null){
				res.status(500).send({error: 'id module must be not null'});
			}else{
				/*
					if idModType is not null : get single moduleType
					if idModType is null : get all moduleType
				*/
				if(idModType !== null){
					Modules_type.find({'id': idModule}, {'_id': 0, '__v': 0}, function(err, moduleType){
						res.status(200).send({'moduleTypeList': moduleType});
					});
				}else{
					Modules_type.find({}, {'_id': 0, '__v': 0}, function(err, moduleType){
						res.status(200).send({'moduleTypeList': moduleType});
					});
				}
			}
		}
	);

	//post module_type
	app.post('/rest-api/modules/:id/modules_type', passport.authenticate('bearer', { session: false }),
		function(req, res) {
			var idModule = req.params.id;
			if(idModule === null){
				res.status(500).send({error: 'ID module must be not null'});
			}else{
				if(fnUndefinedOrNull(req.body.name) || fnUndefinedOrNull(req.body.id) === true){
					res.status(500).send({error: 'Property id and name must be not null'});
				}else{
					Modules_type.find({'id': req.body.id}, {'_id': 0, '__v': 0}, function(err, moduleType){
						if(_.isEmpty(moduleType)){
							//create new entry
							var module_type = new Modules_type();
							module_type.idModule = idModule;
							module_type.id = req.body.id;
							module_type.name = req.body.name;
							module_type.save(function(err) {
								if(err){
									res.status(500).send({error: 'Error server creation new modules_type'});
								}else{
									res.status(200).send({message: 'Creation new modules_type succes'});
								}
							});
						}else{
							res.status(500).send({error: 'module_type already existe'});
						}
					})
				}
			}
		}
	);

	app.get('/rest-api/modules', passport.authenticate('bearer', { session: false }),
	  function(req, res) {
			Modules.find({}, {'_id': 0, '__v': 0}, function(err, modules){
				res.status(200).send({'modulesList': modules});
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
