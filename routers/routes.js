'user strict';

var Customers = require('../models/customers');
var Providers = require('../models/providers');
var Users = require('../models/users');
var Modules = require('../models/modules');
// var Modules_type = require('../models/modules_type');
var Contracts = require('../models/contracts');
var Country = require('../models/country');
var District = require('../models/district');
var ModulesByDistrict = require('../models/modulesByDistrict');

//if params is null or undefined or "" : retun true
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
				    	// console.log('error save usr', err);
				    } else {
							var user = {};
							user.civility = users.civility;
							user.lastName = users.lastName;
							user.firstName = users.firstName;
							user.contact = users.contact;
							user.isAdmin = users.userAdmin;
							user.id = users._id;
							user.id_customer = users.id_customer;
							user.name_customer = user.name_customer;
							return res.status(200).send({
								'token' : token.token,
								'user' : user
							});
						}
				});
			}
		});
	});
	//logout
	app.post('/rest-api/logout', function(req, res) {
		if(fnUndefinedOrNull(req.body.id)){
			return res.status(500).send('ERROR: 402');
		};
		// if(req.body.id)
		Users.findOne({'_id' : req.body.id}, function(err, user){
			if(fnUndefinedOrNull(user)){
				return res.status(500).send('error server');
			}
			if(err){
				//
			}
			// user.token.expire = null;
			user.token.token = null;
			user.save(function(err){
		    if(err){
		    	//
		    } else {
					return res.status(200).send('logout');
				}
			});
		});
	});
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
						// console.log('XXXX',district)
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
	//Module get
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
	//Module create
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
	//Users GET
	app.get('/rest-api/users', passport.authenticate('bearer', { session: false }),
		function(req, res){
			if(req.user.userAdmin === true){
				Users.find({}, {'__v': 0, 'token': 0, 'superUser': 0}, function(err, users){
					if(err){
						return res.status(500).send('error server');
					}
					if(!fnUndefinedOrNull(users)){
						return res.status(200).send({users: users});
					}
				});
			}else{
				return res.status(401).send('Unauthorized');
			}
		}
	);
	//contracts create
	app.post('/rest-api/contracts/create', passport.authenticate('bearer', { session: false }),
		function(req, res) {
			Contracts.find({}, {'__v': 0} , function(err, contracts){
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
