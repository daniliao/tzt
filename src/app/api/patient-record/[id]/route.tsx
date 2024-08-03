import ServerPatientRecordRepository from "@/data/server/server-patientrecord-repository";
import { ***REMOVED***orizeDatabaseIdHash, genericDELETE } from "@/lib/generic-***REMOVED***";

export async function DELETE(request: Request, { params }: { params: { id: number }} ) {
    const recordLocator = params.id;
    if(!recordLocator){
        return Response.json({ message: "Invalid request, no id provided within request url", status: 400 }, {status: 400});
    } else { 
        return Response.json(await genericDELETE(request, new ServerPatientRecordRepository(await ***REMOVED***orizeDatabaseIdHash(request)), { id: recordLocator}));
    }
}