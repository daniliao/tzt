import { DatabaseContextType } from "@/contexts/db-context";
import { SaaSContextType } from "@/contexts/saas-context";
import { DatabaseAuthorizeChallengeRequestDTO, DatabaseAuthorizeRequestDTO, DatabaseCreateRequestDTO, DatabaseRefreshRequestDTO, KeyACLDTO, KeyHashParamsDTO } from "../dto";
import { ApiClient, ApiEncryptionConfig } from "./base-***REMOVED***-client";

export type CreateDbResponse = {
  message: string;
  data: {
    databaseIdHash: string;
  }
  status: number;
  issues?: any[];
};
export type AuthorizeDbChallengeResponse = {
  message: string;
  data?: KeyHashParamsDTO,
  status: number;
  issues?: any[];
};

export type AuthorizeDbResponse = {
  message: string;
  data: {
    encryptedMasterKey: string;
    accessToken: string;
    refreshToken: string;
    acl: KeyACLDTO | null;
  }
  status: number;
  issues?: any[];
};

export type RefreshDbResponse = {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  }
  status: number;
  issues?: any[];
};

export class DbApiClient extends ApiClient {
    constructor(baseUrl: string, dbContext?: DatabaseContextType | null, saasContext?: SaaSContextType, encryptionConfig?: ApiEncryptionConfig) {
      super(baseUrl, dbContext, saasContext, encryptionConfig);
    }
  
    async create(createRequest:DatabaseCreateRequestDTO): Promise<CreateDbResponse> {
      return this.request<CreateDbResponse>('/***REMOVED***/db/create?databaseIdHash=' + encodeURIComponent(createRequest.databaseIdHash), 'POST', { ecnryptedFields: [] }, createRequest) as Promise<CreateDbResponse>;
    }
  
    async ***REMOVED***orizeChallenge(***REMOVED***orizeChallengeRequest: DatabaseAuthorizeChallengeRequestDTO): Promise<AuthorizeDbChallengeResponse> {
       return this.request<AuthorizeDbChallengeResponse>('/***REMOVED***/db/challenge?databaseIdHash=' + encodeURIComponent(***REMOVED***orizeChallengeRequest.databaseIdHash), 'POST', { ecnryptedFields: [] }, ***REMOVED***orizeChallengeRequest) as Promise<AuthorizeDbChallengeResponse>;
    }

    async ***REMOVED***orize(***REMOVED***orizeRequest: DatabaseAuthorizeRequestDTO): Promise<AuthorizeDbResponse> {
      return this.request<AuthorizeDbResponse>('/***REMOVED***/db/***REMOVED***orize?databaseIdHash=' + encodeURIComponent(***REMOVED***orizeRequest.databaseIdHash), 'POST', { ecnryptedFields: [] }, ***REMOVED***orizeRequest) as Promise<AuthorizeDbResponse>;
   }

   async refresh(refreshRequest: DatabaseRefreshRequestDTO): Promise<RefreshDbResponse> {
    return this.request<AuthorizeDbResponse>('/***REMOVED***/db/refresh', 'POST', { ecnryptedFields: [] }, refreshRequest) as Promise<AuthorizeDbResponse>;
 }   

  }