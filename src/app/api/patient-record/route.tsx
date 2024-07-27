import { PatientRecordDTO, patientRecordDTOSchema } from "@/data/dto";
import ServerPatientRecordRepository from "@/data/server/server-patientrecord-repository";
import { genericGET, genericPUT } from "@/lib/generic-***REMOVED***";
import { NextRequest } from "next/server";

export async function PUT(request: Request) {
    const ***REMOVED***Result = await genericPUT<PatientRecordDTO>(await request.json(), patientRecordDTOSchema, new ServerPatientRecordRepository(), 'id');
    return Response.json(***REMOVED***Result, { status: ***REMOVED***Result.status });

}

export async function GET(request: NextRequest) {
    return Response.json(await genericGET<PatientRecordDTO>(request, new ServerPatientRecordRepository()));
}
