import express from "express";
import path from "path";
import bodyParser from "body-parser";
import admin from "./routes/admin.js"
import { connect } from "http2";
import connectDb from "./util/database.js";
import cookie from 'cookie-parser';

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json());
app.use(express.static('public'))
app.set('views',"./views")
app.set("view engine","ejs")
app.use("/",admin);

connectDb();

app.listen(3000);


