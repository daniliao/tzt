import { EncryptedAttachmentDTO, EncryptedAttachmentDTOSchema } from "@/data/dto";
import ServerEncryptedAttachmentRepository from "@/data/server/server-encryptedattachment-repository";
import { authorizeRequestContext, genericGET, genericPUT } from "@/lib/generic-api";
import { StorageService } from "@/lib/storage-service";
import { getErrorMessage } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, response: NextResponse) {
    if (request.headers.get("Content-Type") === "application/json") {
        const inputJson = await request.json();
        return await handlePUTRequest(inputJson, request, response);
    } else {
        const formData = await request.formData();
        return await handlePUTRequest(JSON.parse(formData.get("attachmentDTO") as string), request, response, formData.get("file") as File);
    }
}

async function handlePUTRequest(inputJson: any, request: NextRequest, response: NextResponse, file?: File) {
    const requestContext = await authorizeRequestContext(request, response);

    const storageService = new StorageService(requestContext.databaseIdHash);
    let apiResult = await genericPUT<EncryptedAttachmentDTO>(
        inputJson,
        EncryptedAttachmentDTOSchema,
        new ServerEncryptedAttachmentRepository(requestContext.databaseIdHash),
        'id'
    );

    if (apiResult.status === 200 && file) { // validation went OK, now we can store the file
        try {
            const savedAttachment: EncryptedAttachmentDTO = apiResult.data as EncryptedAttachmentDTO;
            
            // Validate file size and type
            if (file.size > 100 * 1024 * 1024) { // 100MB limit
                throw new Error("File size exceeds 100MB limit");
            }

            // Save file to Azure Blob storage
            await storageService.saveAttachment(file, savedAttachment.storageKey);

            // Update metadata in the database
            const repo = new ServerEncryptedAttachmentRepository(requestContext.databaseIdHash);
            await repo.upsert({ id: savedAttachment.id }, {
                ...savedAttachment,
                mimeType: file.type,
                displayName: file.name
            });

        } catch (e) {
            console.error("Error saving attachment to Azure Blob storage:", e);
            apiResult.status = 500;
            apiResult.message = getErrorMessage(e);
            apiResult.error = e;
        }
    }
    return Response.json(apiResult, { status: apiResult.status });
}

export async function GET(request: NextRequest, response: NextResponse) {
    const requestContext = await authorizeRequestContext(request, response);
    return Response.json(await genericGET<EncryptedAttachmentDTO>(request, new ServerEncryptedAttachmentRepository(requestContext.databaseIdHash)));
}
