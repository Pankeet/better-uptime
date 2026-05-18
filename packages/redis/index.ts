import { createClient } from "redis";

type WebsiteEvent = {
    url : string,
    id: string
}

const client = createClient(); 

client.on("error", (err) => {
    console.log("Redis Client Error", err);
});

const connectRedis = client.connect();

async function xAdd({url,id}: WebsiteEvent){
    await connectRedis;
    await client.xAdd(
        "better-uptime:websites","*" ,{
            url,id
        }
    )
}

export async function xAddBulk(websites: WebsiteEvent[]){
    await connectRedis;
    for(const website of websites){
        await xAdd(website);
    }
}