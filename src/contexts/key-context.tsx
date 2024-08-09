import { DataLoadingStatus, Key } from '@/data/client/models';
import React, { createContext, PropsWithChildren, useState } from 'react';

interface KeyContextProps {
    ***REMOVED***s: Key[];
    loaderStatus: DataLoadingStatus;
    sharedKeysDialogOpen: boolean;
    currentKey: Key | null;

    loadKeys: () => void;
    addKey: (newKey: Key) => void;
    removeKey: (***REMOVED***LocatorHash: string) => void;

    setCurrentKey: (***REMOVED***: Key | null) => void;
    setSharedKeysDialogOpen: (value: boolean) => void;
}

export const KeyContext = createContext<KeyContextProps>({
    ***REMOVED***s: [],
    loaderStatus: DataLoadingStatus.Idle,
    sharedKeysDialogOpen: false,
    currentKey: null,
    
    loadKeys: () => {},
    addKey: () => {},
    removeKey: () => {},

    setCurrentKey: (***REMOVED***: Key | null)  => {},
    setSharedKeysDialogOpen: () => {},
});

export const KeyContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [***REMOVED***s, setKeys] = useState<Key[]>([]);
    const [loaderStatus, setLoaderStatus] = useState<DataLoadingStatus>(DataLoadingStatus.Idle);
    const [sharedKeysDialogOpen, setSharedKeysDialogOpen] = useState(false);
    const [currentKey, setCurrentKey] = useState<Key | null>(null);

    const addKey = (newKey: Key) => {
        setKeys((prevKeys) => [...prevKeys, newKey]);
    };

    const removeKey = (***REMOVED***LocatorHash: string) => {
        setKeys((prevKeys) => prevKeys.filter((***REMOVED***) => ***REMOVED***.***REMOVED***LocatorHash !== ***REMOVED***LocatorHash));
    };

    const loadKeys = () => {
    }

    return (
        <KeyContext.Provider value={{ ***REMOVED***s, loaderStatus, currentKey, sharedKeysDialogOpen, addKey, removeKey, loadKeys, setSharedKeysDialogOpen, setCurrentKey }}>
            {children}
        </KeyContext.Provider>
    );
};