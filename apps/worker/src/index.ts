import axios from "axios";
import { createClient } from "redis";
import { prismaClient } from "@repo/store";

type Website_Data = {
  url : string;
  id: string;
}


async function main(){

    while(true){
        try{
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
                return;
            }

            // @ts-ignore
            const websiteToTrack = res[0].messages;

            websiteToTrack.map((website:Website_Data) => {
                let startTime = Date.now();
                axios.get(website.url).then(() => {
                    prismaClient.websiteTick.create({
                        data : {
                            status: "Up",
                            response_time_ms: Date.now() - startTime,
                            region_id: "india",
                            website_id: website.id
                        }
                    })
                }).catch(() => {

                })
            });
        }catch(err){
            console.error("Loop Error:", err);
        }
    }
}
main();