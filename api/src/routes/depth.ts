import {Router} from "express"
import { ReddisManager } from "../Redismanager"
import { GET_DEPTH } from "../types"
export const depthrouter=Router();
depthrouter.get("/",async(req,res)=>{
    const {symbol}=req.query;  
    const response=await ReddisManager.getInstance().sendandwait({
        type:GET_DEPTH,
        data:{
            market:symbol as string
        },    
    })
    res.json(response.payload)
})

