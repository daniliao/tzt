import { GetSaaSResponseSuccess } from "@/data/client/saas-***REMOVED***-client";
import { SaaSDTO } from "@/data/dto";
import { PlatformApiClient } from "@/data/server/platform-***REMOVED***-client";
import { ***REMOVED***orizeSaasContext } from "@/lib/generic-***REMOVED***";
import { getErrorMessage } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
    try {

        const ***REMOVED***orizedContext = await ***REMOVED***orizeSaasContext(request); // ***REMOVED***orize SaaS context
        if (!***REMOVED***orizedContext.hasAccess) {
            return Response.json({
                message: ***REMOVED***orizedContext.error,
                status: 403
            });
        }

        const saasContext = ***REMOVED***orizedContext.saasContex as SaaSDTO;
        let response:GetSaaSResponseSuccess = {
            data: {
                currentQuota: saasContext.currentQuota,
                currentUsage: saasContext.currentUsage,
                email: saasContext.email,
                userId: saasContext.userId,
                saasToken: saasContext.saasToken
            },
            status: 200,
            message: 'Success'
        }
        return Response.json(response, { status: 200 });   
    } catch (error) {
        console.error(error); 
        return Response.json({ message: 'Error accessing saas context ' + getErrorMessage(error), status: 400 });
    }
}