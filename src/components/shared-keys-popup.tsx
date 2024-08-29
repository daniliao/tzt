import { useContext, useEffect, useState } from "react";
import FolderItem from "./folder-item";
import { FolderContext } from "@/contexts/folder-context";
import { DatabaseAuthStatus, DataLoadingStatus } from "@/data/client/models";
import DataLoader from "./data-loader";
import { ConfigContext } from "@/contexts/config-context";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ListIcon, PlusIcon, Share2Icon, Terminal } from "lucide-react";
import { Credenza, CredenzaContent, CredenzaDescription, CredenzaHeader, CredenzaTitle, CredenzaTrigger } from "./credenza";
import { Button } from "./ui/button";
import DatabaseLinkAlert from "./shared/database-link-alert";
import { FolderEditPopup } from "./folder-edit-popup";
import { NoRecordsAlert } from "./shared/no-records-alert";
import { DatabaseContext } from "@/contexts/db-context";
import { KeyContext, KeyContextProvider } from "@/contexts/***REMOVED***-context";
import SharedKeyItem from "./shared-***REMOVED***-item";
import { SharedKeyEditPopup } from "./shared-***REMOVED***-edit-popup";

export default function SharedKeysPopup() {
  const configContext = useContext(ConfigContext);
  const dbContext = useContext(DatabaseContext);
  const ***REMOVED***sContext = useContext(KeyContext);

  useEffect(() => {
    ***REMOVED***sContext?.loadKeys();
  }, []);

  return (
    <Credenza open={***REMOVED***sContext.sharedKeysDialogOpen} onOpenChange={***REMOVED***sContext.setSharedKeysDialogOpen}>
      <CredenzaContent className="sm:max-w-[500px] bg-white dark:bg-zinc-950" side="top">
        <CredenzaHeader>
          <CredenzaTitle>Shared ***REMOVED***s
            {(dbContext?.***REMOVED***Status == DatabaseAuthStatus.Authorized) ? (
              <SharedKeyEditPopup />
            ) : (null)}
          </CredenzaTitle>
          <CredenzaDescription>
            Shared Keys let other users access your database. <br />You can revoke access at any time.
          </CredenzaDescription>
        </CredenzaHeader>
        <div className="bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
          <div className="h-auto overflow-auto">
            {(dbContext?.***REMOVED***Status == DatabaseAuthStatus.Authorized) ? (
              <div className="p-4 space-y-4">
                {***REMOVED***sContext?.loaderStatus === DataLoadingStatus.Loading ? (
                  <div className="flex justify-center">
                    <DataLoader />
                  </div>
                ) : (
                  (***REMOVED***sContext?.***REMOVED***s.length > 0) ?
                    ***REMOVED***sContext?.***REMOVED***s.map((***REMOVED***, index) => (
                      <SharedKeyItem onClick={(e) => {}} ***REMOVED***={index} sharedKey={***REMOVED***} selected={***REMOVED***sContext?.currentKey?.***REMOVED***LocatorHash === ***REMOVED***.***REMOVED***LocatorHash} />
                    ))
                    : (
                      <NoRecordsAlert title="Data is not shared">
                        No Shared Keys found in the database. Please add a new Shared Key using <strong>+</strong> icon above.
                      </NoRecordsAlert>
                    )
                )}
              </div>
            ) : (
              <DatabaseLinkAlert />
            )}
          </div>
        </div>
      </CredenzaContent>
    </Credenza>
  );
}