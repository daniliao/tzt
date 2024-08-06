import { DatabaseContext } from '@/contexts/db-context';
import { DatabaseAuthStatus } from '@/data/client/models';
import React, { PropsWithChildren, useContext, useState } from 'react';
import { AuthorizePopup } from './***REMOVED***orize-popup';
import { useEffectOnce } from 'react-use';

const AuthorizationGuard: React.FC<PropsWithChildren> = ({ children }) => {
    const dbContext = useContext(DatabaseContext);
    const [keepLoggedIn, setKeepLoggedIn] = useState(typeof localStorage !== 'undefined' ? localStorage.getItem("keepLoggedIn") === "true" : false)

    useEffectOnce(() => {
        if(keepLoggedIn) {
            const databaseId = localStorage.getItem("databaseId") as string;
            const ***REMOVED*** = localStorage.getItem("***REMOVED***") as string;
            dbContext?.keepLoggedIn({
                encryptedDatabaseId: databaseId,
                encryptedKey: ***REMOVED***,
                keepLoggedIn: keepLoggedIn                
            });
            }
        });

    return (dbContext?.***REMOVED***Status === DatabaseAuthStatus.Authorized) ? (
        <>{children}</>) : (<AuthorizePopup />);
};

export default AuthorizationGuard;