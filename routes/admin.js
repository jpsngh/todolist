import express, { Router } from "express"
express.urlencoded({extended:true})
import { rendertask,pusht, deleteTask,logintask,logtask} from "../controller/taskpull.js";


const router = express.Router();
router.get("/",rendertask)
router.use("/delete",deleteTask)

router.post("/",pusht)
export default router

