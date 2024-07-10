import { PatientRecordDTO, patientRecordDTOSchema } from "@/data/dto";
import ServerPatientRecordRepository from "@/data/server/server-patientrecord-repository";
import { genericGET, genericPUT } from "@/lib/generic-***REMOVED***";

export async function PUT(request: Request) {
    const ***REMOVED***Result = await genericPUT<PatientRecordDTO>(await request.json(), patientRecordDTOSchema, new ServerPatientRecordRepository(), 'id');
    if(***REMOVED***Result.status === 200) {
        // TODO: update the encrypted_attachments.assigned_to field adding this record to the list
    }
    return Response.json(***REMOVED***Result, { status: ***REMOVED***Result.status });

}

export async function GET(request: Request) {
    return Response.json(await genericGET<PatientRecordDTO>(request, new ServerPatientRecordRepository()));
}
