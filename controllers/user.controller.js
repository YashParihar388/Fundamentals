import {getUsers as getUsersFromService} from "../service/user.service.js";


const getUsers = async (req,res)=>{
   try {
    const user = await getUsersFromService();
    res.json(user);
   } catch (error) {
    res.status(500).json({message:error.message});
   }
}

export {getUsers};