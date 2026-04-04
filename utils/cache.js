const cache ={};


const setCache =(key,data)=>{
    cache[key] ={
        data,
        TimeStamp:Date.now()
    }
}

const getCache=(key)=>{
    return cache[key];
}

const removeCache =(key)=>{
     delete cache[key]
}

export {setCache, getCache, removeCache};