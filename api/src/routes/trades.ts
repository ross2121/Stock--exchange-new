import { Router } from "express";
import { GET_TRADE } from "../types";
import { ReddisManager } from "../Redismanager";

export const tradesRouter=Router();
tradesRouter.get("/tri",async(req,res)=>{
    const {market}=req.query;
     const response=await ReddisManager.getInstance().sendandwait({
            type:GET_TRADE,
           data:{
            market:market as string
           }    
        })
        res.json(response.payload)
})