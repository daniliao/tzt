import React, { createContext, useState, useEffect, useContext } from 'react';
import { DatabaseCreateRequestDTO, KeyHashParamsDTO, PatientRecordDTO } from '@/data/dto';
import { DatabaseAuthorize, DatabaseCreate, DataLoadingStatus, Patient, PatientRecord } from '@/data/client/models';
import { AuthorizeDbResponse, CreateDbResponse, DbApiClient } from '@/data/client/db-***REMOVED***-client';
import { ConfigContextType } from './config-context';

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

    create: (createRequest:DatabaseCreate) => Promise<void>;
    ***REMOVED***orize: (***REMOVED***orizeRequest:DatabaseAuthorize) => Promise<void>;
}

export const DatabaseContext = createContext<DatabaseContextType | null>(null);

const DatabaseProvider: React.FC = ({ children }) => {
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

    const setupApiClient = async (config: ConfigContextType | null) => {
        const client = new DbApiClient('');
        return client;
    }
    const create = async (createRequest: DatabaseCreate) => {
        // Implement UC01 hashing and encryption according to https://github.com/CatchTheTornado/patient-pad/issues/65
    };

    const ***REMOVED***orize = async (***REMOVED***orizeRequest: DatabaseAuthorize) => {
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
        create,
        ***REMOVED***orize,
    };

    return (
        <DatabaseContext.Provider value={databaseContextValue}>
            {children}
        </DatabaseContext.Provider>
    );
};

export default DatabaseProvider;