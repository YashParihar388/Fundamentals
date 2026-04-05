import express from 'express';
import userRoutes from "./routes/user.route.js";
import rate from "express-rate-limit";


const limit =rate({
     WindowMs: 15*60*1000,
     max:10,
     message:"you are trying to access to many times "
})


app.use(limit);
const app = express();

app.use(express.json());

import middleware from "./authMiddleware.js"

app.get("/profile",middleware,(req,res)=>{
     res.json({user:req.user})
})
app.use("./",userRoutes);
export default app;


