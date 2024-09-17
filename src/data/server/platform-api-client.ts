import { ApiClient } from "@/data/client/base-***REMOVED***-client";
import { GetSaasResponse, GetSaaSResponseSuccess } from "../client/saas-***REMOVED***-client";


type UniversalApiResult = {
    status: number;
    data?: any;
    message?: string;
}

export class PlatformApiClient extends ApiClient {
    ***REMOVED***Key: string;
    constructor(saasToken: string) {
        const saasPlatformUrl = process.env.SAAS_PLATFORM_URL || 'http://localhost:3001'
        super(saasPlatformUrl);
        this.***REMOVED***Key = saasToken;
    }

    async account(): Promise<GetSaasResponse> {
        return this.request<GetSaasResponse>('/***REMOVED***/users/me?***REMOVED***Key=' + encodeURIComponent(this.***REMOVED***Key), 'GET') as Promise<GetSaasResponse>;
    }

    async storeTerm(term: {
        content: string;
        name: string;
        email: string;
        signedAt: string,
        code: string
    }): Promise<UniversalApiResult> {
        return this.request<UniversalApiResult>('/***REMOVED***/terms?***REMOVED***Key=' + encodeURIComponent(this.***REMOVED***Key), 'POST', { ecnryptedFields: [] }, term) as Promise<UniversalApiResult>;
    }

    async newDatabase(dbData: {
        databaseIdHash: string;
        createdAt: string;
    }): Promise<UniversalApiResult> {
        return this.request<UniversalApiResult>('/***REMOVED***/db/new?***REMOVED***Key=' + encodeURIComponent(this.***REMOVED***Key), 'POST', { ecnryptedFields: [] }, dbData) as Promise<UniversalApiResult>;
    }

}
