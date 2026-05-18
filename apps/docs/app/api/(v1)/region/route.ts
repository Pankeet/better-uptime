import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/store";

export async function POST(req: NextRequest){
    const body = await req.json();
    const { region_name } = body;

    try{
        await prismaClient.region.create({
            data : {
                name: region_name
            }
        });

        return NextResponse.json({
            message: "Region added successfully !"
        },{status:200})
    }catch(e){
        console.error(e);
        return NextResponse.json({
            message: "Region cannot be added"
        },{status:500});
    }
}