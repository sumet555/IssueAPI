"use strict";
exports.__esModule = true;
var express_1 = require("express");
var mongodb_1 = require("mongodb");
var mongodb_2 = require("../helpers/mongodb");
var auth = require("../helpers/auth");
var async = require("async");
var router = express_1.Router();
router.use(auth.authenticate());
router.get('/', function (req, res) {
    mongodb_2.mongodb.collection("customer").find().toArray().then(function (data) {
        res.json(data);
    });
});
//get value by _id
router.get('/findByID/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    mongodb_2.mongodb.collection("customer").findOne({ _id: id })
        .then(function (data) {
        res.json(data);
    });
});
router.post('/', function (req, res) {
    var data = req.body;
    mongodb_2.mongodb.collection("customer").insertOne(data).then(function (data) {
        res.json(data);
    });
    //res.json(req.body);
});
router.post('/search', function (req, res) {
    //ข้อมูลที่ได้มากจากการ post จะเป็น req.body
    //insert into mongodb from post in postman
    var ret = {
        row: [],
        total: Number
    };
    var data = req.body;
    mongodb_2.mongodb.collection("customer").find({
        customername: new RegExp("" + data.searchText)
    }).skip(data.numPage * data.rowPerPage)
        .limit(data.rowPerPage)
        .toArray().then(function (datas) {
        ret.row = datas;
        mongodb_2.mongodb.collection("customer").find({
            customername: new RegExp("" + data.searchText)
        }).count().then(function (num) {
            ret.total = num;
            res.json(ret);
        });
    });
    //res.json(req.body);
});
router.post('/find', function (req, res) {
    var ret = {
        row: [],
        total: Number
    };
    var data = req.body;
    async.parallel([
        function (callback) {
            mongodb_2.mongodb.collection("customer").find({
                compName: new RegExp("" + data.searchText)
            }).skip(data.numPage * data.rowPerPage)
                .limit(data.rowPerPage)
                .toArray().then(function (datas) {
                callback(null, datas);
            });
        },
        function (callback) {
            mongodb_2.mongodb.collection("customer").find({
                compName: new RegExp("" + data.searchText)
            }).count().then(function (num) {
                callback(null, num);
            });
        }
    ], 
    // optional callback
    function (err, results) {
        var ret = {
            row: [],
            total: Number
        };
        ret.row = results[0];
        ret.total = results[1];
        res.json(ret);
    });
});
router["delete"]('/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    mongodb_2.mongodb.collection("customer").deleteOne({ _id: id }).then(function (data) {
        res.json(data);
    });
});
router.put('/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    var data = req.body;
    mongodb_2.mongodb.collection("customer").updateOne({ _id: id }, data).then(function (data) {
        res.json(data);
    });
});
exports.CustomerController = router;
