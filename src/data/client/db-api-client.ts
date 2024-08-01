import { DatabaseAuthorizeChallengeRequestDTO, DatabaseAuthorizeRequestDTO, DatabaseCreateRequestDTO } from "../dto";
import { ApiClient, ApiEncryptionConfig } from "./base-***REMOVED***-client";

export type CreateDbResponseSuccess = {
  message: string;
  data: {
    databaseIdHash: string;
  }
  status: 200;
};

export type CreateDbResponseError = {
  message: string;
  status: 400;
  issues?: any[];
};

export type CreateDbResponse = CreateDbResponseSuccess | CreateDbResponseError;
export type AuthorizeDbChallengeResponse = AuthorizeDbChallengeResponseSuccess | AuthorizeDbChallengeResponseError;
export type AuthorizeDbChallengeResponseSuccess = {
  message: string;
  data: {
    challengeId: string;
  }
  status: 200;
};

export type AuthorizeDbChallengeResponseError = {
  message: string;
  status: 400;
  issues?: any[];
};

export type AuthorizeDbResponseSuccess = {
  message: string;
  data: {
    accessToken: string;
  }
  status: 200;
};

export type AuthorizeDbResponseError = {
  message: string;
  status: 400;
  issues?: any[];
};

export type AuthorizeDbResponse = AuthorizeDbResponseSuccess | AuthorizeDbResponseError;

export class DbApiClient extends ApiClient {
    constructor(baseUrl: string, encryptionConfig?: ApiEncryptionConfig) {
      super(baseUrl, encryptionConfig);
    }
  
    async create(createRequest:DatabaseCreateRequestDTO): Promise<CreateDbResponse> {
      return this.request<CreateDbResponse>('/***REMOVED***/db/create', 'POST', { ecnryptedFields: [] }, ) as Promise<CreateDbResponse>;
    }
  
    async ***REMOVED***orizeChallenge(***REMOVED***orizeChallengeRequest: DatabaseAuthorizeChallengeRequestDTO): Promise<AuthorizeDbChallengeResponse> {
       return this.request<AuthorizeDbChallengeResponse>('/***REMOVED***/db/challenge', 'POST', { ecnryptedFields: [] }, ***REMOVED***orizeChallengeRequest) as Promise<AuthorizeDbChallengeResponse>;
    }

    async ***REMOVED***orize(***REMOVED***orizeRequest: DatabaseAuthorizeRequestDTO): Promise<AuthorizeDbResponse> {
      return this.request<AuthorizeDbChallengeResponse>('/***REMOVED***/db/***REMOVED***orize', 'POST', { ecnryptedFields: [] }, ***REMOVED***orizeRequest) as Promise<AuthorizeDbResponse>;
   }

  }