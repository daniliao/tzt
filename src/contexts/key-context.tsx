import { Key } from '@/data/client/models';
import React, { createContext, useState } from 'react';

interface KeyContextProps {
    ***REMOVED***s: Key[];
    addKey: (newKey: Key) => void;
    removeKey: (***REMOVED***LocatorHash: string) => void;
}

export const KeyContext = createContext<KeyContextProps>({
    ***REMOVED***s: [],
    addKey: () => {},
    removeKey: () => {},
});

export const KeyProvider: React.FC = ({ children }) => {
    const [***REMOVED***s, setKeys] = useState<Key[]>([]);

    const addKey = (newKey: Key) => {
        setKeys((prevKeys) => [...prevKeys, newKey]);
    };

    const removeKey = (***REMOVED***LocatorHash: string) => {
        setKeys((prevKeys) => prevKeys.filter((***REMOVED***) => ***REMOVED***.***REMOVED***LocatorHash !== ***REMOVED***LocatorHash));
    };

    return (
        <KeyContext.Provider value={{ ***REMOVED***s, addKey, removeKey }}>
            {children}
        </KeyContext.Provider>
    );
};