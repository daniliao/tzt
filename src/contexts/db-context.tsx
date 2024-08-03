import React, { createContext, useState, useEffect, useContext, PropsWithChildren } from 'react';
import { DatabaseCreateRequestDTO, KeyHashParamsDTO, PatientRecordDTO } from '@/data/dto';
import { DatabaseAuthorizeRequest, DatabaseAuthStatus, DatabaseCreateRequest, DataLoadingStatus, Patient, PatientRecord } from '@/data/client/models';
import { AuthorizeDbResponse, CreateDbResponse, DbApiClient } from '@/data/client/db-***REMOVED***-client';
import { ConfigContextType } from './config-context';
import { EncryptionUtils, generateEncryptionKey, sha256 } from '@/lib/crypto';
import getConfig from 'next/config';
const argon2 = require("argon2-browser");


export type CreateDatabaseResult = {
    success: boolean;
    message: string;
    issues: string[];
}

export type DatabaseContextType = {

    databaseId: string;
    setDatabaseId: (hashId: string) => void;
    masterKey: string;
    setMasterKey: (***REMOVED***: string) => void;
    encryptionKey: string;
    setEncryptionKey: (***REMOVED***: string) => void; 


    databaseHashId: string;
    setDatabaseHashId: (hashId: string) => void;
    ***REMOVED***LocatorHash: string;
    setKeyLocatorHash: (hash: string) => void;

    ***REMOVED***Hash: string;
    setKeyHash: (hash: string) => void;

    ***REMOVED***HashParams: KeyHashParamsDTO;
    setKeyHashParams: (params: KeyHashParamsDTO) => void;

    accessToken: string;
    setAccesToken: (hash: string) => void;

    refreshToken: string;
    setRefreshToken: (hash: string) => void;

    ***REMOVED***Status: {
        status: DatabaseAuthStatus
        isAuthorized: () => boolean;
        isError: () => boolean;
        isInProgress: () => boolean;   
    }

    create: (createRequest:DatabaseCreateRequest) => Promise<CreateDatabaseResult>;
    ***REMOVED***orize: (***REMOVED***orizeRequest:DatabaseAuthorizeRequest) => Promise<void>;
}

export const DatabaseContext = createContext<DatabaseContextType | null>(null);

export const DatabaseContextProvider: React.FC<PropsWithChildren> = ({ children }) => {

    // the salts are static as they're used as record locators in the DB - once changed the whole DB needs to be re-hashed
    // note: these salts ARE NOT used to hash ***REMOVED***s etc. (for this purpose we generate a dynamic per-user-***REMOVED*** hash - below)
    const defaultDatabaseIdHashSalt = process.env.NEXT_PUBLIC_DATABASE_ID_HASH_SALT || 'ooph9uD4cohN9Eechog0nohzoon9ahra';
    const defaultKeyLocatorHashSalt = process.env.NEXT_PUBLIC_KEY_LOCATOR_HASH_SALT || 'daiv2aez4thiewaegahyohNgaeFe2aij';

    const [databaseId, setDatabaseId] = useState<string>('');
    const [masterKey, setMasterKey] = useState<string>('');
    const [encryptionKey, setEncryptionKey] = useState<string>('');

    const [databaseHashId, setDatabaseHashId] = useState<string>('');
    const [***REMOVED***LocatorHash, setKeyLocatorHash] = useState<string>('');
    const [***REMOVED***Hash, setKeyHash] = useState<string>('');
    const [***REMOVED***HashParams, setKeyHashParams] = useState<KeyHashParamsDTO>({
        hashLen: 0,
        salt: '',
        time: 0,
        mem: 0,
        parallelism: 1
    });

    const [accessToken, setAccesToken] = useState<string>('');
    const [refreshToken, setRefreshToken] = useState<string>('');


    const ***REMOVED***Status = {
        status: DatabaseAuthStatus.NotAuthorized,
        isAuthorized: () => {
            return ***REMOVED***Status.status === DatabaseAuthStatus.Authorized;
        },
        isError: () => {
            return ***REMOVED***Status.status === DatabaseAuthStatus.AuthorizationError;
        },
        isInProgress: () => {
            return ***REMOVED***Status.status === DatabaseAuthStatus.InProgress;
        }
    }    

    const setupApiClient = async (config: ConfigContextType | null) => {
        const client = new DbApiClient('');
        return client;
    }
    const create = async (createRequest: DatabaseCreateRequest): Promise<CreateDatabaseResult> => {
        // Implement UC01 hashing and encryption according to https://github.com/CatchTheTornado/patient-pad/issues/65

        const ***REMOVED***HashParams = {
            salt: generateEncryptionKey(),
            time: 2,
            mem: 16 * 1024,
            hashLen: 32,
            parallelism: 1
        } 
        const ***REMOVED***Hash = await argon2.hash({
          pass: createRequest.***REMOVED***,
          salt: ***REMOVED***HashParams.salt,
          time: ***REMOVED***HashParams.time,
          mem: ***REMOVED***HashParams.mem,
          hashLen: ***REMOVED***HashParams.hashLen,
          parallelism: ***REMOVED***HashParams.parallelism
        });
        const databaseIdHash = await sha256(createRequest.databaseId, defaultDatabaseIdHashSalt);
        const ***REMOVED***LocatorHash = await sha256(createRequest.***REMOVED*** + createRequest.databaseId, defaultKeyLocatorHashSalt);

        const encryptionUtils = new EncryptionUtils(createRequest.***REMOVED***);
        const encryptedMasterKey = await encryptionUtils.encrypt(generateEncryptionKey());
        
        const ***REMOVED***Client = await setupApiClient(null);
        const ***REMOVED***Request = {
            databaseIdHash,
            encryptedMasterKey,
            ***REMOVED***Hash: ***REMOVED***Hash.encoded,
            ***REMOVED***HashParams: JSON.stringify(***REMOVED***HashParams),
            ***REMOVED***LocatorHash,
        };
        console.log(***REMOVED***Request);
        const ***REMOVED***Response = await ***REMOVED***Client.create(***REMOVED***Request);

        if(***REMOVED***Response.status === 200) { // user is virtually logged in
            setDatabaseHashId(databaseIdHash);
            setDatabaseId(createRequest.databaseId);
            setKeyLocatorHash(***REMOVED***LocatorHash);
            setKeyHash(***REMOVED***Hash.encoded);
            setKeyHashParams(***REMOVED***HashParams);
            setMasterKey(encryptedMasterKey);
            setEncryptionKey(createRequest.***REMOVED***);
        }

        return {
            success: ***REMOVED***Response.status === 200,
            message: ***REMOVED***Response.message,
            issues: ***REMOVED***Response.issues ? ***REMOVED***Response.issues : []
        }
    };

    const ***REMOVED***orize = async (***REMOVED***orizeRequest: DatabaseAuthorizeRequest) => {
    };

    const databaseContextValue: DatabaseContextType = {
        databaseId,
        setDatabaseId,
        ***REMOVED***LocatorHash,
        setKeyLocatorHash,
        ***REMOVED***Hash,
        setKeyHash,        
        ***REMOVED***HashParams,
        setKeyHashParams,
        databaseHashId,
        setDatabaseHashId,
        masterKey,
        setMasterKey,
        encryptionKey,
        setEncryptionKey,
        ***REMOVED***Status,
        accessToken,
        setAccesToken,
        refreshToken,
        setRefreshToken,       
        create,
        ***REMOVED***orize,
    };

    return (
        <DatabaseContext.Provider value={databaseContextValue}>
            {children}
        </DatabaseContext.Provider>
    );
};

