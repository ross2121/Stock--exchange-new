import { createClient } from "redis";
import { Engine } from "./trade/Engine";

async function main() {
    const engine = new Engine();
    const redisClient = createClient();

    await redisClient.connect();
    console.log("Connected to Redis");

    while (true) { 
        const response = await redisClient.rPop("messages");

        if (!response) {
            // console.log("No new messages. Waiting...");
            await new Promise((resolve) => setTimeout(resolve, 1000)); 
            continue;
        }

        try {
            engine.setBaseBalance();
            engine.process(JSON.parse(response));
        } catch (error) {
            console.error("Error processing message:", error);
        }
    }
}

main().catch(console.error);
