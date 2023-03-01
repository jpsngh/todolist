import mongoose from "mongoose";

const taskSchema= mongoose.Schema({
    desc: String,
    

})
const Tasklist = mongoose.model('Tasklist',taskSchema)



export { Tasklist,taskSchema} 