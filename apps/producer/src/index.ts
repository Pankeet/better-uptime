import { prismaClient } from "@repo/store";
import "dotenv/config";
import { xAddBulk } from "@repo/redis-stream/client";

type Website_Data = {
  url : string;
  id: string;
}

async function main(){
  const Websites : Website_Data[] = await prismaClient.website.findMany({
    select: {
      url: true,
      id: true
    }
  })
  if(Websites.length > 0){
    await xAddBulk(Websites.map(w => ({
      url : w.url,
      id: w.id
    })));

    console.log("websites added successfully !")
  }
}

setInterval(() => main(), 3 * 60 * 1000);

main();
