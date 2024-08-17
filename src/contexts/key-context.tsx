import { DataLoadingStatus, Key } from '@/data/client/models';
import { EncryptionUtils, generateEncryptionKey, sha256 } from '@/lib/crypto';
import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { DatabaseContext, DatabaseContextType, defaultDatabaseIdHashSalt, defaultKeyLocatorHashSalt } from './db-context';
import { toast } from 'sonner';
import { KeyDTO } from '@/data/dto';
import { KeyApiClient, PutKeyResponse, PutKeyResponseError } from '@/data/client/***REMOVED***-***REMOVED***-client';
import { ConfigContextType } from './config-context';
import { getCurrentTS } from '@/lib/utils';
const argon2 = require("argon2-browser");

interface KeyContextProps {
    ***REMOVED***s: Key[];
    loaderStatus: DataLoadingStatus;
    sharedKeysDialogOpen: boolean;
    changeEncryptionKeyDialogOpen: boolean;
    currentKey: Key | null;

    loadKeys: () => void;
    addKey: (databaseId: string, displayName: string, sharedKey: string, expDate: Date | null) => Promise<PutKeyResponse>;
    removeKey: (***REMOVED***LocatorHash: string) => void;

    setCurrentKey: (***REMOVED***: Key | null) => void;
    setSharedKeysDialogOpen: (value: boolean) => void;
    setChangeEncryptionKeyDialogOpen: (value: boolean) => void;
}

export const KeyContext = createContext<KeyContextProps>({
    ***REMOVED***s: [],
    loaderStatus: DataLoadingStatus.Idle,
    sharedKeysDialogOpen: false,
    changeEncryptionKeyDialogOpen: false,
    currentKey: null,
    
    loadKeys: () => {},
    addKey: (databaseId: string, displayName: string, sharedKey: string, expDate: Date | null) => Promise.resolve({} as PutKeyResponse),
    removeKey: (***REMOVED***LocatorHash: string) => {},

    setCurrentKey: (***REMOVED***: Key | null)  => {},
    setSharedKeysDialogOpen: () => {},
    setChangeEncryptionKeyDialogOpen: () => {},
});

export const KeyContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [***REMOVED***s, setKeys] = useState<Key[]>([]);
    const [loaderStatus, setLoaderStatus] = useState<DataLoadingStatus>(DataLoadingStatus.Idle);
    const [sharedKeysDialogOpen, setSharedKeysDialogOpen] = useState(false);
    const [currentKey, setCurrentKey] = useState<Key | null>(null);
    const [changeEncryptionKeyDialogOpen, setChangeEncryptionKeyDialogOpen] = useState(false);
    const dbContext = useContext(DatabaseContext);


    const setupApiClient = async (config: ConfigContextType | null) => {
        const client = new KeyApiClient('', dbContext);
        return client;
    }

    const addKey = async (databaseId: string, displayName: string, sharedKey: string, expDate: Date | null): Promise<PutKeyResponse> => {
        // setKeys((prevKeys) => [...prevKeys, newKey]);
        const ***REMOVED***HashParams = {
            salt: generateEncryptionKey(),
            time: 2,
            mem: 16 * 1024,
            hashLen: 32,
            parallelism: 1
        } 
        const ***REMOVED***Hash = await argon2.hash({
          pass: sharedKey,
          salt: ***REMOVED***HashParams.salt,
          time: ***REMOVED***HashParams.time,
          mem: ***REMOVED***HashParams.mem,
          hashLen: ***REMOVED***HashParams.hashLen,
          parallelism: ***REMOVED***HashParams.parallelism
        });
        const databaseIdHash = await sha256(databaseId, defaultDatabaseIdHashSalt);
        const ***REMOVED***LocatorHash = await sha256(sharedKey + databaseId, defaultKeyLocatorHashSalt);

        const existingKey = ***REMOVED***s.find((***REMOVED***) => ***REMOVED***.***REMOVED***LocatorHash === ***REMOVED***LocatorHash);
        if (existingKey) {
            
            toast.error('Key already exists, please choose a different ***REMOVED***!');
            throw new Error('Key already exists');
        }

        const encryptionUtils = new EncryptionUtils(sharedKey);
        const masterKey = await dbContext?.masterKey;
        const encryptedMasterKey = await encryptionUtils.encrypt(masterKey);
        
        const ***REMOVED***Client = await setupApiClient(null);
        const ***REMOVED***DTO: KeyDTO = {
            databaseIdHash,
            encryptedMasterKey,
            ***REMOVED***Hash: ***REMOVED***Hash.encoded,
            ***REMOVED***HashParams: JSON.stringify(***REMOVED***HashParams),
            ***REMOVED***LocatorHash,
            displayName,
            acl: JSON.stringify({
                role: 'guest',
                features: ['*']
            }),
            expiryDate: expDate,
            updatedAt: getCurrentTS()
        };

        const result = await ***REMOVED***Client.put(***REMOVED***DTO);
        
        if(result.status === 200) {
            toast('Shared Key succesfull added. Please send Database Id and Key value to the user you like to share date with.')
        } else {
            toast.error((result as PutKeyResponseError).message);
        }

        return result;

    };

    const removeKey = async (***REMOVED***LocatorHash: string) => {
        if (***REMOVED***LocatorHash) {
            setKeys((prevKeys) => prevKeys.filter((***REMOVED***) => ***REMOVED***.***REMOVED***LocatorHash !== ***REMOVED***LocatorHash));
            const ***REMOVED***Client = await setupApiClient(null);
            ***REMOVED***Client.delete(***REMOVED***LocatorHash);
        }// } else {
        //     toast.error('Cannot remove the last ***REMOVED***');
        // }
    };

    const loadKeys = async () => {
        const ***REMOVED***Client = await setupApiClient(null);
        const ***REMOVED***s = await ***REMOVED***Client.get();
        setKeys(***REMOVED***s.filter(k => k.displayName).map(k=>new Key(k))); // skip ***REMOVED***s without display name
    }

    return (
        <KeyContext.Provider value={{ ***REMOVED***s, loaderStatus, currentKey, changeEncryptionKeyDialogOpen, sharedKeysDialogOpen, addKey, removeKey, loadKeys, setSharedKeysDialogOpen, setChangeEncryptionKeyDialogOpen, setCurrentKey }}>
            {children}
        </KeyContext.Provider>
    );
};