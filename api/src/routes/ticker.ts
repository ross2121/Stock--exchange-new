import { Router } from "express";
import { ReddisManager } from "../Redismanager";
import { GET_TICKER } from "../types";
export const tickerRouter=Router();
tickerRouter.get("/tick",async(req,res)=>{
     const {symbol}=req.query;
     console.log("")
     console.log(symbol);  
        const response=await ReddisManager.getInstance().sendandwait({
            type:GET_TICKER,
            data:{
                market:symbol as string
            },    
        })
    res.json(response.payload);
})