'use strict';
var BearerStrategy = require('passport-http-bearer').Strategy;
var Users = require('../../models/users');

module.exports = function(passport, twt) {
  passport.use(new BearerStrategy(
    function(token, cb) {
      Users.findOne({'token.token' : token}, function(err, user) {
        if (err) {
          return cb(err);
        }
        if (!user) {
          return cb(null, false);
        }
        //return cb(null, user);
        return cb(null, user);
      });
    }));
}
