import { ApiClient } from "@/data/client/base-***REMOVED***-client";
import { GetSaasResponse, GetSaaSResponseSuccess } from "../client/saas-***REMOVED***-client";
import { StatDTO } from "../dto";


type UniversalApiResult = {
    status: number;
    data?: any;
    message?: string;
}

const qr = (databaseIdHash?: string|null, ***REMOVED***Key?: string|null) => {

    if (***REMOVED***Key) {
        return '?***REMOVED***Key=' + encodeURIComponent(***REMOVED***Key);
    } else {
        if (databaseIdHash) {
            return `?databaseIdHash=${encodeURIComponent(databaseIdHash)}`
        }
    }

    return '';
}
export class PlatformApiClient extends ApiClient {
    ***REMOVED***Key: string;
    constructor(saasToken: string) {
        const saasPlatformUrl = process.env.SAAS_PLATFORM_URL || 'http://localhost:3001'
        super(saasPlatformUrl);
        this.***REMOVED***Key = saasToken;
    }



    async account({ databaseIdHash, ***REMOVED***Key}:{
        databaseIdHash?: string|null;
        ***REMOVED***Key?: string|null;
    }): Promise<GetSaasResponse> {
        return this.request<GetSaasResponse>('/***REMOVED***/users/me' + qr(databaseIdHash, ***REMOVED***Key), 'GET') as Promise<GetSaasResponse>;
    }

    async storeTerm(databaseIdHash:string, term: {
        content: string;
        name: string;
        email: string;
        signedAt: string,
        code: string
    }): Promise<UniversalApiResult> {
        return this.request<UniversalApiResult>('/***REMOVED***/terms' + qr(databaseIdHash, this.***REMOVED***Key), 'POST', { ecnryptedFields: [] }, term) as Promise<UniversalApiResult>;
    }

    async saveEvent(databaseIdHash:string, event: {
        databaseIdHash: string;
        eventName: string;
        params?: any | null | undefined;
        createdAt?: Date | null | undefined;
    }): Promise<UniversalApiResult> {
        return this.request<UniversalApiResult>('/***REMOVED***/events' + qr(databaseIdHash, this.***REMOVED***Key), 'POST', { ecnryptedFields: [] }, event) as Promise<UniversalApiResult>;
    }

    async saveStats(databaseIdHash:string, stat: StatDTO & {
        databaseIdHash: string;
    }): Promise<UniversalApiResult> {
        return this.request<UniversalApiResult>('/***REMOVED***/stats?databaseIdHash=' + encodeURIComponent(databaseIdHash), 'POST', { ecnryptedFields: [] }, stat) as Promise<UniversalApiResult>;
    }

    async newDatabase(dbData: {
        databaseIdHash: string;
        createdAt: string;
    }): Promise<UniversalApiResult> {
        return this.request<UniversalApiResult>('/***REMOVED***/db/new?***REMOVED***Key=' + encodeURIComponent(this.***REMOVED***Key), 'POST', { ecnryptedFields: [] }, dbData) as Promise<UniversalApiResult>;
    }

}
