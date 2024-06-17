import { ConfigDTO, configDTOSchema } from "@/data/models";
import ServerConfigRepository from "@/data/server/server-config-repository";
import { genericGET, genericPUT } from "@/lib/generic-***REMOVED***";

export async function PUT(request: Request) {
    return genericPUT<ConfigDTO>(request, configDTOSchema, new ServerConfigRepository(), '***REMOVED***');
}

export async function GET(request: Request) {
    return genericGET<ConfigDTO>(request, new ServerConfigRepository());
}
