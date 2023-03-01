import mongoose from 'mongoose'

const connectDb = async ()=>{ 
await  mongoose.connect(process.env.DB_URL,{useNewUrlParser: true, useUnifiedTopology: true});
  console.log("db connected")
}

export default connectDb