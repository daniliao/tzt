import { RecordDTO, recordDTOSchema } from "@/data/dto";
import ServerRecordRepository from "@/data/server/server-record-repository";
import { ***REMOVED***orizeRequestContext, genericGET, genericPUT } from "@/lib/generic-***REMOVED***";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: Request, response: NextResponse) {
    const requestContext = await ***REMOVED***orizeRequestContext(request, response);
    const ***REMOVED***Result = await genericPUT<RecordDTO>(await request.json(), recordDTOSchema, new ServerRecordRepository(requestContext.databaseIdHash), 'id');
    return Response.json(***REMOVED***Result, { status: ***REMOVED***Result.status });

}

export async function GET(request: NextRequest, response: NextResponse) {
    const requestContext = await ***REMOVED***orizeRequestContext(request, response);
    return Response.json(await genericGET<RecordDTO>(request, new ServerRecordRepository(requestContext.databaseIdHash)));
}
