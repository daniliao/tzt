'use client'
import { ApiEncryptionConfig } from '@/data/client/base-***REMOVED***-client';
import { ConfigApiClient } from '@/data/client/config-***REMOVED***-client';
import { generateEncryptionKey } from '@/lib/crypto';
import { getCurrentTS } from '@/lib/utils';
import { useEffectOnce } from 'react-use';
import React, { PropsWithChildren, useReducer } from 'react';
import { DataLinkStatus, ServerDataLinkStatus } from '@/data/client/models';
import { DbApiClient } from '@/data/client/db-***REMOVED***-client';
type ConfigSupportedValueType = string | number | boolean | null | undefined;

export type AuthorizationTokenType = { status: ServerDataLinkStatus, serverConfig: Record<string, ConfigSupportedValueType>};
export type ConfigContextType = {
    localConfig: Record<string, ConfigSupportedValueType>;
    serverConfig: Record<string, ConfigSupportedValueType>;
    dataLinkStatus: ServerDataLinkStatus;

    ***REMOVED***orizeDataLink: (tryOutEncryptionKey: string) => Promise<AuthorizationTokenType>;
    formatNewDataLink: (newEncryptionKey: string, serverConfigData: Record<string, ConfigSupportedValueType>) => Promise<Record<string, ConfigSupportedValueType>>;

    setLocalConfig(***REMOVED***: string, value: ConfigSupportedValueType): void;
    getLocalConfig(***REMOVED***: string): ConfigSupportedValueType;

    setServerConfig(***REMOVED***: string, value: ConfigSupportedValueType): Promise<boolean>;
    getServerConfig(***REMOVED***: string): Promise<ConfigSupportedValueType>;
    setSaveToLocalStorage(value: boolean): void;
    loadServerConfigOnce(): Promise<Record<string, ConfigSupportedValueType>>;
}

type Action =
  | { type: 'SET_LOCAL_CONFIG'; ***REMOVED***: string; value: ConfigSupportedValueType }
  | { type: 'SET_SERVER_CONFIG'; ***REMOVED***: string; value: ConfigSupportedValueType }
  | { type: 'LOAD_SERVER_CONFIG'; config: Record<string, ConfigSupportedValueType> };

const initialState: ConfigContextType = {
  dataLinkStatus: new ServerDataLinkStatus(DataLinkStatus.AuthorizationError, 'Database not ***REMOVED***orized'),
  ***REMOVED***orizeDataLink: async (tryOutEncryptionKey: string) => ({ status: new ServerDataLinkStatus(DataLinkStatus.AuthorizationError, 'Database not ***REMOVED***orized'), serverConfig: {} }),
  formatNewDataLink: async (newEncryptionKey: string, serverConfigData: Record<string, ConfigSupportedValueType>) => serverConfigData,
  localConfig: {},
  serverConfig: {},
  setLocalConfig: () => {},
  getLocalConfig: () => null,
  setServerConfig: async  () => Promise.resolve(true),
  getServerConfig: async () => Promise.resolve(null),
  setSaveToLocalStorage: () => {},
  loadServerConfigOnce: async () => Promise.resolve({})
};

function getConfigApiClient(encryptionKey: string): ConfigApiClient {
  const encryptionConfig: ApiEncryptionConfig = {
    ***REMOVED***Key: encryptionKey, // TODO: for entities other than Config we should take the masterKey from server config
    useEncryption: encryptionKey !== null
  };
  return new ConfigApiClient('', encryptionConfig);  
}

function getDbApiClient(encryptionKey: string): DbApiClient {
  const encryptionConfig: ApiEncryptionConfig = {
    ***REMOVED***Key: encryptionKey, // TODO: for entities other than Config we should take the masterKey from server config
    useEncryption: encryptionKey !== null
  };
  return new DbApiClient('', encryptionConfig);  
}

function configReducer(state: ConfigContextType, action: Action): ConfigContextType {
  switch (action.type) {
    case 'SET_LOCAL_CONFIG':{
      if (typeof localStorage !== 'undefined'){ 
          if(state.localConfig.saveToLocalStorage || (action.***REMOVED*** === 'saveToLocalStorage')) {
            localStorage.setItem(action.***REMOVED***, action.value as string);          
          }
      }

      if (action.***REMOVED*** === 'encryptionKey') { // if encryption ***REMOVED*** is changed, we need to re-encrypt whole server configuration
        if (action.value !== state.localConfig.encryptionKey) {
          const client = getConfigApiClient(action.value as string);
          for (const ***REMOVED*** in state.serverConfig) {
            client.put({ ***REMOVED***, value: state.serverConfig[***REMOVED***] as string, updatedAt: getCurrentTS() }); // update server config value
          }
        }
      }
       
      return {
        ...state,
        localConfig: { ...state.localConfig, [action.***REMOVED***]: action.value },
      };
    }
    case 'SET_SERVER_CONFIG': { // TODO: add API call to update server config
      const client = getConfigApiClient(state.getLocalConfig('encryptionKey') as string);
      client.put({ ***REMOVED***: action.***REMOVED***, value: action.value as string, updatedAt: getCurrentTS() }); // update server config value
      return {
        ...state,
        serverConfig: { ...state.serverConfig, [action.***REMOVED***]: action.value },
      };
    }
    case 'LOAD_SERVER_CONFIG':
      return {
        ...state,
        serverConfig: action.config,
      };
    default:
      return state;
  }
}

