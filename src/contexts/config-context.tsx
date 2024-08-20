'use client'
import { ApiEncryptionConfig } from '@/data/client/base-***REMOVED***-client';
import { ConfigApiClient } from '@/data/client/config-***REMOVED***-client';
import { getCurrentTS } from '@/lib/utils';
import { useEffectOnce } from 'react-use';
import React, { PropsWithChildren, useContext, useReducer } from 'react';
import { DatabaseContext, DatabaseContextType } from './db-context';
import { DatabaseAuthStatus } from '@/data/client/models';

function isNumber(value:any){
  return !isNaN(value);
}

export function coercedVal(val: any, defaultVal: any = ''): ConfigSupportedValueType {
  if (val === '' || val === undefined || val === 'null') return defaultVal;
  if (val === 'true') return true; // booleans are not supported by sqlite so we're converting them on input and outputse
  if (val === 'false') return false;
  if (isNumber(val)) return Number(val);

  return val;
}

export const ENV_PROVIDED_CONFIG = {
  chatGptApiKey: process.env.NEXT_PUBLIC_CHAT_GPT_API_KEY,
  displayAttachmentPreviews: process.env.NEXT_PUBLIC_DISPLAY_ATTACHMENT_PREVIEWS,
  ocrProvider: process.env.NEXT_PUBLIC_OCR_PROVIDER,
  ocrLanguage: process.env.NEXT_PUBLIC_OCR_LANGUAGE,
  ollamaUrl: process.env.NEXT_PUBLIC_OLLAMA_URL,
  ollamaModel: process.env.NEXT_PUBLIC_OLLAMA_MODEL,
  llmProviderChat: process.env.NEXT_PUBLIC_LLM_PROVIDER_CHAT,
  llmProviderParse: process.env.NEXT_PUBLIC_LLM_PROVIDER_PARSE,
  llmProviderRemovePII: process.env.NEXT_PUBLIC_LLM_PROVIDER_REMOVE_PII,
  piiGeneralData: process.env.NEXT_PUBLIC_PII_GENERAL_DATA,
  autoLoadPatientContext: process.env.NEXT_PUBLIC_AUTO_LOAD_PATIENT_CONTEXT,
}

type ConfigSupportedValueType = string | number | boolean | null | undefined;

export type ConfigContextType = {
    localConfig: Record<string, ConfigSupportedValueType>;
    serverConfig: Record<string, ConfigSupportedValueType>;

    setLocalConfig(***REMOVED***: string, value: ConfigSupportedValueType): void;
    getLocalConfig(***REMOVED***: string): ConfigSupportedValueType;

    setServerConfig(***REMOVED***: string, value: ConfigSupportedValueType): Promise<boolean>;
    getServerConfig(***REMOVED***: string): Promise<ConfigSupportedValueType>;
    setSaveToLocalStorage(value: boolean): void;
    loadServerConfigOnce(): Promise<Record<string, ConfigSupportedValueType>>;

    isConfigDialogOpen: boolean;
    setConfigDialogOpen: (value: boolean) => void;
}

function getConfigApiClient(encryptionKey: string, dbContext?: DatabaseContextType | null): ConfigApiClient {
  const encryptionConfig: ApiEncryptionConfig = {
    ***REMOVED***Key: encryptionKey, // TODO: for entities other than Config we should take the masterKey from server config
    useEncryption: encryptionKey !== null
  };
  return new ConfigApiClient('', dbContext, encryptionConfig);  
}

export const ConfigContext = React.createContext<ConfigContextType | null>(null);
export const ConfigContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
let serverConfigLoaded = false;
let serverConfig: Record<string, ConfigSupportedValueType> = {};
let localConfig: Record<string, ConfigSupportedValueType> = {};

const dbContext = useContext(DatabaseContext);
const [isConfigDialogOpen, setConfigDialogOpen] = React.useState(false);

  const loadServerConfig = async (forceReload: boolean = false): Promise<Record<string, ConfigSupportedValueType>>  => { 
    if((!serverConfigLoaded || forceReload) && dbContext?.***REMOVED***Status === DatabaseAuthStatus.Authorized) {
      const client = getConfigApiClient(dbContext?.masterKey as string, dbContext);
      let serverConfigData: Record<string, ConfigSupportedValueType> = {};

      const configs = await client.get();
      for (const config of configs) {
        serverConfigData[config.***REMOVED***] = config.value; // convert out from ConfigDTO to ***REMOVED***=>value
      }
      serverConfig = serverConfigData;
      serverConfigLoaded = true;

      return serverConfigData
    } else {
      return serverConfig;       // already loaded
    }
  }


  useEffectOnce(() => {
  });
  
    const value = {
      localConfig,
      serverConfig,
      isConfigDialogOpen,
      setConfigDialogOpen,
      setLocalConfig: (***REMOVED***: string, value: ConfigSupportedValueType) =>
        {
          if (typeof localStorage !== 'undefined'){ 
            if(localConfig.saveToLocalStorage || (***REMOVED*** === 'saveToLocalStorage')) {
              localStorage.setItem(***REMOVED***, value as string);          
            }
          }
          localConfig = ({ ...localConfig, [***REMOVED***]: value });
        },
      getLocalConfig: (***REMOVED***: string) => {
        if (typeof localConfig[***REMOVED***] !== 'undefined') {
          return coercedVal(localConfig[***REMOVED***]);
        } else {
          return coercedVal(ENV_PROVIDED_CONFIG[***REMOVED***]);
        }
      },
      setServerConfig: (***REMOVED***: string, value: ConfigSupportedValueType) =>
      {
        if (dbContext?.***REMOVED***Status === DatabaseAuthStatus.Authorized) {
          const client = getConfigApiClient(dbContext.masterKey as string, dbContext);
          return client.put({ ***REMOVED***, value: `${value}`, updatedAt: getCurrentTS() });
        } else {
          return Promise.resolve(false);
        }
      },
      getServerConfig: async (***REMOVED***: string) => {
        const serverConfig  = await loadServerConfig();
        const val = serverConfig[***REMOVED***];
        if (serverConfig && typeof serverConfig[***REMOVED***] !== 'undefined') {
          return coercedVal(val);
        } else {
            return coercedVal(ENV_PROVIDED_CONFIG[***REMOVED***]);
        }
      },
    };
  
    return (
      <ConfigContext.Provider value={value}>
        {children}
      </ConfigContext.Provider>
    );
  }