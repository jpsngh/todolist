import express from "express";
import path from "path";
import bodyParser from "body-parser";
import admin from "./routes/admin.js"
import { connect } from "http2";
import connectDb from "./util/database.js";
import cookie from 'cookie-parser';
import dotenv from 'dotenv';
const app = express();

dotenv.config();
app.use(bodyParser.urlencoded({extended:false}));
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json());
app.use(express.static('public'))
app.set('views',"./views")
app.set("view engine","ejs")
app.use("/",admin);

connectDb();

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});


