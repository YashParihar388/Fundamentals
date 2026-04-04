import express from 'express';
import db from "./db.js"
import openAI from "openai"

import app from "./app.js"


const PORT = 8000;
app.get('/',(req,res)=>{
    res.send("you are at home page")
})
app.get('/hello',(req,res)=>{
    res.send("hello yash")
})

app.post("/login",(req,res)=>{
    const username="demo";
    const password="1234";

    if(username == "demo"){
        return res.status(200).json({
            message:"login success"
        })
    }
})

const users = [
    {"id":3,"name":"rizz","email":"xyz@gmail"},
    {"id":1,"name":"rohan","email":"abs@gmail"}
    
]
// to fetch all the users
app.get("/users",(req,res)=>{
    res.status(200).json(users);
})


// to access user with id
app.get("/users/:id",(req,res)=>{
    const id = parseInt(req.params.id);

    const user =users.find(u=> u.id === id);

    if(!user){
        return res.status(400).json({message:"user not found"})
    }
    
    res.json(user);
})

app.get("/login",(req,res)=>{
    const username="demo";
    const password="1234";

    if(username == "demo"){
        return res.status(200).json({
            message:"login success"
        })
    }
})
app.listen(PORT,()=>{
    console.log("server running on 8000")
})


app.post("/users",(req,res)=>{

    const [name,age,email] = req.body

    if(name.trim() === ""){
        return res.status(400).json({
            message:"name cannot be empty"
        })
    }
    if(!email.includes('@')){
        res.status(400).json({
            message:"please provide valid email"
        })
    }



    if(!name || !age){
        return res.status(400).json({
            message:"please provide name and age"
        })
    }

    const user1 ={
        id:users.length + 1,
        name,
        age,
        email
    }

    users.push(user1)

    res.status(200).json(users)
});


app.delete("/users/:id",(req,res)=>{
    const id=parseInt(req.params.id)

    const index = users.findIndex(u=> u.id === id)

    if(!index){
        return res.status(400).json({
            message:"user not found"
        })
    }

    const deletedUser = users.splice(index,1)

    res.json({
        message:"user deleted successfully",
        user:deletedUser[0]
    })
})

app.get("/userspage",(req,res)=>{
    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 5;

    if(!page || !limit){
        return res.status(400).json({
            message:"something went wrong"
        })
    }

    const startindex = (page -1) * limit;
    const endindex = startindex+limit;

    const paginatedUsers = users.splice(startindex,endindex);

    res.json({
        page,
        limit,
        totalUsers: users.length,
        data:paginatedUsers
    })
})

//to get all the users 
app.get("/users",(req,res)=>{
    db.all("SELECT * FROM users",[],(err,rows)=>{
        if(err){
            console.error(err.message)
        }
        res.json(rows);
    })
})

//to fill the user in table 
app.post("/users",(req,res)=>{
    const {name,email,age} = req.body;

    if(!name || name.trim() === ""){
        return res.status(400).json({
            message:"please enter name"
        })
    }
    if(!email || !email.includes('@')){
        return res.status(400).json({
            message:"please enter correct email"
        })
    }

    db.run(`INSERT INTO users(name,email,age) VALUES(?,?,?)`,
        [name,email,age],
        function(err){
            if(err){
                return res.status(500).json({error:err.message})
            }
            res.status(201).json({
                id:this.lastID,
                name,
                email,
                age
            })

        }
    )

    
})

// to delete the user
app.delete("/users/:id",(req,res) =>{
    const id = req.params.id;

    if(!id){
        return res.status(400).json({message:"theres no fuckin id"
        })
    }

    db.run(
        `DELETE FROM users WHERE id=?`,[id],
        function(err){
            if(err){
                return res.status(500).json({message:"internal server error"})
            }
            if(this.changes === 0){
                return res.status(400).json({message:"user not found"})
            }

            res.json({message:"user deleted"})
        }
    )
})

const client = new openAI({
    apiKey:process.env.API_KEY
})


async function main() {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: "Explain gym workout plan in simple words" }
    ],
  });
console.log(response.choices[0].message.content)
}

main();

module.exports = app;
