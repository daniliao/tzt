import { PatientRecordDTO, patientRecordDTOSchema } from "@/data/dto";
import ServerPatientRecordRepository from "@/data/server/server-patientrecord-repository";
import { ***REMOVED***orizeRequestContext, genericGET, genericPUT } from "@/lib/generic-***REMOVED***";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: Request, response: NextResponse) {
    const requestContext = await ***REMOVED***orizeRequestContext(request, response);
    const ***REMOVED***Result = await genericPUT<PatientRecordDTO>(await request.json(), patientRecordDTOSchema, new ServerPatientRecordRepository(requestContext.databaseIdHash), 'id');
    return Response.json(***REMOVED***Result, { status: ***REMOVED***Result.status });

}

export async function GET(request: NextRequest, response: NextResponse) {
    const requestContext = await ***REMOVED***orizeRequestContext(request, response);
    return Response.json(await genericGET<PatientRecordDTO>(request, new ServerPatientRecordRepository(requestContext.databaseIdHash)));
}
