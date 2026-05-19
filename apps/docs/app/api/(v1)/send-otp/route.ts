import { NextRequest, NextResponse } from "next/server";
import { sendOtp } from "../lib/send-otp";
import { prismaClient } from "@repo/store";

export async function POST(req : NextRequest){
    try{
        const body = await req.json();
        const { email } = body.data;

        if(email) {
            const verify_email = /^(?!\.)(?!.*\.\.)[a-zA-Z0-9._%+-]+(?<!\.)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
            if(verify_email){
                const response = await sendOtp(email);
                if(response){
                    const otp = response.otp.toString();
                    await prismaClient.otp.upsert({
                        where:{
                            email
                        },
                        update: {
                            otp,
                            createdAt:new Date()
                        },
                        create: {
                            otp,
                            email
                        }
                    })
                    return NextResponse.json({
                        message: `Otp send to ${email}`,
                        success: true
                    },{status:200});
                }
                else{
                    return NextResponse.json({
                        message: "Cannot send Otp !",
                        success: false
                    },{status:500});
                }
            }
            else{
                return NextResponse.json({
                    message: "Please enter a valid email !",
                    success: false
                },{status:400})
            }
        }
        else return NextResponse.json({
            message: "Email not provided !",
            success: false
        },{status:400});
    }catch(err){
        console.error(err);
        return NextResponse.json({
            message: "Something went wrong !",
            success: false
        },{status:500})
    }
}