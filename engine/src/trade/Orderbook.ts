import { BASE_CURRENCY } from "./Engine";
export interface Order{
    price:number;
    quantity:number;
    orderId:string,
    filled:number,
    side:"buy"|"sell";
    userId:string
}
export interface Fill{  
    price:string,
    qty:number,
    tradeId:number,
    otherUserId:string,
    marketOrderId:String
}
export interface Trade{
    id:number,
    isBuyerMaker:boolean,
    price:number,
    quantity:number,
    timestamp:number,
    market:string |undefined
}
export class Orderbook{
    bids:Order[];
    asks:Order[];
    baseAsset:string;
    quoteAsset:string=BASE_CURRENCY;
    lastTradeId:number;
    currentprice:number
    trades:Trade[];
    constructor(baseAsset:string,bids:Order[],asks:Order[],lastTradeId:number,currentprice:number){
        this.bids=bids;
        this.asks=asks;
        this.baseAsset=baseAsset
        this.lastTradeId=lastTradeId||0;
        this.currentprice=currentprice||0
        this.trades=[];
    }
    ticker(){
        return `${this.baseAsset}_${this.quoteAsset}`
    }
    getSnapshot(){
        return{
            baseAsset:this.baseAsset,
            bids:this.bids,
            asks:this.asks,
            lastTradeId:this.lastTradeId,
            currentPrice:this.currentprice
        }
    }
   
   matchbid(order:Order,market:string):{fills:Fill[],executedQty:number}{
    const fills:Fill[]=[];
    let executedQty=0;
    console.log("assk finea",this.asks);
    
    try{for(let i=0;i<this.asks.length;i++){
        if(this.asks[i].userId==order.userId){
            return {fills:[],executedQty:0}
        }
        else if(this.asks[i].price<=order.price && executedQty<order.quantity){
            const filledqty=Math.min((order.quantity-executedQty),this.asks[i].quantity);
            executedQty+=filledqty;
            this.asks[i].filled+=filledqty;
         fills.push({
            price:this.asks[i].price.toString(),
            qty:filledqty,
            tradeId:this.lastTradeId++,
            otherUserId:this.asks[i].userId,
            marketOrderId:this.asks[i].orderId
         })
         this.trades.push({
            id:Math.random(),
            isBuyerMaker:true,
            price:this.asks[i].price,
             quantity:this.asks[i].quantity,
             timestamp:Date.now(),
             market
       })
        }
    }}catch(e){ console.log(e)}
    for(let i=0;i<this.asks.length;i++){
    if(this.asks[i].filled===this.asks[i].quantity){ 
        this.asks.splice(i,1);
        i--;
    }
    }
    console.log("Match bid result:", { fills, executedQty });
    return{
        fills,
        executedQty
    }
   }
   addorder(order:Order,market:string):{
    executedQty:number,
    fills:Fill[]}{
      if(order.side=="buy"){
        const {executedQty,fills}=this.matchbid(order,market);
         order.filled=executedQty;
         if(executedQty===order.quantity){
            return{
                executedQty,
                fills
            }
         }
         this.bids.push(order);
         console.log("executed",executedQty,fills);
        console.log("bids",this.bids);
         console.log("asks",this.asks);
         return{
            executedQty,
            fills
         }
      }else{
        const {executedQty,fills}=this.matchask(order,market);
        order.filled=executedQty;
        if(executedQty===order.quantity){
            return{
                executedQty,
                fills
            }
        }
        this.asks.push(order);
        console.log("executed",executedQty,fills);
        console.log("bids",this.bids);
         console.log("asks",this.asks);
        return{
            executedQty,
            fills
        }
      }
   }
   matchask(order:Order,market:string):{fills:Fill[],executedQty:number}{
    const fills:Fill[]=[];
    let executedQty=0;
    for(let i=0;i<this.bids.length;i++){
        if(this.bids[i].userId==order.userId){
        return {
            fills:[],
            executedQty:0
        }
        }
        else if(this.bids[i].price>=order.price&&executedQty<order.quantity){
            const remainingqty=Math.min((order.quantity-executedQty),this.bids[i].quantity);
            console.log(this.bids);
            executedQty+=remainingqty;
            this.bids[i].filled+=remainingqty;
            fills.push({
                price:this.bids[i].price.toString(),
                qty:remainingqty,
                tradeId:this.lastTradeId++,
                otherUserId:this.bids[i].userId,
                marketOrderId:this.bids[i].orderId
            })
            this.trades.push({
                 id:Math.random(),
                 isBuyerMaker:true,
                 price:this.bids[i].price,
                  quantity:this.bids[i].quantity,
                  timestamp:Date.now(),
                  market 
            })
        }
    }
    for(let i=0;i<this.bids.length;i++){
        if(this.bids[i].quantity==this.bids[i].filled){
           this.bids.splice(i,1);
           i--;
        }
    }
    return {
        fills,
        executedQty
    }
   }
   cancelorder(order:Order){
    const index=this.bids.findIndex(x=>x.orderId===order.orderId);
    if(index!==-1){
        const price=this.bids[index].price;
        const askprice=this.asks[index].price;
        this.asks.splice(index,1);
        this.bids.splice(index,1);
        return {askprice,price};
    }

   }
   cancelAsk(order:Order){
    const index=this.asks.findIndex(x=>x.orderId===order.orderId);
    if(index!==-1){
        const price=this.asks[index].price;
        this.asks.splice(index,1);
        return price;
    }
   }
   cancelBid(order:Order){
    const index=this.bids.findIndex(x=>x.orderId===order.orderId);
    if(index!=-1){
        const price=this.bids[index].price;
        this.bids.splice(index,1);
        return price
    }
   }
   getopenorders(userId:string){
    const asks=this.asks.filter(x=>x.userId===userId);
    const bids=this.bids.filter(x=>x.userId===userId);
    return[...asks,...bids];
   }
   
