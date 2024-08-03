import { DatabaseContextType } from "@/contexts/db-context";
import { DatabaseAuthorizeChallengeRequestDTO, DatabaseAuthorizeRequestDTO, DatabaseCreateRequestDTO, KeyHashParamsDTO } from "../dto";
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
  }
  status: number;
  issues?: any[];
};

export class DbApiClient extends ApiClient {
    constructor(baseUrl: string, dbContext?: DatabaseContextType | null, encryptionConfig?: ApiEncryptionConfig) {
      super(baseUrl, dbContext, encryptionConfig);
    }
  
    async create(createRequest:DatabaseCreateRequestDTO): Promise<CreateDbResponse> {
      return this.request<CreateDbResponse>('/***REMOVED***/db/create', 'POST', { ecnryptedFields: [] }, createRequest) as Promise<CreateDbResponse>;
    }
  
    async ***REMOVED***orizeChallenge(***REMOVED***orizeChallengeRequest: DatabaseAuthorizeChallengeRequestDTO): Promise<AuthorizeDbChallengeResponse> {
       return this.request<AuthorizeDbChallengeResponse>('/***REMOVED***/db/challenge', 'POST', { ecnryptedFields: [] }, ***REMOVED***orizeChallengeRequest) as Promise<AuthorizeDbChallengeResponse>;
    }

    async ***REMOVED***orize(***REMOVED***orizeRequest: DatabaseAuthorizeRequestDTO): Promise<AuthorizeDbResponse> {
      return this.request<AuthorizeDbResponse>('/***REMOVED***/db/***REMOVED***orize', 'POST', { ecnryptedFields: [] }, ***REMOVED***orizeRequest) as Promise<AuthorizeDbResponse>;
   }

  }