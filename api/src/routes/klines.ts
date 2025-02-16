import { Client } from 'pg';
import { Router } from 'express';

const client=new Client({
    user: 'your_user',
    host: 'localhost',
    database: 'my_database',
    password: 'your_password',  
    port: 5432,
})
try{client.connect();}
catch(e){
    console.log(e)
}
export const klinerouter = Router();
// @ts-ignore
klinerouter.get("/", async (req, res) => {
    const { interval, startTime, endTime } = req.query;

    if (!interval || !startTime || !endTime) {
        return res.status(400).send("Missing required query parameters: interval, startTime, endTime.");
    }

    let query = "";

    switch (interval) {
        case '1m':
            query = `SELECT * FROM klines_1m WHERE bucket >= $1 AND bucket <= $2`;
            break;
        case '1h':
            query = `SELECT * FROM klines_1h WHERE bucket >= $1 AND bucket <= $2`;
            break;
        case '1w':
            query = `SELECT * FROM klines_1w WHERE bucket >= $1 AND bucket <= $2`;
            break;
        default:
            return res.status(400).send("Invalid interval. Valid options are: '1m', '1h', '1w'.");
    }

    try {
        const start = new Date(Number(startTime) * 1000);
        const end = new Date(Number(endTime) * 1000);

        const result = await client.query(query, [start, end]);

        res.json(result.rows.map(x => ({
            close: x.close,
            end: x.bucket,
            high: x.high,
            low: x.low,
            open: x.open,
            quoteVolume: x.quotevolume,
            start: x.start,
            trades: x.trades,
            volume: x.volume,
        })));
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).send("Internal Server Error.");
    }
});
