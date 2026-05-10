import { createClient } from "redis";

async function main(){
    const client = await createClient({
         "url": "redis://localhost:6379"
    })
    .on("error",(err) => console.error("Redis Client Error",err))
    .connect();

    const res = await client.xReadGroup('india','india-1',{
        key:"better-uptime:websites",
        id:'>'
    },{
        COUNT: 3
    });

    if(!res) {
        client.destroy();
        return;
    }

    //@ts-ignore
    console.log(res[0].messages);
    client.destroy();
}

main();