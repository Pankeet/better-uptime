import NextAuth from "next-auth";
import "dotenv/config";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prismaClient } from "@repo/store/client";
import bcrypt from "bcrypt";

if(typeof process.env.GOOGLE_ID != "string" || typeof process.env.GOOGLE_SECRET != "string"){
    throw new TypeError("Client Id and Secret not found !")
}

const handler = NextAuth({
    providers : [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email:{label:"Email", type: "email" , placeholder:"royjson@gmail.com"},
                password:{label:"Password", type: "password"},
            },

            async authorize(credentials){
                if(!credentials?.email || !credentials?.password) return null;

                const email = credentials.email;
                const password = credentials.password;

                const user = await prismaClient.user.findUnique({
                    where : {email}
                });
                
                if(user) {
                    const verifyPassword = await bcrypt.compare(password,user.password || "");
                    if(verifyPassword) return user;
                    else return null;
                }
                else return null;
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        })
    ],
    callbacks: {   
        async signIn({user, account}){
            if(account?.provider === "google"){
                await prismaClient.user.upsert({
                    where: {email : user.email!},
                    update:{name : user.name!, avatar: user.image},
                    create: {
                        email : user.email!,
                        name: user.name!,
                        avatar : user.image
                    }
                });
            }
            return true;
        },
        async jwt({token,user}){
            if(user){
                token.id = user.id;
            }
            return token;
        },
        async session({session,token}){
            if(session.user){
                session.user.id = token.id;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET , handler as POST};