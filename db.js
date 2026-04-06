 import sQlite3 from "sqlite3";

 const sqlite3 = sQlite3.verbose();


 const db = new sqlite3.Database("./Database.db",(err)=>{
    if(err){
        console.error(err.message);
    }else{
        console.log("connection established");
    }
 })

 export  default {db};


 
 