import { NextRequest, NextResponse } from "next/server";
import "dotenv/config";
import { prismaClient } from "@repo/store/client";
import { getToken } from "next-auth/jwt";

export async function GET(req : NextRequest, {params} : {params : Promise<{websiteId : string}>} ): Promise<NextResponse> {
    const { websiteId } = await params;
    try{
        const token = await getToken({req,secret: process.env.NEXTAUTH_SECRET});
        if(token) {
            const website = await prismaClient.website.findFirst({
                where: {
                    user_id: token.id,
                    id: websiteId
                },
                include:{
                    ticks:{
                        take:1,
                        orderBy: [{
                            createdAt: "desc"
                        }]
                    }
                }
            })
            if(website) return NextResponse.json({url: website.url,id:website.id},{status:200});
            else return NextResponse.json({message: "Cannot get website"},{status:411});
        }
        else{
            return NextResponse.json({
                message : "Invalid User !"
            },{status:402})
        }
    }catch(e){
        console.error(e);
        return NextResponse.json({
            message : "Something went Wrong !"
        },{status:500})
    }
}