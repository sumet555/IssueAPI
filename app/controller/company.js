"use strict";
exports.__esModule = true;
var express_1 = require("express");
var mongodb_1 = require("mongodb");
//import * as myConfig from 'config';
var mongodb_2 = require("../helpers/mongodb");
var auth = require("../helpers/auth");
var async = require("async");
//let config:any = myConfig.get('Config');
var router = express_1.Router();
//var mongodb=mongodb1;
//authen all controller company (ใช้อันใดอันหนึ่ง)
router.use(auth.authenticate());
//authen for method get
// router.get('/',auth.authenticate(),  (req:Request, res:Response) => {
//     mongodb.collection("company").find().toArray().then((data)=> {
//         res.json(data);
//     });
// });
router.get('/', function (req, res) {
    mongodb_2.mongodb.collection("company").find().toArray().then(function (data) {
        res.json(data);
    });
});
//get value by _id
router.get('/findByID/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    mongodb_2.mongodb.collection("company").findOne({ _id: id })
        .then(function (data) {
        res.json(data);
    });
});
//post
//test post in postman
//router.post('/',  (req:Request, res:Response) => {
//ข้อมูลที่ได้มากจากการ post จะเป็น req.body
//res.json(req.body);
//});
router.post('/', function (req, res) {
    //ข้อมูลที่ได้มากจากการ post จะเป็น req.body
    //insert into mongodb from post in postman
    var data = req.body;
    mongodb_2.mongodb.collection("company").insertOne(data).then(function (data) {
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
    mongodb_2.mongodb.collection("company").find({
        compName: new RegExp("" + data.searchText)
    }).skip(data.numPage * data.rowPerPage)
        .limit(data.rowPerPage)
        .toArray().then(function (datas) {
        ret.row = datas;
        mongodb_2.mongodb.collection("company").find({
            compName: new RegExp("" + data.searchText)
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
    mongodb_2.mongodb.collection("company").deleteOne({ _id: id }).then(function (data) {
        res.json(data);
    });
});
//put
router.put('/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    var data = req.body;
    mongodb_2.mongodb.collection("company").updateOne({ _id: id }, data).then(function (data) {
        res.json(data);
    });
});
router.post('/find', function (req, res) {
    var ret = {
        row: [],
        total: Number
    };
    var data = req.body;
    async.parallel([
        function (callback) {
            mongodb_2.mongodb.collection("company").find({
                compName: new RegExp("" + data.searchText)
            }).skip(data.numPage * data.rowPerPage)
                .limit(data.rowPerPage)
                .toArray().then(function (datas) {
                callback(null, datas);
            });
        },
        function (callback) {
            mongodb_2.mongodb.collection("company").find({
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
// MongoClient.connect(config.mongodbUrl, (err, db) => {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         mongodb = db;
//     }
// });
exports.CompanyController = router;
