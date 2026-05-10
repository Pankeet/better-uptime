import { createClient } from "redis";

async function main(){
const client = await createClient({
    "url":"redis://localhost:6379"
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

  const res = await client.xAdd('better-uptime:websites','*',{
    url: "google.com",
    id: "1"
  })
  console.log(res);
  client.destroy();
}

main();
