"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mongodb_1 = require("mongodb");
var router = express_1.Router();
var mongodb;
router.get('/', function (req, res) {
    mongodb.collection("customer").find().toArray().then(function (data) {
        res.json(data);
    });
});
//get value by _id
router.get('/findByID/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    mongodb.collection("customer").findOne({ _id: id })
        .then(function (data) {
        res.json(data);
    });
});
router.post('/', function (req, res) {
    var data = req.body;
    mongodb.collection("customer").insertOne(data).then(function (data) {
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
    mongodb.collection("customer").find({
        customername: new RegExp("" + data.searchText)
    }).skip(data.numPage * data.rowPerPage)
        .limit(data.rowPerPage)
        .toArray().then(function (datas) {
        ret.row = datas;
        mongodb.collection("customer").find({
            customername: new RegExp("" + data.searchText)
        }).count().then(function (num) {
            ret.total = num;
            res.json(ret);
        });
    });
    //res.json(req.body);
});
router.delete('/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    mongodb.collection("customer").deleteOne({ _id: id }).then(function (data) {
        res.json(data);
    });
});
router.put('/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    var data = req.body;
    mongodb.collection("customer").updateOne({ _id: id }, data).then(function (data) {
        res.json(data);
    });
});
mongodb_1.MongoClient.connect("mongodb://localhost:27017/issuedb", function (err, db) {
    if (err) {
        console.log(err);
    }
    else {
        mongodb = db;
    }
});
exports.CustomerController = router;
//# sourceMappingURL=F:/work/Train JS/IssueAPI/controller/customer.js.map