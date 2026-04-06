import express from "express";

let cache = null;
let isFetching = false;
import sqlite3 from 'better-sqlite3';

const app = express();

app.use(express.json());

const getFromDb = async()=>{
    await new Promise(r => (setTimeout(r,500)));
    return { users: ["yash", "amit", "alok"] };
}

app.get("/users",async(req,res)=>{
    if(cache) return res.json(cache);
    if(!isFetching){
        isFetching = true;
        cache = await getFromDb;
    }else{
        await new Promise(r => (setTimeout(r,500)));
    return res.json(cache);

    }
    cache = await getFromDb();
    return res.json(cache);
});

app.listen(3000,()=>{
    console.log("server running on 3000");
});




const db = new sqlite3("./database.db");


 db.exec(`CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      password TEXT NOT NULL
    )`);



const insert = db.prepare(`INSERT INTO user(email,password) VALUES(?,?)`);

console.log("storing user in the table ")
for(let i=0;i<5000;i++){
    insert.run(`user${i}@gmail.com`,"hashedpassword");
}
console.log("user stored successfuly");


console.log("fetching user... no indexing");

console.time("no index");
db.prepare(`SELECT * FROM user WHERE email = ?`).get("user4999@gmail.com");
console.timeEnd("no index");


db.exec( `CREATE INDEX IF NOT EXISTS idx ON user(email)`);

console.time("with index");
db.prepare(`SELECT * FROM user WHERE email = ?`).get("user4999@gmail.com");
console.timeEnd("with index");




