import { ConfigDTO, configDTOSchema } from "@/data/dto";
import ServerConfigRepository from "@/data/server/server-config-repository";
import { genericGET, genericPUT } from "@/lib/generic-***REMOVED***";

export async function PUT(request: Request) {
    const ***REMOVED***Result = await genericPUT<ConfigDTO>(await request.json(), configDTOSchema, new ServerConfigRepository(), '***REMOVED***');
    return Response.json(***REMOVED***Result, { status: ***REMOVED***Result.status });
}

export async function GET(request: Request) {
    return Response.json(await genericGET<ConfigDTO>(request, new ServerConfigRepository()));
}
