import { ApiClient } from "@/data/client/base-***REMOVED***-client";
import { GetSaaSResponseSuccess } from "../client/saas-***REMOVED***-client";

export class PlatformApiClient extends ApiClient {
    ***REMOVED***Key: string;
    constructor(saasToken: string) {
        const saasPlatformUrl = process.env.SAAS_PLATFORM_URL || 'http://localhost:3001'
        super(saasPlatformUrl);
        this.***REMOVED***Key = saasToken;
    }

    async account(): Promise<GetSaaSResponseSuccess> {
        return this.request<GetSaaSResponseSuccess>('/***REMOVED***/users/me?***REMOVED***Key=' + encodeURIComponent(this.***REMOVED***Key), 'GET') as Promise<GetSaaSResponseSuccess>;
    }

}
