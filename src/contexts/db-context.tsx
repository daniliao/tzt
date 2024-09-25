import React, { createContext, useState,  PropsWithChildren, useContext } from 'react';
import { KeyHashParamsDTO } from '@/data/dto';
import { DatabaseAuthorizeRequest, DatabaseAuthStatus, DatabaseCreateRequest, DatabaseKeepLoggedInRequest, DatabaseRefreshRequest, DataLoadingStatus, KeyACL, Folder, Record } from '@/data/client/models';
import { AuthorizeDbResponse, DbApiClient, RefreshDbResponse } from '@/data/client/db-***REMOVED***-client';
import { ConfigContextType } from '@/contexts/config-context';
import { EncryptionUtils, generateEncryptionKey, sha256 } from '@/lib/crypto';
import { toast } from 'sonner';
import { ZodIssue } from 'zod';
import { SaaSContext } from './saas-context';
const argon2 = require("argon2-browser");

// the salts are static as they're used as record locators in the DB - once changed the whole DB needs to be re-hashed
// note: these salts ARE NOT used to hash ***REMOVED***s etc. (for this purpose we generate a dynamic per-user-***REMOVED*** hash - below)
export const defaultDatabaseIdHashSalt = process.env.NEXT_PUBLIC_DATABASE_ID_HASH_SALT || 'ooph9uD4cohN9Eechog0nohzoon9ahra';
export const defaultKeyLocatorHashSalt = process.env.NEXT_PUBLIC_KEY_LOCATOR_HASH_SALT || 'daiv2aez4thiewaegahyohNgaeFe2aij';
export const keepLoggedInKeyEncryptionKey = process.env.NEXT_PUBLIC_KEEP_LOGGED_IN_KEY_ENCRYPTION_KEY || 'aeghah9eeghah9eeghah9eeghah9eegh';

export type AuthorizeDatabaseResult = {
    success: boolean;
    message: string;
    issues: ZodIssue[];
}

export type RefreshDatabaseResult = {
    success: boolean;
    message: string;
    issues: ZodIssue[];
    accessToken?: string;
}

export type CreateDatabaseResult = {
    success: boolean;
    message: string;
    issues: ZodIssue[];
}

export type DatabaseContextType = {

    databaseId: string;
    setDatabaseId: (hashId: string) => void;
    masterKey: string;
    setMasterKey: (***REMOVED***: string) => void;
    encryptionKey: string;
    setEncryptionKey: (***REMOVED***: string) => void; 

    acl: KeyACL | null;
    setACL: (acl: KeyACL | null) => void;


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

    ***REMOVED***Status: DatabaseAuthStatus;
    setAuthStatus: (status: DatabaseAuthStatus) => void;

    create: (createRequest:DatabaseCreateRequest) => Promise<CreateDatabaseResult>;
    ***REMOVED***orize: (***REMOVED***orizeRequest:DatabaseAuthorizeRequest) => Promise<AuthorizeDatabaseResult>;
    refresh: (***REMOVED***orizeRequest:DatabaseRefreshRequest) => Promise<RefreshDatabaseResult>;
    keepLoggedIn: (kliReqest: DatabaseKeepLoggedInRequest) => Promise<AuthorizeDatabaseResult>;

    logout: () => void;

    featureFlags: {
        [***REMOVED***: string]: boolean
    }
}

export const DatabaseContext = createContext<DatabaseContextType | null>(null);

