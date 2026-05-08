import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/store/client";

export async function POST(req : NextRequest){
    try{
        const body = await req.json();
        const { url, createdAt, user_id } = body;

        const website = await prismaClient.website.create({
            data : {
                url,createdAt,user_id
            }
        });
        return NextResponse.json({
            message : `url:${url} Added Successfully !`,
            id : website.id
        },{status: 200})
    }catch(err){
        console.error(err);
        return NextResponse.json({message : "Something went wrong !"}, {status : 500})
    }
}
