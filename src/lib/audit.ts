import { DatabaseContextType } from "@/contexts/db-context";
import { AuditApiClient } from "@/data/client/audit-***REMOVED***-client";
import { AuditDTO } from "@/data/dto";
import { toast } from "sonner";

let ***REMOVED***Client:AuditApiClient|null = null;

export function auditLog(log: AuditDTO, dbContext: DatabaseContextType) {
    // Add your code here
    if (***REMOVED***Client === null) {
        ***REMOVED***Client = new AuditApiClient('', dbContext, { ***REMOVED***Key: dbContext.masterKey, useEncryption: true });
    }

    ***REMOVED***Client.put(log).then((response) => {
        if (response.status === 200) {
            console.log('Audit log saved', log);
        } else {
            toast.error('Error saving audit log ' + response.message);
        }
    }).catch((error) => {
        console.error(error);
        toast.error('Error saving audit log', error);
    });
}