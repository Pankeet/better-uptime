import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/store";

export async function GET(req : NextRequest){
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
        return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
        );
    }

    try{
        const user = await prismaClient.user.findUnique({
            where: {
                email
            }
        });

        if(user){
            return NextResponse.json(user, {status:200});
        }
        else{
            return NextResponse.json({
                message : "User not found !"
            },{status:404})
        }
    } catch(e){
        console.error("Error :- ",e);
        return NextResponse.json({
            message: "Cannot fetch user details"
        },{status:500})
    }
}