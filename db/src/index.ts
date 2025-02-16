import { Client,Pool } from 'pg';
import { createClient } from 'redis';  
import { DbMessage } from './types';
import {neon} from "@neondatabase/serverless"

// const client = new Client({
//    host:"ep-aged-wind-a85x44xf-pooler.eastus2.azure.neon.tech",
//    user:"neondb_owner",
//    database:"neondb",
//    password:"npg_AdOR3TgVMDK0"
// });
const client=new Client({
    user: 'your_user',
    host: 'localhost',
    database: 'my_database',
    password: 'your_password',  
    port: 5432,
})
// client.connect();

async function main() {
    try{
        await client.connect();
        console.log("connected to database")
    }
    catch(error){
        console.log(error);
    }
    const redisClient = createClient();
    await redisClient.connect();
    console.log("connected to redis");

    while (true) {
        const response = await redisClient.rPop("db_processor" as string)
        if (!response) {

        }  else {
            const data: DbMessage = JSON.parse(response);
            if (data.type === "TRADE_ADDED") {
                console.log("adding data");
                console.log(data);
                const price = data.data.price;
                const timestamp = new Date(data.data.timestamp);
                const query = 'INSERT INTO tata_prices (time, price) VALUES ($1, $2)';
                const values = [timestamp, price];
                await client.query(query, values);
            }
        }
    }

}

main();