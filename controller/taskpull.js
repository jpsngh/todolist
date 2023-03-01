
import express from "express"
import bodyParser from "body-parser"
const app = express();
app.use(bodyParser.urlencoded({extended:false}));

import mongoose from "mongoose";
import {Tasklist} from "../models/task.js";
import passport from "passport";

var userData = {
    items: []
};

const rendertask = async (req,res)=>{

    res.cookie("jp",156,{maxAge:70000})
    try {
        
        const result = await Tasklist.find()
        console.log(result);
        
    
    res.render("list",{user:result,title:"tasklist"})
    }
    catch{

    }
}
    const pusht =  async(req,res)=>{  
   try 
   {
    console.log(req.cookie);

    const doc = new Tasklist({desc:req.body.newItem,priority:"low"});
   
   
    const result =  await doc.save();
 
   
    console.log(result);
    
    userData.items.push(req.body.newItem);
    console.log(userData);
    res.redirect('/');
   }
   catch{

   }
}

const deleteTask = async(req,res)=>{
    try {

    const del = req.body.delete;
    console.log(del);
   
   const result = await Tasklist.findByIdAndDelete(del)
   
   console.log(result);
   res.redirect('/');
   
  
    }
    catch{
       
    }
}
const logintask = (req,res)=>{

    res.render('login');



}
const logtask = (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    try {

            Tasklist.findOne({email:email},)

    
    
    console.log(email,password);
    if(email== 'jp'&&password== 'jp') {
        res.redirect("/");
    }
    else{
        res.send("no login ")
    }

}
catch(error){
 console.log(error)
}
}
export {pusht,rendertask,deleteTask,logintask,logtask }



