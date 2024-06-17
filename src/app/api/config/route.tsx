import { ConfigDTO, configDTOSchema } from "@/db/models";
import ServerConfigRepository from "@/db/server/server-config-repository";
import { genericGET, genericPUT } from "@/lib/generic-***REMOVED***";

export async function PUT(request: Request) {
    return genericPUT<ConfigDTO>(request, configDTOSchema, new ServerConfigRepository(), '***REMOVED***');
}

export async function GET(request: Request) {
    return genericGET<ConfigDTO>(request, new ServerConfigRepository());
}
