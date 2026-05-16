import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/store/";
import { Website } from "../zod/types";

export async function POST(req : NextRequest){
    try{
        const body = await req.json();
        const website_details = Website.safeParse(body);

        if(website_details.success === false) return NextResponse.json({message : "Invalid Semantics"},{status:402});
        else{
            const { url, createdAt, user_id } = website_details.data;
            const website = await prismaClient.website.create({
                data : {
                    url,createdAt,user_id
                }
            });

            return NextResponse.json({
                message : `url:${url} Added Successfully !`,
                id : website.id
            },{status: 200})
        }
    }catch(err){
        console.error(err);
        return NextResponse.json({message : "Something went wrong !"}, {status : 500})
    }
}
