"use strict";
var passport = require("passport");
var passportJWT = require("passport-jwt");
var myConfig = require("config");
var config = myConfig.get('Config');
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
    secretOrKey: config.auth.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};
var Auth = (function () {
    function Auth() {
        var strategy = new Strategy(params, function (payload, done) {
            var user = payload;
            if (user) {
                return done(null, user);
            }
            else {
                return done(new Error("User not found"), null);
            }
        });
        passport.use(strategy);
    }
    // ใช้ ครั้งเดียว
    Auth.prototype.initialize = function () {
        return passport.initialize();
    };
    //ใช้ทุกครั้งที่เข้ามา
    Auth.prototype.authenticate = function () {
        return passport.authenticate("jwt", config.auth.jwtSession);
    };
    return Auth;
}());
;
var jwt = new Auth();
module.exports = jwt;
