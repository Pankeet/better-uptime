import { getServerSession } from "next-auth";
import HomePage from "./home/page";

export default async function Home(){
  const session = await getServerSession();

  return(
    <main>
        <HomePage />
    </main>
  )
}