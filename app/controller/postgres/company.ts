import { Router, Request, Response } from 'express';
import * as pg from 'pg'
import * as postgres from '../../helpers/postgres'
import * as myConfig from 'config';
const router: Router = Router();
let config:any = myConfig.get('Config');
router.post('/', (req: Request, res: Response) => {

    let data = req.body;
    postgres.doQuery(
        `insert into tb_company (comp_code,comp_name) 
        values ('${data.compCode}','${data.compName}')`
        ,(err, data) => {
            if (err) {
                res.json(err);
            }
            else {
                res.json(data);
            }
        });
        
    //res.json(req.body);
});
export const CompanyController: Router = router;