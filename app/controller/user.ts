import {Router,Request,Response} from 'express';
import {MongoClient,ObjectID} from 'mongodb';
import { mongodb } from '../helpers/mongodb';
import * as multer from 'multer';
import * as myConfig from 'config';
var fs=require('fs');

const router:Router=Router();
//var mongodb;
let config:any=myConfig.get('Config');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, req.params.id);
    }
})

var upload = multer({ storage: storage });

router.post('/profile/:id', upload.single('avatar'), (req: Request, res: Response) => {
    console.log(req.body);
    res.json({success:true});
});

router.get('/profile/:id', (req: Request, res: Response) => {
    fs.readFile(`${config.uploadPath}/${req.params.id}`, (err, data) => {
        if (!err) {
            res.write(data);
            res.end();
        } else {
            res.end();
        }
    });
});

router.get('/',  (req:Request, res:Response) => {
    mongodb.collection("user").find().toArray().then((data)=> {
        res.json(data);
    });
});

router.get('/usertype',  (req:Request, res:Response) => {
    mongodb.collection("usertype").find().toArray().then((data)=> {
        res.json(data);
    });
});

//get value by _id
router.get('/findByID/:id',  (req:Request, res:Response) => {
    let id=new ObjectID(req.params.id);
    mongodb.collection("user").findOne({_id:id})
        .then((data)=> {
        res.json(data);
    });
});

//get value by _id
router.get('/usertype/:id',  (req:Request, res:Response) => {
    let id=new ObjectID(req.params.id);
    mongodb.collection("usertype").findOne({_id:id})
        .then((data)=> {
        res.json(data);
    });
});

router.post('/',  (req:Request, res:Response) => {
    //ข้อมูลที่ได้มากจากการ post จะเป็น req.body
    //insert into mongodb from post in postman
    let data=req.body;
    mongodb.collection("user").insert(data).then((data)=>{
        console.dir(data);
        res.json(data);
    });
    //res.json(req.body);
});
//search
router.post('/search',  (req:Request, res:Response) => {
    //ข้อมูลที่ได้มากจากการ post จะเป็น req.body
    //insert into mongodb from post in postman
    
    let ret={
        row:[],
        total:Number
    };
    let data=req.body;
    mongodb.collection("user").find({
        firstName: new RegExp(`${data.searchText}`)
    }).skip(data.numPage*data.rowPerPage)
    .limit(data.rowPerPage)
    .toArray().then((datas)=>{
        ret.row=datas;
        mongodb.collection("user").find({
        firstName: new RegExp(`${data.searchText}`)
    }).count().then((num)=>{
                ret.total=num; 
                res.json(ret);
            });
       
       
    });
    //res.json(req.body);
});
//delete
///:id คือ parameter ที่รับเข้ามา ในรูปแบบของ url
router.delete('/:id',  (req:Request, res:Response) => {
    // req.params.id คือ parameter ที่ได้ ObjectID คือ _id จาก mongodb
    // ถ้าเป็น ฟิล ธรรมดา ไม่ต้องใช้ ObjectID แค่เปลี่ยน _id เป็น ชื่อฟิล เลย
    let id=new ObjectID(req.params.id);
    mongodb.collection("user").deleteOne({_id : id}).then((data)=>{
        res.json(data);
    });
});

//put
router.put('/:id',  (req:Request, res:Response) => {
   
    let id=new ObjectID(req.params.id);
    let data=req.body;
    mongodb.collection("user").updateOne({_id : id},data).then((data)=>{
        res.json(data);
    });
});


export const UserController:Router=router;