import { getServerSession } from "next-auth";

export default async function Home(){
  const session = await getServerSession();

  return(
    <main className="flex h-screen w-full text-6xl justify-center items-center">
        Under Development !
    </main>
  )
}