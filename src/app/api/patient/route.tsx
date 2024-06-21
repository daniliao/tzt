import { PatientDTO, patientDTOSchema } from "@/data/dto";
import ServerPatientRepository from "@/data/server/server-patient-repository";
import { genericGET, genericPUT } from "@/lib/generic-***REMOVED***";


export async function PUT(request: Request) {
    const ***REMOVED***Result = await genericPUT<PatientDTO>(await request.json(), patientDTOSchema, new ServerPatientRepository(), 'id');
    return Response.json(***REMOVED***Result, { status: ***REMOVED***Result.status });

}

export async function GET(request: Request) {
    return Response.json(await genericGET<PatientDTO>(request, new ServerPatientRepository()));
}
