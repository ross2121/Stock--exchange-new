import { Cancel_Order,CREATE_ORDER,GET_DEPTH,GET_OPEN_ORDER,ON_RAMP } from ".";
export type Messagetoengine={
    type:typeof CREATE_ORDER,
    data:{
        market:string,
        price:string,
        quantity:string,
        side:"buy"|"sell",
        userId:string
    }
}|{
    type:typeof Cancel_Order,
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
    type:typeof GET_OPEN_ORDER,
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
}