import {db} from "./db.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import app from "./app.js"

const register =async (req,res)=>{
    const{name,email,password} = req.body;
    if(!name || name.trim()===""){
        return res.status(400).json({message:"error enter name "})
    }
     if(!email || !email.includes("@")){
        return res.status(400).json({message:"error enter email "})
    }
     if(!password|| password.length<6){
        return res.status(400).json({message:"error enter valid password "})
    }
    try {
        const hashed = bcrypt.hash(password,10);
        db.run(`INSERT INTO users(name,email,password) VALUES(?,?,?)`,[name,email,hashed],function(err){
            if(err){
                return res.status(400).json({message:err.message});
            }

            res.json({
                message:"user registered",
                id:this.lastID
            })
        });


    } catch (error) {
        res.status(500).json({message:"server error"});
    }
    
};
const secret_key = "anything";

const login = (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        res.status(400).json({message:"please enter email and password"});
    }
    db.get(`SELECT * FROM users email=?`,[email],
        async (user,err)=>{
            if(err){
                res.status(500).json({message:"server error"})
            }
            if(!user){
                return res.status(400).json("user not found")
            }

            const iscorrect = bcrypt.compare(password,user.password);
            if(!iscorrect){
                res.status(400).json({message:"invalid credentials"})
            }
            const token = jwt.sign({id:user.id,email:user.email},secret_key,{expiresIn:"1h"});


            res.status(200).json({message:"user logged in",token});

        }
    )
}

export {register,login}



