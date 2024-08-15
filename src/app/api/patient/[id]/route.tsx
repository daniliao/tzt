import ServerPatientRepository from "@/data/server/server-patient-repository";
import ServerPatientRecordRepository from "@/data/server/server-patientrecord-repository";
import { ***REMOVED***orizeRequestContext, genericDELETE } from "@/lib/generic-***REMOVED***";

export async function DELETE(request: Request, { params }: { params: { id: number }} ) {
    const requestContext = await ***REMOVED***orizeRequestContext(request);
    const recordLocator = params.id;
    const prRepo = new ServerPatientRecordRepository(requestContext.databaseIdHash);
    const records = await prRepo.findAll( { filter: { patientId: recordLocator } });
    if (records.length > 0) {
        return Response.json({ message: "Cannot delete patient, patient has records. Remove them first", status: 400 }, {status: 400});
    }

    if(!recordLocator){
        return Response.json({ message: "Invalid request, no id provided within request url", status: 400 }, {status: 400});
    } else { 
        return Response.json(await genericDELETE(request, new ServerPatientRepository(requestContext.databaseIdHash), { id: recordLocator}));
    }
}