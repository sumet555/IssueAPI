"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var company_1 = require("./controller/company");
var user_1 = require("./controller/user");
var customer_1 = require("./controller/customer");
var issue_1 = require("./controller/issue");
var bodyParser = require("body-parser");
var cors = require("cors");
var app = express();
//get port or if not found port default port 3000 
var port = process.env.PORT || '3000';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use('/company', company_1.CompanyController);
app.use('/user', user_1.UserController);
app.use('/customer', customer_1.CustomerController);
app.use('/issue', issue_1.IssueController);
//Serve the application at the given port
app.listen(port, function () {
    // use ` (windows+changelanguage)
    //Success callback
    console.log("Listening at http://localhost:" + port + "/");
});
//# sourceMappingURL=F:/work/Train_JS/IssueAPI/server.js.map