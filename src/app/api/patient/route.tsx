import { PatientDTO, patientDTOSchema } from "@/data/models";
import ServerPatientRepository from "@/data/server/server-patient-repository";
import { genericGET, genericPUT } from "@/lib/generic-***REMOVED***";


export async function PUT(request: Request) {
    return genericPUT<PatientDTO>(request, patientDTOSchema, new ServerPatientRepository(), 'id');
}

export async function GET(request: Request) {
    return genericGET<PatientDTO>(request, new ServerPatientRepository());
}
