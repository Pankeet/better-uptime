import "dotenv/config";
import { xReadGroup, xAckBulk } from "@repo/redis-stream/client";
import axios from "axios";
import { prismaClient } from "@repo/store";
type Website_Data = {
  url : string;
  id: string;
}

const REGION_ID = process.env.REGION_ID!;
const WORKER_ID = process.env.WORKER_ID!;

if(!REGION_ID || !WORKER_ID) throw new Error("envs not provided !");

async function fetchWebsite(url : string, websiteId : string){
    return new Promise<void>((resolve,reject) =>{
        const start_time = Date.now();
        axios.get(url)
            .then(async () => {
                const end_time = Date.now();
                await prismaClient.websiteTick.create({
                    data: {
                        response_time_ms: end_time - start_time,
                        status: "Up",
                        region_id: REGION_ID,
                        website_id: websiteId
                    }
                })
                resolve();
        })
        .catch(async () => {
            const end_time = Date.now();
            await prismaClient.websiteTick.create({
                data: {
                    response_time_ms: end_time - start_time,
                    status: "Down",
                    region_id: REGION_ID,
                    website_id: websiteId
                }
            })
            resolve();
        })
    })
}

async function main(){
    // Add a bulk DB upload as it could overwhelm db under heavy traffic
    while(true){
        try{
            const res = await xReadGroup(REGION_ID,WORKER_ID);
            if(!res) {
                continue;
            }
            let promises = res.map(({message} : {message : {url:string,id:string}}) => fetchWebsite(message.url,message.id));
            await Promise.all(promises);
            console.log(promises.length);
      
            xAckBulk(REGION_ID, res.map(({id} : any) => id))
        }catch(err){
            console.error(err);
        }
    }
}

main();