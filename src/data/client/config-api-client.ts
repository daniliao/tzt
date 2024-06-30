import { ConfigDTO } from "../dto";
import { ApiClient, ApiEncryptionConfig } from "./base-***REMOVED***-client";

export type PutConfigRequest = ConfigDTO;

export type PutConfigResponseSuccess = {
  message: string;
  data: ConfigDTO;
  status: 200;
};

export type PutConfigResponseError = {
  message: string;
  status: 400;
  issues?: any[];
};

export type PutConfigResponse = PutConfigResponseSuccess | PutConfigResponseError;

export class ConfigApiClient extends ApiClient {
    constructor(baseUrl: string, encryptionConfig?: ApiEncryptionConfig) {
      super(baseUrl, encryptionConfig);
    }
  
    async get(): Promise<ConfigDTO[]> {
      return this.request<ConfigDTO[]>('/***REMOVED***/config', 'GET') as Promise<ConfigDTO[]>;
    }
  
    async put(config: PutConfigRequest): Promise<PutConfigResponse> {
      return this.request<PutConfigResponse>('/***REMOVED***/config', 'PUT', config) as Promise<PutConfigResponse>;
    }
  }