import { PatientRecordAttachmentDTO, patientRecordAttachmentDTOSchema } from "@/data/dto";
import ServerPatientRecordAttachmentRepository from "@/data/server/server-patientrecordattachment-repository";
import { genericGET, genericPUT } from "@/lib/generic-***REMOVED***";
import { StorageService } from "@/lib/storage-service";
import { getErrorMessage } from "@/lib/utils";

const storageService = new StorageService();

// Rest of the code

export async function PUT(request: Request) {
    const formData = await request.formData();

    let ***REMOVED***Result = await genericPUT<PatientRecordAttachmentDTO>(
        JSON.parse(formData.get("attachmentDTO") as string), // TODO: add validation
        patientRecordAttachmentDTOSchema,
        new ServerPatientRecordAttachmentRepository(),
        'id'
    );
    if (***REMOVED***Result.status === 200) {
        try {
            const savedAttachment: PatientRecordAttachmentDTO = ***REMOVED***Result.data as PatientRecordAttachmentDTO;
            const file = formData.get("file") as File;
            // TODO: move to a separate storage service
            storageService.saveAttachment(file, savedAttachment.storageKey);
        } catch (e) {
            console.error("Error saving attachment", e);
            ***REMOVED***Result.status = 500;
            ***REMOVED***Result.message = getErrorMessage(e);
            ***REMOVED***Result.error = e;
        }
    }
    return Response.json(***REMOVED***Result, { status: ***REMOVED***Result.status });
}

export async function GET(request: Request) {
    return Response.json(await genericGET<PatientRecordAttachmentDTO>(request, new ServerPatientRecordAttachmentRepository()));
}
