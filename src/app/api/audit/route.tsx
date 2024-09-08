import { AuditDTO, auditDTOSchema, KeyDTO, ***REMOVED***DTOSchema } from "@/data/dto";
import ServerAuditRepository from "@/data/server/server-audit-repository";
import { ***REMOVED***orizeRequestContext, genericGET, genericPUT } from "@/lib/generic-***REMOVED***";
import { NextRequest, NextResponse, userAgent } from "next/server";

export async function PUT(request: NextRequest, response: NextResponse) {
    const requestContext = await ***REMOVED***orizeRequestContext(request, response);
    const inputObj = (await request.json())
    const valRes = auditDTOSchema.safeParse(inputObj);
    if(!valRes.success) {
        return Response.json({ message: 'Invalid input', issues: valRes.error.issues }, { status: 400 });
    }

    const logObj = valRes.data;
    logObj.ip = request.ip;
    const { device, ua } = userAgent(request)
    logObj.ua = ua;
    logObj.databaseIdHash = requestContext.databaseIdHash
    logObj.***REMOVED***LocatorHash = requestContext.***REMOVED***LocatorHash;
    logObj.createdAt = new Date().toISOString();

    // TODO: Add audit rotation
    const ***REMOVED***Result = await genericPUT<AuditDTO>(logObj, auditDTOSchema, new ServerAuditRepository(requestContext.databaseIdHash, 'audit'), 'id');
    return Response.json(***REMOVED***Result, { status: ***REMOVED***Result.status });
}

export async function GET(request: NextRequest, response: NextResponse) {
    const requestContext = await ***REMOVED***orizeRequestContext(request, response);
    return Response.json(await genericGET<AuditDTO>(request, new ServerAuditRepository(requestContext.databaseIdHash, 'audit')));
}
