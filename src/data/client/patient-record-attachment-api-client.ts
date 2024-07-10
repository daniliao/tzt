import { PatientDTO, PatientDTOEncSettings, PatientRecordAttachmentDTO } from "../dto";
import { ApiClient, ApiEncryptionConfig } from "./base-***REMOVED***-client";

export type PutPatientRecordAttachmentRequest = FormData;

export type PutPatientRecordAttachmentResponseSuccess = {
  message: string;
  data: PatientRecordAttachmentDTO;
  status: 200;
};

export type PutPatientRecordAttachmentResponseError = {
  message: string;
  status: 400;
  issues?: any[];
};

export type PutPatientRecordAttachmentResponse = PutPatientRecordAttachmentResponseSuccess | PutPatientRecordAttachmentResponseError;

export class PatientRecordAttachmentApiClient extends ApiClient {
    constructor(baseUrl: string, encryptionConfig?: ApiEncryptionConfig) {
      super(baseUrl, encryptionConfig);
    }
  
    // async get(): Promise<GetPatientsResponse> {
    //   return this.request<GetPatientsResponse>('/***REMOVED***/patient', 'GET', PatientDTOEncSettings) as Promise<GetPatientsResponse>;
    // }
  
    async put(formData:PutPatientRecordAttachmentRequest): Promise<PutPatientRecordAttachmentResponse> {
      return this.request<PutPatientRecordAttachmentResponse>('/***REMOVED***/patient-record-attachment', 'PUT', null, null, formData) as Promise<PutPatientRecordAttachmentResponse>;
    }
  }