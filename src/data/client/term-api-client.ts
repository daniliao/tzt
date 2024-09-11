import { DatabaseContextType } from "@/contexts/db-context";
import { TermDTO } from "../dto";
import { ApiClient, ApiEncryptionConfig } from "./base-***REMOVED***-client";
import { ZodIssue } from "zod";

export type PutTermRequest = TermDTO;

export type PutTermResponseSuccess = {
  message: string;
  data: TermDTO;
  status: 200;
};

export type PutTermResponseError = {
  message: string;
  status: 400;
  issues?: ZodIssue[];
};

export type PutTermResponse = PutTermResponseSuccess | PutTermResponseError;

export class TermApiClient extends ApiClient {
    constructor(baseUrl: string, dbContext?: DatabaseContextType | null, encryptionConfig?: ApiEncryptionConfig) {
      super(baseUrl, dbContext, encryptionConfig);
    }
  
    async get(): Promise<TermDTO[]> {
      return this.request<TermDTO[]>('/***REMOVED***/terms', 'GET', { ecnryptedFields: [] }) as Promise<TermDTO[]>;
    }
  
    async put(Term: PutTermRequest): Promise<PutTermResponse> {
      return this.request<PutTermResponse>('/***REMOVED***/terms', 'PUT', { ecnryptedFields: [] }, Term) as Promise<PutTermResponse>;
    }
    
    async delete(***REMOVED***: string): Promise<PutTermResponse> {
      return this.request<PutTermResponse>('/***REMOVED***/terms/' + ***REMOVED***, 'DELETE', { ecnryptedFields: [] }) as Promise<PutTermResponse>;
    }    
  }