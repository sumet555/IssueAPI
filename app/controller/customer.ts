import  {Router,Request,Response} from 'express';
import { MongoClient,ObjectID } from 'mongodb';
import { mongodb } from '../helpers/mongodb';
import * as auth from '../helpers/auth';
import * as async from 'async';
const router:Router=Router();
router.use(auth.authenticate());

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
router.post('/find', (req: Request, res: Response) => {
    let ret = {
        row: [],
        total: Number
    };
    let data = req.body;
    async.parallel([
        function (callback) {
            mongodb.collection("customer").find({
                compName: new RegExp(`${data.searchText}`)
            }).skip(data.numPage * data.rowPerPage)
                .limit(data.rowPerPage)
                .toArray().then((datas) => {
                    callback(null, datas);
                });
        },
        function (callback) {
            mongodb.collection("customer").find(
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


export const CustomerController:Router=router;