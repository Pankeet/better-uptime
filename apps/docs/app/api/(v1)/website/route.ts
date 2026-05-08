import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/store/client";

export async function POST(req : NextRequest){
    try{
        const body = await req.json();
        const { url , timeAdded } = body;

        prismaClient.website.create({
            data : {
                url,timeAdded
            }
        });
        return NextResponse.json({
            message : `url:${url} Added Successfully !`
        },{status: 200})
    }catch(err){
        console.error(err);

        return NextResponse.json({message : "Something went wrong !"}, {status : 500})
    }
}

export function GET(){
    return NextResponse.json({
        message : "Server running !"
    })
}