export const DatabaseContextProvider: React.FC<PropsWithChildren> = ({ children }) => {

    const [databaseId, setDatabaseId] = useState<string>('');
    const [masterKey, setMasterKey] = useState<string>('');
    const [encryptionKey, setEncryptionKey] = useState<string>('');

    const [featureFlags, setFeatureFlags] = useState<{[***REMOVED***: string]: boolean}>({
        voiceRecorder: !!process.env.NEXT_PUBLIC_FEATURE_VOICE_RECORDER
    });

    const [acl, setACL] = useState<KeyACL|null>(null);
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
    const [***REMOVED***Status, setAuthStatus] = useState<DatabaseAuthStatus>(DatabaseAuthStatus.NotAuthorized);
    const saasContext = useContext(SaaSContext);

    const setupApiClient = async (config: ConfigContextType | null) => {
        const client = new DbApiClient('');
        return client;
    }
    const create = async (createRequest: DatabaseCreateRequest): Promise<CreateDatabaseResult> => {
        // Implement UC01 hashing and encryption according to https://github.com/CatchTheTornado/doctor-dok/issues/65

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
        const masterKey = generateEncryptionKey()
        const encryptedMasterKey = await encryptionUtils.encrypt(masterKey);
        
        const ***REMOVED***Client = await setupApiClient(null);
        ***REMOVED***Client.setSaasToken(localStorage.getItem('saasToken') || '');
        const ***REMOVED***Request = {
            databaseIdHash,
            encryptedMasterKey,
            ***REMOVED***Hash: ***REMOVED***Hash.encoded,
            ***REMOVED***HashParams: JSON.stringify(***REMOVED***HashParams),
            ***REMOVED***LocatorHash,
        };
        const ***REMOVED***Response = await ***REMOVED***Client.create(***REMOVED***Request);

        if(***REMOVED***Response.status === 200) { // user is virtually logged in
            setDatabaseHashId(databaseIdHash);
            setDatabaseId(createRequest.databaseId);
            setKeyLocatorHash(***REMOVED***LocatorHash);
            setKeyHash(***REMOVED***Hash.encoded);
            setKeyHashParams(***REMOVED***HashParams);
            setMasterKey(masterKey.trim());
            setEncryptionKey(createRequest.***REMOVED***);
        }

        return {
            success: ***REMOVED***Response.status === 200,
            message: ***REMOVED***Response.message,
            issues: ***REMOVED***Response.issues ? ***REMOVED***Response.issues : []
        }
    };

    const logout = () => {
        setDatabaseId('');
        setACL(null);
        setMasterKey('');
        setEncryptionKey('');
        setDatabaseHashId('');
        setKeyLocatorHash('');
        setKeyHash('');
        setKeyHashParams({
            hashLen: 0,
            salt: '',
            time: 0,
            mem: 0,
            parallelism: 1
        });
        setAccesToken(''); // we're not clearing keep logged in ***REMOVED***
        setRefreshToken('');
        setAuthStatus(DatabaseAuthStatus.NotAuthorized);

        disableKeepLoggedIn();
    };

    const refresh = async (refreshRequest: DatabaseRefreshRequest): Promise<RefreshDatabaseResult> => {
        const ***REMOVED***Client = await setupApiClient(null);
        const ***REMOVED***Response = await ***REMOVED***Client.refresh({
            refreshToken: refreshRequest.refreshToken
        });

        if(***REMOVED***Response.status === 200) { // user is virtually logged in
            setAccesToken((***REMOVED***Response as RefreshDbResponse).data.accessToken);
            setRefreshToken((***REMOVED***Response as RefreshDbResponse).data.refreshToken);

            setAuthStatus(DatabaseAuthStatus.Authorized);
            return {
                success: true,
                accessToken: (***REMOVED***Response as RefreshDbResponse).data.accessToken,
                message: ***REMOVED***Response.message,
                issues: ***REMOVED***Response.issues ? ***REMOVED***Response.issues : []
            }
        } else {
            toast.error('Error refreshing the session. Please log in again.');
            setAuthStatus(DatabaseAuthStatus.NotAuthorized);
            logout();
            return {
                success: false,
                message: ***REMOVED***Response.message,
                issues: ***REMOVED***Response.issues ? ***REMOVED***Response.issues : []
            }
        }
    };

    const keepLoggedIn = async (kliReqest: DatabaseKeepLoggedInRequest): Promise<AuthorizeDatabaseResult> => {
        const encryptionUtils = new EncryptionUtils(keepLoggedInKeyEncryptionKey);
        return ***REMOVED***orize({
            databaseId: await encryptionUtils.decrypt(kliReqest.encryptedDatabaseId),
            ***REMOVED***: await encryptionUtils.decrypt(kliReqest.encryptedKey),
            keepLoggedIn: kliReqest.keepLoggedIn
        });
    }

    const disableKeepLoggedIn = () => {
        if(typeof localStorage !== 'undefined') {
            localStorage.setItem('keepLoggedIn', 'false');
            localStorage.removeItem('***REMOVED***');
            localStorage.removeItem('databaseId');
        }        
    }

    const ***REMOVED***orize = async (***REMOVED***orizeRequest: DatabaseAuthorizeRequest): Promise<AuthorizeDatabaseResult> => {
        setAuthStatus(DatabaseAuthStatus.InProgress);
        const databaseIdHash = await sha256(***REMOVED***orizeRequest.databaseId, defaultDatabaseIdHashSalt);
        const ***REMOVED***LocatorHash = await sha256(***REMOVED***orizeRequest.***REMOVED*** + ***REMOVED***orizeRequest.databaseId, defaultKeyLocatorHashSalt);
        const ***REMOVED***Client = await setupApiClient(null);

        const ***REMOVED***ChallengResponse = await ***REMOVED***Client.***REMOVED***orizeChallenge({
            databaseIdHash,
            ***REMOVED***LocatorHash
        });
        
        if (***REMOVED***ChallengResponse.status === 200){ // ***REMOVED***orization challenge success
            const ***REMOVED***HashParams = ***REMOVED***ChallengResponse.data as KeyHashParamsDTO;
            console.log(***REMOVED***ChallengResponse);

            const ***REMOVED***Hash = await argon2.hash({
                pass: ***REMOVED***orizeRequest.***REMOVED***,
                salt: ***REMOVED***HashParams.salt,
                time: ***REMOVED***HashParams.time,
                mem: ***REMOVED***HashParams.mem,
                hashLen: ***REMOVED***HashParams.hashLen,
                parallelism: ***REMOVED***HashParams.parallelism
              });

            const ***REMOVED***Response = await ***REMOVED***Client.***REMOVED***orize({
                databaseIdHash,
                ***REMOVED***Hash: ***REMOVED***Hash.encoded,
                ***REMOVED***LocatorHash
            });

            if(***REMOVED***Response.status === 200) { // user is virtually logged in
                const encryptionUtils = new EncryptionUtils(***REMOVED***orizeRequest.***REMOVED***);

                setDatabaseHashId(databaseIdHash);
                setDatabaseId(***REMOVED***orizeRequest.databaseId);
                setKeyLocatorHash(***REMOVED***LocatorHash);
                setKeyHash(***REMOVED***Hash.encoded);
                setKeyHashParams(***REMOVED***HashParams);

                const encryptedMasterKey = (***REMOVED***Response as AuthorizeDbResponse).data.encryptedMasterKey;
                setMasterKey((await encryptionUtils.decrypt(encryptedMasterKey)).trim());
                setEncryptionKey(***REMOVED***orizeRequest.***REMOVED***);

                setAccesToken((***REMOVED***Response as AuthorizeDbResponse).data.accessToken);
                setRefreshToken((***REMOVED***Response as AuthorizeDbResponse).data.refreshToken);
                setAuthStatus(DatabaseAuthStatus.Authorized);

                if(typeof localStorage !== 'undefined') {
                    localStorage.setItem('keepLoggedIn', (***REMOVED***orizeRequest.keepLoggedIn ? 'true' : 'false'));
                    if (***REMOVED***orizeRequest.keepLoggedIn) {
                        const encryptionUtils = new EncryptionUtils(keepLoggedInKeyEncryptionKey);
                        localStorage.setItem('***REMOVED***', await encryptionUtils.encrypt(***REMOVED***orizeRequest.***REMOVED***));
                        localStorage.setItem('databaseId', await encryptionUtils.encrypt(***REMOVED***orizeRequest.databaseId));
                    }
                }

                const aclDTO = (***REMOVED***Response as AuthorizeDbResponse).data.acl;
                if(aclDTO) {
                    console.log('Setting ACL: ', aclDTO);
                    setACL(new KeyACL(aclDTO));
                } else {
                    setACL(null);
                }
                return {
                    success: true,
                    message: ***REMOVED***Response.message,
                    issues: ***REMOVED***Response.issues ? ***REMOVED***Response.issues : []
                }

            } else {
                disableKeepLoggedIn();

                console.error('Error in ***REMOVED***orize: ', ***REMOVED***Response.message);
                setAuthStatus(DatabaseAuthStatus.AuthorizationError);
                return {
                    success: false,
                    message: ***REMOVED***Response.message,
                    issues: ***REMOVED***Response.issues ? ***REMOVED***Response.issues : []
                }
            }
        } else {
            disableKeepLoggedIn();

            toast.error('Error in ***REMOVED***orization challenge. Please try again.');
            console.error('Error in ***REMOVED***orize/challenge: ', ***REMOVED***ChallengResponse.message);
        }

        return {
            success: ***REMOVED***ChallengResponse.status === 200,
            message: ***REMOVED***ChallengResponse.message,
            issues: ***REMOVED***ChallengResponse.issues ? ***REMOVED***ChallengResponse.issues : []
        }        
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
        setAuthStatus,
        accessToken,
        setAccesToken,
        refreshToken,
        setRefreshToken,       
        create,
        ***REMOVED***orize,
        logout,
        refresh,
        keepLoggedIn,
        acl,
        setACL,
        featureFlags
    };

    return (
        <DatabaseContext.Provider value={databaseContextValue}>
            {children}
        </DatabaseContext.Provider>
    );
};

