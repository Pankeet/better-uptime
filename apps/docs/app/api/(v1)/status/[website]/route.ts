import { NextRequest, NextResponse } from "next/server";
import "dotenv/config";
import { prismaClient } from "@repo/store";
import { getToken } from "next-auth/jwt";

export async function GET(req : NextRequest, {params} : {params : Promise<{website : string}>} ): Promise<NextResponse> {
    const { website } = await params;
    try{
        const token = await getToken({req,secret: process.env.NEXTAUTH_SECRET});
        if(token) {
            const website_deatils = await prismaClient.website.findFirst({
                where: {
                    user_id: token.id,
                    id: website
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
            if(website_deatils) return NextResponse.json({url: website_deatils.url,id:website_deatils.id},{status:200});
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