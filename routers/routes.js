'user strict';
module.exports = function(app){

	app.get('/rest-api/login', function(req, res) {
		res.send("coucou");
	});

	app.get('/rest-api/test', function(req, res) {
		res.send("bienvenue");
	});

	// var loginCtrl = require('./controllers/loginCtrl');
	// app.get('/login', loginCtrl.index);
  // app.post('/login');
	//
	// var createAccountCtrl = require('./controllers/createAccountCtrl');
	// app.get('/createAccount', createAccountCtrl.createAccountIndex);
	// app.post('/createAccount', passport.authenticate('local-signup') , function(req, res) {
	//     //res.send(req.user);
	// });
	// app.post('/verifEmail', createAccountCtrl.verifEmail);
	//
	// app.get('/logout', function(req, res) {
  //     req.logout();
  //     res.redirect('/');
  // });

}
