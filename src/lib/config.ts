import { ConfigDTO } from '@/data/dto';
import { useEffect, useState } from 'react';
import { encrypt, generateEncryptionKey, shallowEncryptDTO } from './crypto';

export async function set (configs: ConfigDTO[], ***REMOVED***: string, value: any) {
    // update the state
    const updatedConfigs = configs.map((config) => config.***REMOVED*** === ***REMOVED*** ? { ...config, value } : config);
    // setConfigs(updatedConfigs);
    // update the server
    fetch(`/***REMOVED***/config`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(await shallowEncryptDTO({ ***REMOVED***: ***REMOVED***, value: value }, generateEncryptionKey())), // TODO: load encryption ***REMOVED*** from app state / localstorage
    });
    return true;
}


// config is encrypted with user ***REMOVED***; the rest of the data is encrypted with the master ***REMOVED***
export const useConfig = (): { configs: ConfigDTO[], get: (arg0:string) => any, getCryptoMasterKey: () => string } => {
    const [configs, setConfigs] = useState<ConfigDTO[]>([]);
    useEffect(() => {
        const fetchConfigs = async () => {
            try {
                const response = await fetch('/***REMOVED***/config');
                const data = await response.json();
                setConfigs(data);
            } catch (error) {
                console.error('Error fetching configs:', error);
            }
        };

        fetchConfigs();
    }, []);

    return { configs, 
             get: (***REMOVED***: string) => configs.find((config) => config.***REMOVED*** === ***REMOVED***),
             getCryptoMasterKey: () => configs.find((config) => config.***REMOVED*** === 'encryption.masterKey')?.value || '',
            }
};

export default useConfig;