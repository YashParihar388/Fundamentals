import express from "express";
let cache = null;
let isFetching = false;
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

