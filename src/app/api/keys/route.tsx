import { KeyDTO, ***REMOVED***DTOSchema } from "@/data/dto";
import ServerConfigRepository from "@/data/server/server-config-repository";
import ServerKeyRepository from "@/data/server/server-***REMOVED***-repository";
import { ***REMOVED***orizeRequestContext, genericGET, genericPUT } from "@/lib/generic-***REMOVED***";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, response: NextResponse) {
    const requestContext = await ***REMOVED***orizeRequestContext(request, response);
    const ***REMOVED***Result = await genericPUT<KeyDTO>(await request.json(), ***REMOVED***DTOSchema, new ServerKeyRepository(requestContext.databaseIdHash), '***REMOVED***LocatorHash');
    return Response.json(***REMOVED***Result, { status: ***REMOVED***Result.status });
}

export async function GET(request: NextRequest, response: NextResponse) {
    const requestContext = await ***REMOVED***orizeRequestContext(request, response);
    return Response.json(await genericGET<KeyDTO>(request, new ServerKeyRepository(requestContext.databaseIdHash)));
}
