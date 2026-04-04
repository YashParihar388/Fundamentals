import express from 'express';
import userRoutes from "./routes/user.route.js";

const app = express();

app.use(express.json());

import middleware from "./authMiddleware.js"

app.get("/profile",middleware,(req,res)=>{
     res.json({user:req.user})
})
app.use("./",userRoutes);
export default app;


