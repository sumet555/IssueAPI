import { Router, Request, Response } from 'express';
import { MongoClient, ObjectID } from 'mongodb';
//import * as myConfig from 'config';
import { mongodb } from '../helpers/mongodb';
import * as auth from '../helpers/auth';
import * as async from 'async';
//let config:any = myConfig.get('Config');



const router: Router = Router();
//var mongodb=mongodb1;

//authen all controller company (ใช้อันใดอันหนึ่ง)
router.use(auth.authenticate());

//authen for method get
// router.get('/',auth.authenticate(),  (req:Request, res:Response) => {
//     mongodb.collection("company").find().toArray().then((data)=> {
//         res.json(data);
//     });
// });

router.get('/', (req: Request, res: Response) => {
    mongodb.collection("company").find().toArray().then((data) => {
        res.json(data);
    });
});


//get value by _id
router.get('/findByID/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    mongodb.collection("company").findOne({ _id: id })
        .then((data) => {
            res.json(data);
        });
});

//post
//test post in postman
//router.post('/',  (req:Request, res:Response) => {
//ข้อมูลที่ได้มากจากการ post จะเป็น req.body
//res.json(req.body);
//});
router.post('/', (req: Request, res: Response) => {
    //ข้อมูลที่ได้มากจากการ post จะเป็น req.body
    //insert into mongodb from post in postman
    let data = req.body;
    mongodb.collection("company").insertOne(data).then((data) => {
        res.json(data);
    });
    //res.json(req.body);
});
//search
router.post('/search', (req: Request, res: Response) => {
    //ข้อมูลที่ได้มากจากการ post จะเป็น req.body
    //insert into mongodb from post in postman

    let ret = {
        row: [],
        total: Number
    };
    let data = req.body;
    mongodb.collection("company").find({
        compName: new RegExp(`${data.searchText}`)
    }).skip(data.numPage * data.rowPerPage)
        .limit(data.rowPerPage)
        .toArray().then((datas) => {
            ret.row = datas;
            mongodb.collection("company").find({
                compName: new RegExp(`${data.searchText}`)
            }).count().then((num) => {
                ret.total = num;
                res.json(ret);
            });


        });
    //res.json(req.body);
});
//delete
///:id คือ parameter ที่รับเข้ามา ในรูปแบบของ url
router.delete('/:id', (req: Request, res: Response) => {
    // req.params.id คือ parameter ที่ได้ ObjectID คือ _id จาก mongodb
    // ถ้าเป็น ฟิล ธรรมดา ไม่ต้องใช้ ObjectID แค่เปลี่ยน _id เป็น ชื่อฟิล เลย
    let id = new ObjectID(req.params.id);
    mongodb.collection("company").deleteOne({ _id: id }).then((data) => {
        res.json(data);
    });
});

//put
router.put('/:id', (req: Request, res: Response) => {

    let id = new ObjectID(req.params.id);
    let data = req.body;
    mongodb.collection("company").updateOne({ _id: id }, data).then((data) => {
        res.json(data);
    });
});

router.post('/find', (req: Request, res: Response) => {
    let ret = {
        row: [],
        total: Number
    };
    let data = req.body;
    async.parallel([
        function (callback) {
            mongodb.collection("company").find({
                compName: new RegExp(`${data.searchText}`)
            }).skip(data.numPage * data.rowPerPage)
                .limit(data.rowPerPage)
                .toArray().then((datas) => {
                    callback(null, datas);
                });
        },
        function (callback) {
            mongodb.collection("company").find(
                {
                    compName: new RegExp(`${data.searchText}`)
                }
            ).count().then((num) => {
                callback(null, num);
            });
        }
    ],
        // optional callback
        function (err, results) {
            let ret = {
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
export const CompanyController: Router = router;