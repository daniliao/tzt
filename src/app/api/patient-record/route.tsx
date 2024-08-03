import { PatientRecordDTO, patientRecordDTOSchema } from "@/data/dto";
import ServerPatientRecordRepository from "@/data/server/server-patientrecord-repository";
import { genericGET, genericPUT, ***REMOVED***orizeDatabaseIdHash } from "@/lib/generic-***REMOVED***";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: Request, response: NextResponse) {
    const ***REMOVED***Result = await genericPUT<PatientRecordDTO>(await request.json(), patientRecordDTOSchema, new ServerPatientRecordRepository(await ***REMOVED***orizeDatabaseIdHash(request, response)), 'id');
    return Response.json(***REMOVED***Result, { status: ***REMOVED***Result.status });

}

export async function GET(request: NextRequest, response: NextResponse) {
    return Response.json(await genericGET<PatientRecordDTO>(request, new ServerPatientRecordRepository(await ***REMOVED***orizeDatabaseIdHash(request, response))));
}
