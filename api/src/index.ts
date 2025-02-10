import express from "express";
import cors from "cors"
import { orderrouter } from "./routes/order";
import { depthrouter } from "./routes/depth";
import { createClient} from "redis";
// import { tradesRouter } from "./routes/trades";
// import { tradesRouter } from "./routes/trades";

// import { tickerRouter } from "./routes/ticker";
const app=express();
try{
const client=createClient();
client.connect();
console.log("connected to reddis");
}catch(e){
    console.log(e);
}
app.use(cors());
app.use(express.json());
app.use("/api/v1/order",orderrouter);
app.use("/api/v1/depth",depthrouter)
// app.use("/api/v1/trades",tradesRouter);
// // app.use("/api/v1/klines",klinerouter);
// app.use("/api/v1/tickers",tickerRouter);
app.listen(3000,()=>{
    console.log("Server is running at 3000");
})