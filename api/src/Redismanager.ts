import { RedisClientType,createClient} from "redis";
import { MessageFromOrderbook } from "./types";
import { Messagetoengine } from "./types/to";
export class ReddisManager{
    private client:RedisClientType;
    private publisher:RedisClientType
    private static instance:ReddisManager;
    private constructor(){
        this.client=createClient()
            this.client.connect();
            this.publisher=createClient();
              this.publisher.connect();
    }
    public static getInstance(){
        if(!this.instance){
            this.instance=new ReddisManager();
        }
        return this.instance
    }
    public sendandwait(message:Messagetoengine){
        return new Promise<MessageFromOrderbook>((resolve)=>{
          const id=Math.random().toString()
          console.log(id);
           this.client.subscribe(id,(message)=>{
            console.log("checc");
            this.client.unsubscribe(id);
            resolve(JSON.parse(message));
           })
           console.log("check2");
           this.publisher.lPush("messages",JSON.stringify({clientId:id,message})) 
           console.log("check3");
        })
    }
}