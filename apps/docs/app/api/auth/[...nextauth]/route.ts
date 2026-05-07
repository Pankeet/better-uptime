import NextAuth from "next-auth";
import "dotenv/config";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

if(typeof process.env.GOOGLE_ID != "string" || typeof process.env.GOOGLE_SECRET != "string"){
    throw new TypeError("Client Id and Secret not found !");
}

const handler = NextAuth({
    providers : [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                firstname : { label : "First Name", type : "text" , placeholder: "Json"},
                lastname:{label:"Last Name", type: "text" , placeholder:"Roy"},
                email:{label:"Email", type: "email" , placeholder:"royjson@gmail.com"},
                password:{label:"Password", type: "password"},
            },

            async authorize(credentials,req){
                const firstname = credentials?.firstname;
                const lastname = credentials?.lastname;
                const email = credentials?.email;
                const password = credentials?.password;

                const user = {
                    id: "1",
                    firstname,lastname,email,password
                }
                
                if(user) return user;
                else return null;
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        })
    ],
    secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET , handler as POST};