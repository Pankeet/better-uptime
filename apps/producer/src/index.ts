import { createClient } from "redis";
import { prismaClient } from "@repo/store/";

type Website_Data = {
  url : string;
  id: string;
}

async function main(){
const client = await createClient({
    "url":"redis://localhost:6379"
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

  const AllWebsites : Website_Data[] = await prismaClient.website.findMany();
  if(AllWebsites){
    for(const website of AllWebsites){
      try{
        await client.xAdd('better-uptime:websites','*',{
          url : website.url,
          id: website.id
        })
      }catch(err){
        console.error(`Failed to add website ${website.id} to Redis`, err);
      }
    }
  }
}

setInterval(() => main(), 3 * 60 * 1000);
