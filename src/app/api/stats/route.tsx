import { statsSchema } from "@/data/dto";
import ServerStatRepository from "@/data/server/server-stat-repository";
import { ***REMOVED***orizeRequestContext, genericGET, genericPUT } from "@/lib/generic-***REMOVED***";
import { getZedErrorMessage } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, response: NextResponse) {
    const requestContext = await ***REMOVED***orizeRequestContext(request, response);

    const statsRepo = new ServerStatRepository(requestContext.databaseIdHash, 'stats');
    const validationResult = statsSchema.safeParse(await request.json());
    if(!validationResult.success) {
        return Response.json({
            message: getZedErrorMessage(validationResult.error),
            issues: validationResult.error.issues,
            status: 400               
        })
    } else {
        const result = await statsRepo.aggregate(validationResult.data)
        return Response.json({
            message: 'Stats aggregated!',
            data: result,
            status: 200
        }, { status: 200 });
    }
}

