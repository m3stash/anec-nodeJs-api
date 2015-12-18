'user strict';

var Customers = require('../models/customers');
var Providers = require('../models/providers');
var Users = require('../models/users');
var Modules = require('../models/modules');
var Contracts = require('../models/contracts');

module.exports = function(app, passport, jwt){

	//login
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

	//modules
	app.get('/rest-api/modules/read', passport.authenticate('bearer', { session: false }),
	  function(req, res) {
			//on récupère la liste des contracts par rapport au id_customers du user
			Contracts.findOne({'id_customer':req.user.id_customer}, function(err, contract){
				if(err){
					res.status(500).send({error: "problème serveur la requete des modules n'a pas aboutie"});
				};
				if(contract !== null){
					var modulesListId = [];
					var found = false;
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
			})
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
				obj.id_customer = "CUS_001",
				obj.contract_list = [{
					id_contract : "CTN_002",
					provider: "PRO_002",
					month_term: "6",
					create_date: "Mon Jan 01 2015 00:00:00 GMT+0100 (CET)",
					start_date: "Mon Jan 01 2015 00:00:00 GMT+0100 (CET)",
					end_date: "Mon Jan 01 2016 23:59:59 GMT+0100 (CET)",
					modules: [{
						id: "MOD_001",
						types: [{
							id: "MDT_002"
						}]
					}]
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