   getTicker(market:string){
    const trade=this.trades.filter((trade)=>trade.market===market)
    if(!trade){
    throw new Error("error")
    }
        if (trade.length === 0) {
            return null; 
        }
        const lastPrice = trade.length > 0 ? trade[trade.length - 1].price : 0;
    const highestBid = this.bids.length > 0 ? Math.max(...this.bids.map(bid => bid.price)) : 0;
    const lowestAsk = this.asks.length > 0 ? Math.min(...this.asks.map(ask => ask.price)) : 0;
    const now = Date.now();
    const volume24h = this.trades
        .filter(trade => now - trade.timestamp <= 24 * 60 * 60 * 1000) 
        .reduce((sum, trade) => sum + trade.quantity, 0);
        return {
            lastPrice,
            highestBid,
            lowestAsk,
            volume24h,
            market
        };
    
   }
   gettrades(market:string){
    const trade=this.trades.filter((trade)=>trade.market===market)
     if(!trade){
     throw new Error()
     }
    console.log("trade",trade);
    return trade;
   }
   getDepth(){
    const bids:[string,string][]=[];
    const asks:[string,string][]=[];
    const bidsObj:{[key:string]:number}={};
    const asklobj:{[key:string]:number}={};
    for(let i=0;i<this.bids.length;i++){
        const order=this.bids[i];
        if(!bidsObj[order.price]){
            bidsObj[order.price]=0;
        }
        bidsObj[order.price]+=order.quantity;
    }
    for(let i=0;i<this.asks.length;i++){
        const order=this.asks[i];
        if(!asklobj[order.price]){
            asklobj[order.price]=0;
        }
        asklobj[order.price]+=order.quantity;
    }
    for(const price in bidsObj){
        bids.push([price,bidsObj[price].toString()]);
    }
    for(const price in asklobj){
        asks.push([price,asklobj[price].toString()]);
    }
    return{
        bids,
        asks
    }
   }  
}