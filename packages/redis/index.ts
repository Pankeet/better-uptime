import { createClient } from "redis";

type WebsiteEvent = {
    url : string,
    id: string
}

type MessageType = {
    id: string,
    message: {
        url:string,
        id: string
    }
}
const Stream_key = "better-uptime:websites";

const client = createClient(); 

client.on("error", (err) => {
    console.log("Redis Client Error", err);
});

const connectRedis = client.connect();

async function xAdd({url,id}: WebsiteEvent){
    await connectRedis;
    await client.xAdd(
        Stream_key,"*" ,{
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

export async function xReadGroup(consumer_group : string, workerId : string): Promise<any>{
    try{
        await connectRedis;
        const res = await client.xReadGroup(
            consumer_group,
            workerId,{
                key: Stream_key,
                id: '>'
            },{
                'COUNT': 5
            }
        );

        if(res == null) return;
        let messages : {
            id: string,
            message: {
                url:string,
                id: string
            }
            //@ts-ignore
        }[] | undefined = res[0]?.messages;

        return messages;
    }catch(err){
        console.error(err);
    }
}

export async function xAck(consumer_group: string, Stream_id: string ){
    try{
        await connectRedis;
        await client.xAck(Stream_key, consumer_group, Stream_id);
    }catch(err){
        console.error(err);
    }
}

export async function xAckBulk(consumer_group: string, Stream_id: string[]){
    Stream_id.forEach(eventId => xAck(consumer_group,eventId));
}