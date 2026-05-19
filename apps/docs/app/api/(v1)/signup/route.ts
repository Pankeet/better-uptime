import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { User } from "../zod/types";
import { prismaClient } from "@repo/store";

export async function POST(req : NextRequest){
    try{
        const body = await req.json();
        const user = User.safeParse(body);

        if(user.success === false) return NextResponse.json({message : "Invalid Semantics"},{status : 422});
        else {
            const findExistingUser = await prismaClient.user.findFirst({
                where : {
                    email: body.email
                }
            });

            if(findExistingUser) return NextResponse.json({message : "User Already Exists !"},{status:409});
            else {
                const { firstname, lastname , email , password } = user.data;
                try{
                    const hasedPassword = await bcrypt.hash(password,Number(process.env.SALT_ROUNDS) || 10);
                    await prismaClient.user.create({
                        data : {
                            name : firstname + " " + lastname,
                            email,
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
        },{status:500})
    }
}

export async function GET(req:NextRequest){
    const email = req.nextUrl.searchParams.get("email");
    const otp = req.nextUrl.searchParams.get("otp");

    if(!email || !otp) {
        return NextResponse.json({
            message: "Email/Otp not found !"
        },{status:400})
    }
    try{
        const verifyOtp = await prismaClient.otp.findUnique({
            where:{
                email
            }
        });

        if(verifyOtp?.otp === otp) return NextResponse.json({
            message: "Otp verified!",
            success: true
        },{status:200});
        else return NextResponse.json({
            message: "Invalid Otp",
            success:false
        },{status:400});
    }catch(err){
        console.error(err);
        return NextResponse.json({
            message:"Otp could not be verified !"
        },{status:500})
    }
}

