import { RecordDTO, recordDTOSchema } from "@/data/dto";
import ServerRecordRepository from "@/data/server/server-record-repository";
import { ***REMOVED***orizeRequestContext, ***REMOVED***orizeSaasContext, genericGET, genericPUT } from "@/lib/generic-***REMOVED***";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, response: NextResponse) {
    const requestContext = await ***REMOVED***orizeRequestContext(request, response);
    const inputObj = (await request.json())
    const ***REMOVED***Result = await genericPUT<RecordDTO>(inputObj, recordDTOSchema, new ServerRecordRepository(requestContext.databaseIdHash), 'id');
    return Response.json(***REMOVED***Result, { status: ***REMOVED***Result.status });

}

export async function GET(request: NextRequest, response: NextResponse) {
    const requestContext = await ***REMOVED***orizeRequestContext(request, response);
    return Response.json(await genericGET<RecordDTO>(request, new ServerRecordRepository(requestContext.databaseIdHash)));
}
