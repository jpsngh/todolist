import mongoose from 'mongoose'
const DB_URL = "mongodb://localhost:27017/task"
const connectDb = async ()=>{ 
await  mongoose.connect(DB_URL);
  console.log("db connected")
}

export default connectDb