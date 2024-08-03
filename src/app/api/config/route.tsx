import { ConfigDTO, configDTOSchema } from "@/data/dto";
import ServerConfigRepository from "@/data/server/server-config-repository";
import { genericDELETE, genericGET, genericPUT, getDatabaseIdHash } from "@/lib/generic-***REMOVED***";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
    const ***REMOVED***Result = await genericPUT<ConfigDTO>(await request.json(), configDTOSchema, new ServerConfigRepository(getDatabaseIdHash(request)), '***REMOVED***');
    return Response.json(***REMOVED***Result, { status: ***REMOVED***Result.status });
}

export async function GET(request: NextRequest) {
    return Response.json(await genericGET<ConfigDTO>(request, new ServerConfigRepository(getDatabaseIdHash(request))));
}

// clear all configuration
export async function DELETE(request: NextRequest) {
    const allConfigs = await genericGET<ConfigDTO>(request, new ServerConfigRepository(getDatabaseIdHash(request)));
    if(allConfigs.length <= 1){
        return Response.json({ message: "Cannot delete the last configuration", status: 400 }, {status: 400});
    } else {
        const deleteResults = [];
        for(const config of allConfigs){
            deleteResults.push(await genericDELETE(request, new ServerConfigRepository(getDatabaseIdHash(request)), { ***REMOVED***: config.***REMOVED***}));
        }
        return Response.json({ message: 'Configuration cleared!', data: deleteResults, status: 200 }, { status: 200 });
    }
}