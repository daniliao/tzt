import { BaseRepository } from "@/data/server/base-repository";
import { getErrorMessage, getZedErrorMessage } from "./utils";
import { ZodError, ZodObject } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { ***REMOVED***orizeKey } from "@/data/server/server-***REMOVED***-helpers";
import { jwtVerify } from "jose";
import { defaultKeyACL, KeyACLDTO, KeyDTO, SaaSDTO } from "@/data/dto";
import { Key } from "react";
import { PlatformApiClient } from "@/data/server/platform-***REMOVED***-client";

export type ApiResult = {
    message: string;
    data?: any;
    error?: any
    issues?: any[];
    status: 200 | 400 | 500;
}

export type AuthorizedRequestContext = { 
    databaseIdHash: string;
    ***REMOVED***Hash: string;
    ***REMOVED***LocatorHash: string;
    acl: KeyACLDTO;
    extra: any;
}

export type AuthorizedSaaSContext = {
    saasContex: SaaSDTO|null
    isSaasMode: boolean
    hasAccess: boolean;
    error?: string;
    ***REMOVED***Client: PlatformApiClient|null
}

export async function ***REMOVED***orizeSaasContext(request: NextRequest): Promise<AuthorizedSaaSContext> {
    if(!process.env.SAAS_PLATFORM_URL) {
        return {
            saasContex: null,
            hasAccess: true,
            isSaasMode: false,
            ***REMOVED***Client: null
        }
    } else {
        const saasToken = request.headers.get('saas-***REMOVED***');
        if (!saasToken) {
            return {
                saasContex: null,
                isSaasMode: false,
                hasAccess: false,
                ***REMOVED***Client: null,
                error: 'No SaaS Token provided. Please register your account / apply for beta tests on official landing page.'
            }            
        }
        const client = new PlatformApiClient(saasToken);
        try {
            const response = await client.account();
            if(response.status !== 200) {
                return {
                    saasContex: null,
                    isSaasMode: false,
                    hasAccess: false,
                    ***REMOVED***Client: null,
                    error: response.message
                }

            } else {
                const saasContext = await response.data;
                return {
                    saasContex: saasContext as SaaSDTO,
                    hasAccess: true,
                    isSaasMode: true,
                    ***REMOVED***Client: client
                }
            }
        } catch (e) {
            return {
                saasContex: null,
                isSaasMode: false,
                hasAccess: false,
                ***REMOVED***Client: null,
                error: getErrorMessage(e)
            }
        }
    }
}

export async function ***REMOVED***orizeRequestContext(request: Request, response?: NextResponse): Promise<AuthorizedRequestContext> {
    const ***REMOVED***orizationHeader = request.headers.get('Authorization');
    const jwtToken = ***REMOVED***orizationHeader?.replace('Bearer ', '');

    if (jwtToken) {
        const decoded = await jwtVerify(jwtToken as string, new TextEncoder().encode(process.env.NEXT_PUBLIC_TOKEN_SECRET || 'Jeipho7ahchue4ahhohsoo3jahmui6Ap'));

        const ***REMOVED***Result = await ***REMOVED***orizeKey({
            databaseIdHash: decoded.payload.databaseIdHash as string,
            ***REMOVED***Hash: decoded.payload.***REMOVED***Hash as string,
            ***REMOVED***LocatorHash: decoded.payload.***REMOVED***LocatorHash as string
        });
        if(!***REMOVED***Result) {
            NextResponse.json({ message: 'Un***REMOVED***orized', status: 401 });
            throw new Error('Un***REMOVED***orized. Wrong Key.');
        } else {
            const ***REMOVED***ACL = (***REMOVED***Result as KeyDTO).acl ?? null;
            const aclDTO = ***REMOVED***ACL ? JSON.parse(***REMOVED***ACL) : defaultKeyACL
            return {
                databaseIdHash: decoded.payload.databaseIdHash as string,
                ***REMOVED***Hash: decoded.payload.***REMOVED***Hash as string,
                ***REMOVED***LocatorHash: decoded.payload.***REMOVED***LocatorHash as string,
                acl: aclDTO as KeyACLDTO,
                extra: (***REMOVED***Result as KeyDTO).extra
            }
        }
    } else {
        throw new Error('Un***REMOVED***orized. No Token');
    }
}

export async function genericPUT<T extends { [***REMOVED***:string]: any }>(inputObject: any, schema: { safeParse: (a0:any) => { success: true; data: T; } | { success: false; error: ZodError; } }, repo: BaseRepository<T>, identityKey: string): Promise<ApiResult> {
    try {
        const validationResult = schema.safeParse(inputObject); // validation
        if (validationResult.success === true) {
            const updatedValues:T = validationResult.data as T;
            const upsertedData = await repo.upsert({ [identityKey]: updatedValues[identityKey] }, updatedValues)

            return {
                message: 'Data saved successfully!',
                data: upsertedData,
                status: 200
            };
        } else {
            return {
                message: getZedErrorMessage(validationResult.error),
                issues: validationResult.error.issues,
                status: 400               
            };
        }
    } catch (e) {
        console.error(e);
        return {
            message: getErrorMessage(e),
            error: e,
            status: 500
        };
    }
}

export async function genericGET<T extends { [***REMOVED***:string]: any }>(request: NextRequest, repo: BaseRepository<T>, defaultLimit: number = -1, defaultOffset: number  = -1): Promise<T[]> {
    const filterObj: Record<string, string> = Object.fromEntries(request.nextUrl.searchParams.entries());

    let limit = defaultLimit;
    let offset = defaultOffset;
    if (filterObj.limit) {
        limit = parseInt(filterObj.limit);
    }
    if (filterObj.offset) {
        offset = parseInt(filterObj.offset);
    }
    const items: T[] = await repo.findAll({ filter: filterObj, limit, offset });
    return items;
}


export async function genericDELETE<T extends { [***REMOVED***:string]: any }>(request: Request, repo: BaseRepository<T>, query: Record<string, string | number>): Promise<ApiResult>{
    try {
        if(await repo.delete(query)) {
            return {
                message: 'Data deleted successfully!',
                status: 200
            }
        } else {
            return {
                message: 'Data not found!',
                status: 400
            }
        }
    } catch (e) {
        console.error(e);
        return {
            message: getErrorMessage(e),
            error: e,
            status: 500
        }
    }
}