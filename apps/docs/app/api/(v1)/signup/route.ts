import { NextRequest, NextResponse } from "next/server";
import "dotenv/config";
import bcrypt from "bcrypt";
import { User } from "../zod/types";
import { prismaClient } from "@repo/store/";

export async function POST(req : NextRequest){
    try{
        const body = await req.json();
        const user = User.safeParse(body);

        if(user.success === false) return NextResponse.json({message : "Invalid Semantics"},{status : 422});
        else {
            const findExsistingUser = await prismaClient.user.findFirst({
                where : {
                    email: body.email
                }
            });

            if(findExsistingUser) return NextResponse.json({message : "User Already Exsists !"},{status:409});
            else {
                const { name , email , password } = user.data;
                try{
                    const hasedPassword = await bcrypt.hash(password,Number(process.env.SALT_ROUNDS) || 10);
                    await prismaClient.user.create({
                        data : {
                            name,email,
                            password : hasedPassword
                        }
                    });

                    return NextResponse.json({
                        message : "User created Successfully !"
                    },{status:200});
                }catch(e){
                    console.error(e);
                    return NextResponse.json({
                        message : "User cannot be created !",
                    },{status:500});
                }
            }
        }
    }catch(e){
        console.error(e);
        return NextResponse.json({
            message : "Something went wrong !"
        },{status:501})
    }
}

