"use strict";
exports.__esModule = true;
var express_1 = require("express");
var mongoDB_1 = require("../helpers/mongoDB");
var myConfig = require("config");
var config = myConfig.get('Config');
var jwt = require("jwt-simple");
var router = express_1.Router();
router.post("/doLogin", function (req, res) {
    if (req.body.email && req.body.password) {
        mongoDB_1.mongodb.collection("user").findOne({
            email: req.body.email,
            password: req.body.password
        }).then(function (results) {
            var userInfo = results;
            if (userInfo) {
                var token = jwt.encode(userInfo, config.auth.jwtSecret);
                res.json({
                    success: true,
                    token: token
                });
            }
            else {
                res.json({
                    success: false,
                    message: 'Login fail.'
                });
            }
        })["catch"](function (err) {
            res.sendStatus(401);
        });
    }
    else {
        res.sendStatus(401);
    }
});
exports.LoginController = router;