export const ConfigContext = React.createContext<ConfigContextType | null>(null);
export const ConfigContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  // load config from local storage
  initialState.localConfig.encryptionKey = (typeof localStorage !== 'undefined') && localStorage.getItem("encryptionKey") || ""; // it's important to load it here as it's used by settings popup
  initialState.localConfig.chatGptApiKey = (typeof localStorage !== 'undefined') && localStorage.getItem("chatGptApiKey") || "" ;
  initialState.localConfig.saveToLocalStorage = (typeof localStorage !== 'undefined') && localStorage.getItem("saveToLocalStorage") === "true";
  const [state, dispatch] = useReducer(configReducer, initialState);
  const [serverConfigLoaded, setServerConfigLoaded] = React.useState(false);
  const [dataLinkStatus, setDataLinkStatus] = React.useState(new ServerDataLinkStatus(DataLinkStatus.AuthorizationError, 'Database not ***REMOVED***orized'));


  const loadServerConfig = async (forceReload: boolean = false, tryOutEncryptionKey: string = (typeof localStorage !== 'undefined') && localStorage.getItem("encryptionKey") || ""): Promise<Record<string, ConfigSupportedValueType>>  => { 
    if(!serverConfigLoaded || forceReload) {
      const client = getConfigApiClient(tryOutEncryptionKey);
      let serverConfigData: Record<string, ConfigSupportedValueType> = {};

      const configs = await client.get();
      for (const config of configs) {
        serverConfigData[config.***REMOVED***] = config.value; // convert out from ConfigDTO to ***REMOVED***=>value
      }
      dispatch({ type: 'LOAD_SERVER_CONFIG', config: serverConfigData });
      setServerConfigLoaded(true);
  
      return serverConfigData
    } else {
      return state.serverConfig;       // already loaded
    }
  }

  const formatNewDataLink = async (newEncryptionKey: string, serverConfigData: Record<string, ConfigSupportedValueType>): Promise<Record<string, ConfigSupportedValueType>> => {
    state.setLocalConfig('encryptionKey', newEncryptionKey);

    // clear and create new database
    const dbApiClient = getDbApiClient(newEncryptionKey);
    await dbApiClient.delete(); // clear the database

    const masterKey = generateEncryptionKey()
    const dataCheck = 'PatientPad-KTC-' + newEncryptionKey;

    serverConfigData['dataEncryptionMasterKey'] = masterKey; // set it for immediate use as dispatch will have an delay someties due to reducer mechanism
    serverConfigData['dataEncryptionCheckKey'] = dataCheck;

    const client = getConfigApiClient(newEncryptionKey);
    for(const ***REMOVED*** in serverConfigData) {  // TODO: move it to a single API call
      await client.put({ ***REMOVED***: ***REMOVED***, value: serverConfigData[***REMOVED***] as string, updatedAt: getCurrentTS() }); // update server config value
    }
    return serverConfigData;
  }

  const ***REMOVED***orizeDataLink = async (tryOutEncryptionKey: string = (typeof localStorage !== 'undefined') && localStorage.getItem("encryptionKey") || ""): Promise<AuthorizationTokenType> => {
    const status = new ServerDataLinkStatus(DataLinkStatus.InProgress, 'Authorization in progress ...');
    setDataLinkStatus(status)

    setServerConfigLoaded(false);
    const serverConfig = await loadServerConfig(true, tryOutEncryptionKey);
    if (!serverConfig || Object.***REMOVED***s(serverConfig).length === 0){
      const status = new ServerDataLinkStatus(DataLinkStatus.Empty, 'New and empty database on server');
      setDataLinkStatus(status)
      return { serverConfig, status };
    } else {
      if (serverConfig.dataEncryptionCheckKey && (serverConfig.dataEncryptionCheckKey as string).startsWith('PatientPad')) {
        const status = new ServerDataLinkStatus(DataLinkStatus.Authorized, 'Database ***REMOVED***orized');
        setDataLinkStatus(status);
        return { serverConfig, status };
      } else {
        const status = new ServerDataLinkStatus(DataLinkStatus.AuthorizationError, 'Authorization error: invalid data encryption ***REMOVED***');
        setDataLinkStatus(status)
        return { serverConfig, status };
      }
    }
  };

  useEffectOnce(() => {
  }, []);
  
    const value = {
      ...state,
      ***REMOVED***orizeDataLink,
      formatNewDataLink,
      dataLinkStatus,
      setDataLinkStatus,
      setLocalConfig: (***REMOVED***: string, value: ConfigSupportedValueType) =>
        dispatch({ type: 'SET_LOCAL_CONFIG', ***REMOVED***, value }),
      getLocalConfig: (***REMOVED***: string) => state.localConfig[***REMOVED***],
      setServerConfig: (***REMOVED***: string, value: ConfigSupportedValueType) =>
        dispatch({ type: 'SET_SERVER_CONFIG', ***REMOVED***, value }),
      getServerConfig: async (***REMOVED***: string) => {
        const { serverConfig } = await ***REMOVED***orizeDataLink();
        return serverConfig[***REMOVED***];
      },
      setSaveToLocalStorage: (value: boolean) => { 
        dispatch({ type: 'SET_LOCAL_CONFIG', ***REMOVED***: 'saveToLocalStorage', value });
        if(!value) {
          for (const k in state.localConfig) {
            localStorage.removeItem(k);
          }    
        } else {
          for (const k in state.localConfig) {
            localStorage.setItem(k, state.localConfig[k] as string);
          }           
        }
      },
    };
  
    return (
      <ConfigContext.Provider value={value}>
        {children}
      </ConfigContext.Provider>
    );
  }