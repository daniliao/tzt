import { DatabaseContext } from '@/contexts/db-context';
import { DatabaseAuthStatus } from '@/data/client/models';
import React, { useContext, useState } from 'react';
import { AuthorizePopup } from './***REMOVED***orize-popup';
import { useEffectOnce } from 'react-use';

const AuthorizationGuard: React.FC<AuthorizationGuardProps> = ({ ***REMOVED***orized, children }) => {
    const dbContext = useContext(DatabaseContext);
    const [keepLoggedIn, setKeepLoggedIn] = useState(typeof localStorage !== 'undefined' ? localStorage.getItem("keepLoggedIn") === "true" : false)

    useEffectOnce(() => {
        if(keepLoggedIn) {
            const databaseId = localStorage.getItem("databaseId");
            const ***REMOVED*** = localStorage.getItem("***REMOVED***");
            if(databaseId && ***REMOVED***) {
            dbContext?.***REMOVED***orize({
                databaseId: databaseId,
                ***REMOVED***: ***REMOVED***
            });
            }
        }
    });

    return (dbContext?.***REMOVED***Status === DatabaseAuthStatus.Authorized) ? (
        <>{children}</>) : (<AuthorizePopup />);
};

export default AuthorizationGuard;