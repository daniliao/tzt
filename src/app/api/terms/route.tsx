import { TermDTO, termsDTOSchema } from "@/data/dto";
import ServerTermRepository from "@/data/server/server-term-repository";
import { ***REMOVED***orizeRequestContext, genericGET, genericPUT } from "@/lib/generic-***REMOVED***";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, response: NextResponse) {

    // TODO: Send the terms to SAAS management app
    const requestContext = await ***REMOVED***orizeRequestContext(request, response);
    const ***REMOVED***Result = await genericPUT<TermDTO>(await request.json(), termsDTOSchema, new ServerTermRepository(requestContext.databaseIdHash), '***REMOVED***');
    return Response.json(***REMOVED***Result, { status: ***REMOVED***Result.status });
}

export async function GET(request: NextRequest, response: NextResponse) {
    const requestContext = await ***REMOVED***orizeRequestContext(request, response);
    return Response.json(await genericGET<TermDTO>(request, new ServerTermRepository(requestContext.databaseIdHash)));
}
