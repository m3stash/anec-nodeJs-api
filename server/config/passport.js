'use strict';
var BearerStrategy = require('passport-http-bearer').Strategy;
var Users = require('../../models/users');

module.exports = function(passport, twt) {
  passport.use(new BearerStrategy(
    function(token, cb) {
      //if not token (cause user disconneted two times)
      if(token === 'null'){
        return cb(null, true);
      }
      Users.findOne({'token.token' : token}, function(err, user) {
        //verify if the date of token is passed
        console.log('xxxx',user.token.expire);
        
        var tokenNotExpired = (new Date(user.token.expire).getTime() > new Date().getTime());
        if (err) {
          return cb(err);
        }
        if (!user || !tokenNotExpired) {
          return cb(null, false);
        }
        //!expireToken when we incremente this with the validity time.
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
        }
        return cb(null, user);
      });
    }));
}
