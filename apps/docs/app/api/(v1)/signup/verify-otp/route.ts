import { prismaClient } from "@repo/store";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){

    try{
        const body = await req.json();
        console.log(body);
        const { email, otp } = body.data_verify;
        console.log(otp);
        console.log(email);

        if(!email || !otp) {
            return NextResponse.json({
                message: "Email/Otp not found !"
            },{status:400})
        }
        
        const verifyOtp = await prismaClient.otp.findUnique({
            where:{
                email
            }
        });
        
        if(!verifyOtp){
            return NextResponse.json(
                {
                    message:"Otp not found!",
                    success:false
                },{status:404});
        }

        console.log({
            dbOtp: verifyOtp.otp,
            receivedOtp: otp,
            dbType: typeof verifyOtp.otp,
            reqType: typeof otp
        });
        const hasExpired = Date.now() - verifyOtp.createdAt.getTime();
        const fiveMinutes = 5 * 60 * 1000;

        if(hasExpired > fiveMinutes){
            try{
                await prismaClient.otp.delete({
                    where:{
                        email
                    }
                })
                return NextResponse.json({
                    message: "Otp has Expired !",
                    success: false
                },{status:410});
            }catch(e){
                console.log(`Delete OTP with id ${verifyOtp.id} has failed`,e,);
                return NextResponse.json({
                    message: "Otp expired ! Please try again later"
                },{status:500});
            }
        }
        if(verifyOtp.otp !== (otp)){
            return NextResponse.json({
                message : "Please enter a valid OTP !",
                success: false
            },{status:400});
        }
        try{
            await prismaClient.otp.delete({
                where: {
                    email
                    }
                });
            return NextResponse.json({
                message: "Otp verified!",
                success: true
            },{status:200});
        }catch(err){
            console.log(err);
            return NextResponse.json({
                message: "OTP could not be verified !",
                success: false
            },{status:500});
        }
    }catch(err){
        console.error(err);
        return NextResponse.json({
            message: "OTP verification failed !",
            success: false
        },{status:500});
    }
}