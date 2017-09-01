"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mongodb_1 = require("mongodb");
var mongodb_2 = require("../helpers/mongodb");
var multer = require("multer");
var myConfig = require("config");
var fs = require("fs");
//var fs=require('fs');
var router = express_1.Router();
var config = myConfig.get('Config');
//var mongodb;
var mailer = require("nodemailer");
var smtpTransport = mailer.createTransport(config.smtp);
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var folder = config.uploadPath + req.params.folderName;
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
router.get('/', function (req, res) {
    mongodb_2.mongodb.collection("issue").find().toArray().then(function (data) {
        res.json(data);
    });
});
//get value by _id
router.get('/findByID/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    mongodb_2.mongodb.collection("issue").findOne({ _id: id })
        .then(function (data) {
        res.json(data);
    });
});
//get value by _id
router.get('/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    mongodb_2.mongodb.collection("issue").findOne({ _id: id })
        .then(function (data) {
        res.json(data);
    });
});
router.post('/', function (req, res) {
    //ข้อมูลที่ได้มากจากการ post จะเป็น req.body
    //insert into mongodb from post in postman
    var data = req.body;
    mongodb_2.mongodb.collection("issue").insert(data).then(function (data) {
        var mail = {
            to: 'sumetbai@metrosystems.co.th',
            subject: "your issue no : " + req.body.issueno,
            html: "\n                    <h4> your issue no : " + req.body.issueno + " </h4>\n                    <b>thanks</b>\n                "
        };
        smtpTransport.sendMail(mail, function (error, response) {
            smtpTransport.close();
            if (error) {
                res.json(error);
            }
            else {
                res.json(data);
            }
        });
        // console.dir(data);
        //res.json(data);
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
    mongodb_2.mongodb.collection("issue").find({
        title: new RegExp("" + data.searchText)
    }).skip(data.numPage * data.rowPerPage)
        .limit(data.rowPerPage)
        .toArray().then(function (datas) {
        ret.row = datas;
        mongodb_2.mongodb.collection("issue").find({
            title: new RegExp("" + data.searchText)
        }).count().then(function (num) {
            ret.total = num;
            res.json(ret);
        });
    });
    //res.json(req.body);
});
//delete
///:id คือ parameter ที่รับเข้ามา ในรูปแบบของ url
router.delete('/:id', function (req, res) {
    // req.params.id คือ parameter ที่ได้ ObjectID คือ _id จาก mongodb
    // ถ้าเป็น ฟิล ธรรมดา ไม่ต้องใช้ ObjectID แค่เปลี่ยน _id เป็น ชื่อฟิล เลย
    var id = new mongodb_1.ObjectID(req.params.id);
    mongodb_2.mongodb.collection("issue").deleteOne({ _id: id }).then(function (data) {
        res.json(data);
    });
});
//put
router.put('/:id', function (req, res) {
    var id = new mongodb_1.ObjectID(req.params.id);
    var data = req.body;
    mongodb_2.mongodb.collection("issue").updateOne({ _id: id }, data).then(function (data) {
        res.json(data);
    });
});
var upload = multer({ storage: storage });
router.post('/attach/:folderName', upload.single('attach'), function (req, res) {
    res.json({
        success: true
    });
});
router.get('/attach/:folderName', function (req, res) {
    var folder = config.uploadPath + req.params.folderName;
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
    fs.readdir(folder, function (err, files) {
        res.json(files);
    });
});
router.get('/attach/:folderName/:fileName', function (req, res) {
    fs.readFile(config.uploadPath + "/" + req.params.folderName + "/" + req.params.fileName, function (err, data) {
        if (!err) {
            res.write(data);
            res.end();
        }
        else {
            res.end();
        }
    });
});
router.get('/attach/delete/:folderName/:fileName', function (req, res) {
    fs.unlink(config.uploadPath + "/" + req.params.folderName + "/" + req.params.fileName, function (data) {
        res.json(data);
        res.end();
    });
});
exports.IssueController = router;
//# sourceMappingURL=F:/work/Train_JS/IssueAPI/controller/issue.js.map