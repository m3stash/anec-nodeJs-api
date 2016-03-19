'use strict';
var BearerStrategy = require('passport-http-bearer').Strategy;
var Users = require('../../models/users');

module.exports = function(passport, twt) {
  passport.use(new BearerStrategy(
    function(token, cb) {
      //if not token (cause user disconneted two times)
      if(token === 'null'){
        return cb(null, false);
      }
      Users.findOne({'token.token' : token}, function(err, user) {
        if (err) {
          return cb(err);
        }
        if(user !== null){
          var tokenNotExpired = (new Date(user.token.expire).getTime() > new Date().getTime());
          //verify the token date expiration
          if (!tokenNotExpired) {
            return cb(null, false);
          }
          //incremente user validity token.
          if(tokenNotExpired){
            //validity 4 hours
    				var token_validity = 14400000;
            user.token.expire = new Date().getTime() + token_validity;
            user.save(function(err){
                if(err){
                  return res.satus(500).send('error code 208');
                }else{
                  //success
                }
            });
            return cb(null, user);
          }
        }else{
          return cb(null, false);
        }
      });
    }));
}
