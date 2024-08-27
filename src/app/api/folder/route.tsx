import { FolderDTO, folderDTOSchema } from "@/data/dto";
import ServerFolderRepository from "@/data/server/server-folder-repository";
import { genericGET, genericPUT, genericDELETE, ***REMOVED***orizeRequestContext } from "@/lib/generic-***REMOVED***";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(request: NextRequest, response: NextResponse) {
    const requestContext = await ***REMOVED***orizeRequestContext(request, response);
    const ***REMOVED***Result = await genericPUT<FolderDTO>(await request.json(), folderDTOSchema, new ServerFolderRepository(requestContext.databaseIdHash), 'id');
    return Response.json(***REMOVED***Result, { status: ***REMOVED***Result.status });

}

// return all folders
export async function GET(request: NextRequest, response: NextResponse) {
    const requestContext = await ***REMOVED***orizeRequestContext(request, response);
    return Response.json(await genericGET<FolderDTO>(request, new ServerFolderRepository(requestContext.databaseIdHash)));
}

// clear all folders
export async function DELETE(request: NextRequest, response: NextResponse) {
    const requestContext = await ***REMOVED***orizeRequestContext(request, response);
    const allFolders = await genericGET<FolderDTO>(request, new ServerFolderRepository(requestContext.databaseIdHash));
    if(allFolders.length <= 1){
        return Response.json({ message: "Cannot delete folders", status: 400 }, {status: 400});
    } else {
        const deleteResults = [];
        for(const folder of allFolders){
            deleteResults.push(await genericDELETE(request, new ServerFolderRepository(requestContext.databaseIdHash), { id: folder.id as number}));
        }
        return Response.json({ message: 'Folders cleared!', data: deleteResults, status: 200 }, { status: 200 });
    }
}