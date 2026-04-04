import {db} from "./db.js"

db.run(`CREATE TABLE IF NOT EXISTS users(
    id Integer PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    age Integer)`,(err)=>{
        if(err){
            console.error(err.message);
        }else{
            console.log("table created")
        }
    })
    






















