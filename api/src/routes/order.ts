import { Router } from "express";
import { ReddisManager } from "../Redismanager";
import { CREATE_ORDER,Cancel_Order,ON_RAMP,GET_OPEN_ORDER } from "../types";
export const orderrouter=Router();
orderrouter.post("/order",async(req,res)=>{
    try{
        const {market,price,quantity,side,userId}=req.body
    const response= await ReddisManager.getInstance().sendandwait({
        type: CREATE_ORDER,
        data: {
            market,
            price,
            quantity,
            side,
            userId
        }
    });
    res.json(response.payload);}
    catch(e){
        console.log(e);
    }
})
orderrouter.delete("/",async(req,res)=>{
    const {orderId,market}=req.body;
    const respone=await ReddisManager.getInstance().sendandwait({
        type:Cancel_Order,
        data:{
            orderId,
            market
        }
    })
    res.json(respone.payload)
})
orderrouter.get("/open",async(req,res)=>{
    const response=await ReddisManager.getInstance().sendandwait({
        type:GET_OPEN_ORDER,
        data:{
            usedId:req.query.userId as string,
            market:req.query.market as string
        }
    })
    res.json(response.payload)
})
orderrouter.get("/account",async(req,res)=>{
    const {amount,userId,txnid}=req.body
    const respone=await ReddisManager.getInstance().sendandwait({
        type:ON_RAMP,
    data:{
        amount,
        userId,
        txnid
    }
    })
    res.json(respone.payload)
})