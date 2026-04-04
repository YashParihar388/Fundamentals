import jwt from 'jsonwebtoken';

const secret_key = "anything";
import app from "./app.js";

function middleWare(req,res,next){
    const auth=req.headers.authorization;

    if(!auth){
        return res.status(400).json({messgae:"no token!"});
    }

    const token = auth.split(" ").auth[1];

    if(!token){
        return res.status(400).json({message:"unsupported token format"});

    }
try {
    
    const verify = jwt.verify(token,secret_key);

    req.user  = verify;

    next();
    
} catch (error) {
    console.error(error.message);
}
}

export default middleWare;