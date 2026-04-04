import {db} from "../db.js"
import {getCache, setCache} from "../utils/cache.js";

const getUsers = async()=>{
    const key = "users";

    const cached = getCache(key);

    if(cached){
        console.log("data cached ")
        return cached.data;
    }

    console.log("fetching from the db");

    const user = await new Promise((resolve,reject)=>{
        db.all(`SELECT * FROM users`,[],(err,rows)=>{
            if(err) return reject(err);

            resolve(rows)
        })
    } )

    setCache(key,user)

    return user;

    
}

export {getUsers};