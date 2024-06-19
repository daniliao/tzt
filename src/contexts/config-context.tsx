import React, { PropsWithChildren, useEffect, useReducer } from 'react';
type ConfigSupportedValueType = string | number | boolean | null | undefined;

export type ConfigContextType = {
    localConfig: Record<string, ConfigSupportedValueType>;
    serverConfig: Record<string, ConfigSupportedValueType>;

    setLocalConfig(***REMOVED***: string, value: ConfigSupportedValueType): void;
    getLocalConfig(***REMOVED***: string): ConfigSupportedValueType;

    setServerConfig(***REMOVED***: string, value: ConfigSupportedValueType): void;
    getServerConfig(***REMOVED***: string): ConfigSupportedValueType;
    setSaveToLocalStorage(value: boolean): void;
}

type Action =
  | { type: 'SET_LOCAL_CONFIG'; ***REMOVED***: string; value: ConfigSupportedValueType }
  | { type: 'SET_SERVER_CONFIG'; ***REMOVED***: string; value: ConfigSupportedValueType }
  | { type: 'LOAD_SERVER_CONFIG'; config: Record<string, ConfigSupportedValueType> };

const initialState: ConfigContextType = {
  localConfig: {},
  serverConfig: {},
  setLocalConfig: () => {},
  getLocalConfig: () => null,
  setServerConfig: () => {},
  getServerConfig: () => null,
  setSaveToLocalStorage: () => {},
};

function configReducer(state: ConfigContextType, action: Action): ConfigContextType {
  switch (action.type) {
    case 'SET_LOCAL_CONFIG':{
      if (typeof localStorage !== 'undefined'){ 
          if(state.localConfig.saveToLocalStorage || (action.***REMOVED*** === 'saveToLocalStorage')) {
            localStorage.setItem(action.***REMOVED***, action.value as string);          
          }
      }
       
      return {
        ...state,
        localConfig: { ...state.localConfig, [action.***REMOVED***]: action.value },
      };
    }
    case 'SET_SERVER_CONFIG':
      return {
        ...state,
        serverConfig: { ...state.serverConfig, [action.***REMOVED***]: action.value },
      };
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
  const [state, dispatch] = useReducer(configReducer, initialState);

  useEffect(() => {

    // load config from localstorage
    dispatch({ type: 'SET_LOCAL_CONFIG', ***REMOVED***: 'chatGptApiKey', value: (typeof localStorage !== 'undefined') && localStorage.getItem("chatGptApiKey") || "" });
    dispatch({ type: 'SET_LOCAL_CONFIG', ***REMOVED***: 'encryptionKey', value: (typeof localStorage !== 'undefined') && localStorage.getItem("encryptionKey") || "" });
    dispatch({ type: 'SET_LOCAL_CONFIG', ***REMOVED***: 'saveToLocalStorage', value: (typeof localStorage !== 'undefined') && localStorage.getItem("saveToLocalStorage") === "true" });

    fetch('/***REMOVED***/config')
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: 'LOAD_SERVER_CONFIG', config: data });
      })
      .catch((error) => {
        console.error('Failed to load server config:', error);
      });
  }, []);

  const value = {
    ...state,
    setLocalConfig: (***REMOVED***: string, value: ConfigSupportedValueType) =>
      dispatch({ type: 'SET_LOCAL_CONFIG', ***REMOVED***, value }),
    getLocalConfig: (***REMOVED***: string) => state.localConfig[***REMOVED***],
    setServerConfig: (***REMOVED***: string, value: ConfigSupportedValueType) =>
      dispatch({ type: 'SET_SERVER_CONFIG', ***REMOVED***, value }),
    getServerConfig: (***REMOVED***: string) => state.serverConfig[***REMOVED***],
    setSaveToLocalStorage: (value: boolean) => { 
      dispatch({ type: 'SET_LOCAL_CONFIG', ***REMOVED***: 'saveToLocalStorage', value });
      if(!value) {
        for (const k in state.localConfig) {
          localStorage.removeItem(k);
        }    
      } else {
        for (const k in state.localConfig) {
          localStorage.setItem(k, state.localConfig[k]);
        }           
      }
    },
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  )
}