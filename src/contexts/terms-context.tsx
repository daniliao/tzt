import { DataLoadingStatus } from '@/data/client/models';
import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { DatabaseContext } from './db-context';
import { toast } from 'sonner';
import { ConfigContextType } from '@/contexts/config-context';
import { TermApiClient } from '@/data/client/term-***REMOVED***-client';
import { TermDTO } from '@/data/dto';
import { sha256 } from '@/lib/crypto';
import { SaaSContext } from './saas-context';
const argon2 = require("argon2-browser");

interface TermsContextProps {
    terms: TermDTO[];
    loaderStatus: DataLoadingStatus;
    loadTerms: () => Promise<TermDTO[]>;
    termsOpen: boolean;
    termsRequired: boolean;
    setTermsRequired: (value: boolean) => void;
    setTermsDialogOpen: (value: boolean) => void;
    sign: (term: TermDTO) => Promise<void>;
}

export const TermsContext = createContext<TermsContextProps>({
    terms: [],
    loaderStatus: DataLoadingStatus.Idle,
    loadTerms: async () => Promise.resolve([]),
    termsOpen: false,
    termsRequired: false,
    setTermsDialogOpen: () => {},
    setTermsRequired: () => {},
    sign: async (term: TermDTO) => Promise.resolve()
});

export const TermsContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [termsOpen, setTermsDialogOpen] = useState(false);
    const [terms, setTerms] = useState<TermDTO[]>([]);
    const [loaderStatus, setLoaderStatus] = useState<DataLoadingStatus>(DataLoadingStatus.Idle);
    const [termsRequired, setTermsRequired] = useState(false);
    const dbContext = useContext(DatabaseContext);
    const saasContext = useContext(SaaSContext);

    const setupApiClient = async (config: ConfigContextType | null) => {
        const client = new TermApiClient('', dbContext, saasContext, { ***REMOVED***Key: dbContext?.masterKey, useEncryption: true });
        return client;
    }

    const sign = async (term: TermDTO) => {
        const ***REMOVED***Client = await setupApiClient(null);

        term.***REMOVED*** = term.code + dbContext?.***REMOVED***LocatorHash;
        term.signature = await sha256(term.content + dbContext?.***REMOVED***LocatorHash, dbContext?.encryptionKey ?? '');
        ***REMOVED***Client.put(term).then((response) => {
            setTerms(terms.find((t) => t.***REMOVED*** === term.***REMOVED***) ? terms.map((t) => t.***REMOVED*** === term.***REMOVED*** ? term : t) : [...terms, term]);
            if (response.status === 200) {
                console.log('Term signed', term);
            } else {
                toast.error('Error saving term' + response.message);
            }
        }).catch((error) => {
            console.error(error);
            toast.error('Error signing term', error);
        });        
    }

    const loadTerms = async () => {
        setLoaderStatus(DataLoadingStatus.Loading);
        const client = await setupApiClient(null);
        const terms = await client.get();
        setTerms(terms.filter((term) => term.***REMOVED***?.endsWith(dbContext?.***REMOVED***LocatorHash ?? '')));
        setLoaderStatus(DataLoadingStatus.Success);
        return terms;
    }


    return (
        <TermsContext.Provider value={{ 
            terms,
            loaderStatus,
            loadTerms,
            termsOpen,
            setTermsDialogOpen,
            termsRequired,
            setTermsRequired,
            sign
         }}>
            {children}
        </TermsContext.Provider>
    );
};