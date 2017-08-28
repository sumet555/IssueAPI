import  {Router,Request,Response} from 'express';
import { MongoClient,ObjectID } from 'mongodb';

const router:Router=Router();
var mongodb;

router.get('/',  (req:Request, res:Response) => {
    mongodb.collection("customer").find().toArray().then((data)=> {
        res.json(data);
    });
});

//get value by _id
router.get('/findByID/:id',  (req:Request, res:Response) => {
    let id=new ObjectID(req.params.id);
    mongodb.collection("customer").findOne({_id:id})
        .then((data)=> {
        res.json(data);
    });
});

router.post('/',  (req:Request, res:Response) => {
    let data=req.body;
    mongodb.collection("customer").insertOne(data).then((data)=>{
        res.json(data);
    });
    //res.json(req.body);
});

router.post('/search',  (req:Request, res:Response) => {
    //ข้อมูลที่ได้มากจากการ post จะเป็น req.body
    //insert into mongodb from post in postman
    
    let ret={
        row:[],
        total:Number
    };
    let data=req.body;
    mongodb.collection("customer").find({
        customername: new RegExp(`${data.searchText}`)
    }).skip(data.numPage*data.rowPerPage)
    .limit(data.rowPerPage)
    .toArray().then((datas)=>{
        ret.row=datas;
        mongodb.collection("customer").find({
        customername: new RegExp(`${data.searchText}`)
    }).count().then((num)=>{
                ret.total=num; 
                res.json(ret);
            });
       
       
    });
    //res.json(req.body);
});
router.delete('/:id',  (req:Request, res:Response) => {
    let id=new ObjectID(req.params.id);
    mongodb.collection("customer").deleteOne({_id : id}).then((data)=>{
        res.json(data);
    });
});

router.put('/:id',  (req:Request, res:Response) => {
     let id=new ObjectID(req.params.id);
     let data=req.body;
     mongodb.collection("customer").updateOne({_id : id},data).then((data)=>{
         res.json(data);
     });
 });

 MongoClient.connect("mongodb://localhost:27017/issuedb", (err, db) => {
    
        if (err) {
            console.log(err);
        }
        else {
            mongodb = db;
    
        }
    });
export const CustomerController:Router=router;