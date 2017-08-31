"use strict";
exports.__esModule = true;
var express_1 = require("express");
var mongodb_1 = require("mongodb");
var mongodb_2 = require("../helpers/mongodb");
var router = express_1.Router();
//var mongodb;
router.get('/', function (req, res) {
    mongodb_2.mongodb.collection("user").find().toArray().then(function (data) {
        res.json(data);
    });
});
router.get('/usertype', function (req, res) {
    mongodb_2.mongodb.collection("usertype").find().toArray().then(function (data) {
        res.json(data);
    });
});
//get value by _id
router.get('/findByID/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    mongodb_2.mongodb.collection("user").findOne({ _id: id })
        .then(function (data) {
        res.json(data);
    });
});
//get value by _id
router.get('/usertype/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    mongodb_2.mongodb.collection("usertype").findOne({ _id: id })
        .then(function (data) {
        res.json(data);
    });
});
router.post('/', function (req, res) {
    //ข้อมูลที่ได้มากจากการ post จะเป็น req.body
    //insert into mongodb from post in postman
    var data = req.body;
    mongodb_2.mongodb.collection("user").insertOne(data).then(function (data) {
        res.json(data);
    });
    //res.json(req.body);
});
//search
router.post('/search', function (req, res) {
    //ข้อมูลที่ได้มากจากการ post จะเป็น req.body
    //insert into mongodb from post in postman
    var ret = {
        row: [],
        total: Number
    };
    var data = req.body;
    mongodb_2.mongodb.collection("user").find({
        username: new RegExp("" + data.searchText)
    }).skip(data.numPage * data.rowPerPage)
        .limit(data.rowPerPage)
        .toArray().then(function (datas) {
        ret.row = datas;
        mongodb_2.mongodb.collection("user").find({
            username: new RegExp("" + data.searchText)
        }).count().then(function (num) {
            ret.total = num;
            res.json(ret);
        });
    });
    //res.json(req.body);
});
//delete
///:id คือ parameter ที่รับเข้ามา ในรูปแบบของ url
router["delete"]('/:id', function (req, res) {
    // req.params.id คือ parameter ที่ได้ ObjectID คือ _id จาก mongodb
    // ถ้าเป็น ฟิล ธรรมดา ไม่ต้องใช้ ObjectID แค่เปลี่ยน _id เป็น ชื่อฟิล เลย
    var id = new mongodb_1.ObjectID(req.params.id);
    mongodb_2.mongodb.collection("user").deleteOne({ _id: id }).then(function (data) {
        res.json(data);
    });
});
//put
router.put('/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    var data = req.body;
    mongodb_2.mongodb.collection("user").updateOne({ _id: id }, data).then(function (data) {
        res.json(data);
    });
});
// MongoClient.connect("mongodb://localhost:27017/issuedb", (err, db) => {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         mongodb = db;
//     }
// });
exports.UserController = router;
