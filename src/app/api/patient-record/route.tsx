import { PatientRecordDTO, patientRecordDTOSchema } from "@/data/models";
import ServerPatientRecordRepository from "@/data/server/server-patientrecord-repository";
import { genericGET, genericPUT } from "@/lib/generic-***REMOVED***";

export async function PUT(request: Request) {
    return genericPUT<PatientRecordDTO>(request, patientRecordDTOSchema, new ServerPatientRecordRepository(), 'id');
}

export async function GET(request: Request) {
    return genericGET<PatientRecordDTO>(request, new ServerPatientRecordRepository());
}
