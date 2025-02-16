export const CREATE_ORDER = "CREATE_ORDER";
export const CANCEL_ORDER = "CANCEL_ORDER";
export const ON_RAMP = "ON_RAMP";

export const GET_DEPTH = "GET_DEPTH";
export const GET_OPEN_ORDERS = "GET_OPEN_ORDERS";
export const GET_TRADE="GET_TRADE"
export const GET_TICKER="GET_TICKER"
export type MessagefromAPi={
    type:typeof CREATE_ORDER
    ,
    data:{
        market:string,
        price:string,
        quantity:string,
        side:"buy"|"sell",
        userId:string
    }
}|{
    type:typeof CANCEL_ORDER
    ,
    data:{
        orderId:string,
        market:string,
    }
}|{
    type:typeof GET_DEPTH
    data:{
        market:string
    }
}|{
    type:typeof GET_OPEN_ORDERS,
    data:{
        usedId:string,
        market:string
    }
}|{
    type:typeof ON_RAMP,
    data:{
        amount:string,
        userId:string,
        txnid:string
    }
}|{
    type:typeof GET_TRADE
    data:{
        market:string      
    }
    
}|{
    type:typeof GET_TICKER,
    data:{
        market:string
    }
}