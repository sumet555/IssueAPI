"use strict";
var mongodb_1 = require("mongodb");
var myConfig = require("config");
var MongoDB = (function () {
    function MongoDB() {
        var _this = this;
        var config = myConfig.get('Config');
        mongodb_1.MongoClient.connect(config.mongodbUrl, function (err, db) {
            if (err) {
                console.log(err);
            }
            else {
                _this.mongodb = db;
            }
        });
    }
    return MongoDB;
}());
var mongoDB = new MongoDB();
module.exports = mongoDB;
