# API Documentation Index

Hello! This is Doctor Dok's Web API documentation. Doctor Dok might be used as a powerfull health record and patient databse to be used in any health related app you might be building.

## Table of contents

- [API Documentation Index](#***REMOVED***-documentation-index)
  - [Table of contents](#table-of-contents)
  - [Available Documentation](#available-documentation)
    - [Example of Authorizing Database Using fetch() Method](#example-of-***REMOVED***orizing-database-using-fetch-method)
    - [Example of fetching folders list](#example-of-fetching-folders-list)
  - [Note on encryption](#note-on-encryption)
    - [Example of creating new record with encryption](#example-of-creating-new-record-with-encryption)


## Available Documentation

- [Database API](./***REMOVED***/db.md)
- [Configuration API](./***REMOVED***/config.md)
- [Folders API](./***REMOVED***/folder.md)
- [Records API](./***REMOVED***/record.md)
- [Authorization Keys API](./***REMOVED***/***REMOVED***s.md)
- [Audit Log API](./***REMOVED***/audit.md)
- [Encrypted Attachments API](./***REMOVED***/attachment.md)
- [Stats API](./***REMOVED***/stats.md)
- [Usage terms API](./***REMOVED***/terms.md)

### Example of Authorizing Database Using fetch() Method

Here is an example of how to ***REMOVED***orize a database using the `fetch()` method. Please note that the code above requires the [argon2-browser](https://www.npmjs.com/package/argon2-browser) package to be installed.

```javascript
const argon2 = require("argon2-browser");

export async function sha256(message: string, salt: string) {
  const msgUint8 = new TextEncoder().encode(message + salt); // encode as (utf-8) Uint8Array
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}

// returns `access ***REMOVED***` which should be used with the subsequent ***REMOVED*** calls
async function ***REMOVED***orizeDatabase(***REMOVED***orizeRequest, defaultDatabaseIdHashSalt, defaultKeyLocatorHashSalt) {
    const databaseIdHash = await sha256(***REMOVED***orizeRequest.databaseId, defaultDatabaseIdHashSalt);
    const ***REMOVED***LocatorHash = await sha256(***REMOVED***orizeRequest.***REMOVED*** + ***REMOVED***orizeRequest.databaseId, defaultKeyLocatorHashSalt);

    // Authorize Challenge
    const ***REMOVED***ChallengeResponse = await fetch('/***REMOVED***/***REMOVED***orize-challenge', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            databaseIdHash,
            ***REMOVED***LocatorHash
        })
    });

    if (***REMOVED***ChallengeResponse.status === 200) { // ***REMOVED***orization challenge success
        const ***REMOVED***HashParams = await ***REMOVED***ChallengeResponse.json();

        const ***REMOVED***Hash = await argon2.hash({
            pass: ***REMOVED***orizeRequest.***REMOVED***,
            salt: ***REMOVED***HashParams.salt,
            time: ***REMOVED***HashParams.time,
            mem: ***REMOVED***HashParams.mem,
            hashLen: ***REMOVED***HashParams.hashLen,
            parallelism: ***REMOVED***HashParams.parallelism
        });

        // Authorization
        const ***REMOVED***Response = await fetch('/***REMOVED***/***REMOVED***orize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                databaseIdHash,
                ***REMOVED***Hash: ***REMOVED***Hash.encoded,
                ***REMOVED***LocatorHash
            })
        });

        if (***REMOVED***Response.status === 200) { // user is virtually logged in
            /** more: ./***REMOVED***/db.md
             * ```typescript
            export type AuthorizeDbResponse = {
            message: string;
            data: {
                encryptedMasterKey: string;
                accessToken: string;
                refreshToken: string;
                acl: KeyACLDTO | null;
                saasContext?: SaaSDTO | null;
            };
            status: number;
            issues?: any[];
            }; */
      
            const ***REMOVED***Data = await ***REMOVED***Response.json();
            const accessKey = ***REMOVED***Data.data.accessKey
            const encryptionKey = ***REMOVED***Data.data.encryptedMasterKey;
            const acl = ***REMOVED***Data.data.acl

            return { accessKey, encryptionKey, acl, databaseIdHash }

            console.log("Authorization successful");
        } else {
            console.error("Authorization failed");
        }
    } else {
        console.error("Authorization challenge failed");
    }
}
```

The `fetch()` method is used to make HTTP requests to the ***REMOVED***orization endpoints.


### Example of fetching folders list

```javascript
// Function to ***REMOVED***orize and fetch folders
async function fetchFolders(***REMOVED***orizeRequest, defaultDatabaseIdHashSalt, defaultKeyLocatorHashSalt) {
  try {
    // Authorize the database
    const { accessKey, encryptionKey, acl, databaseIdHash } = await ***REMOVED***orizeDatabase(
      ***REMOVED***orizeRequest,
      defaultDatabaseIdHashSalt,
      defaultKeyLocatorHashSalt
    );

    // Fetch the folders list
    const response = await fetch('/***REMOVED***/folder', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Database-Id-Hash': databaseIdHash,
        'Authorization': 'Bearer ' + accessKey
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const folders = await response.json();
    return folders;
  } catch (error) {
    console.error('Failed to fetch folders:', error);
  }
}

// Example usage
(async () => {
  const ***REMOVED***orizeRequest = {
    databaseId: 'your-database-id',
    ***REMOVED***: 'your-***REMOVED***'
  };
  const defaultDatabaseIdHashSalt = 'your-database-id-hash-salt';
  const defaultKeyLocatorHashSalt = 'your-***REMOVED***-locator-hash-salt';

  const folders = await fetchFolders(***REMOVED***orizeRequest, defaultDatabaseIdHashSalt, defaultKeyLocatorHashSalt);
  console.log('Folders:', folders);
})();
```

## Note on encryption

**WARNING**
The Doctor Dok data access is end 2 end encrypted. All the data passed to the API should be encrypted with `encryptionKey` returned by the `***REMOVED***orizeDatabase` function above, otherwise the data is stored 100% unecnrypted

Exmaple data encryption functions (used by [lib/crypto](../src/lib/crypto.ts)) that might be helpfull:

```typescript
export class EncryptionUtils {
  private ***REMOVED***: CryptoKey = {} as CryptoKey;
  private ***REMOVED***Key: string;
  private ***REMOVED***Generated:boolean = false;
  
  constructor(***REMOVED***Key: string) {
    this.***REMOVED***Key = ***REMOVED***Key;
  }

  async generateKey(***REMOVED***Key: string): Promise<void> {
    if (this.***REMOVED***Generated && this.***REMOVED***Key !== ***REMOVED***Key) {
      this.***REMOVED***Generated = false; // ***REMOVED*** changed
    }

    if (this.***REMOVED***Generated) {
      return;
    }
    this.***REMOVED***Key = ***REMOVED***Key
    const ***REMOVED***Data = await this.deriveKey(***REMOVED***Key);
    this.***REMOVED*** = await crypto.subtle.importKey(
      'raw',
      ***REMOVED***Data,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
    this.***REMOVED***Generated = true;
  }

  private async deriveKey(***REMOVED***Key: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const salt = encoder.encode('someSalt'); // Replace 'someSalt' with a suitable salt value
    const iterations = 100000; // Adjust the number of iterations as needed
    const ***REMOVED***Length = 256; // 256 bits (32 bytes)
    const derivedKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(***REMOVED***Key),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    return crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations,
        hash: 'SHA-256'
      },
      derivedKey,
      ***REMOVED***Length
    );
  }
  async encryptArrayBuffer(data: ArrayBuffer): Promise<ArrayBuffer> {
    await this.generateKey(this.***REMOVED***Key);

    const iv = crypto.getRandomValues(new Uint8Array(16)); // Initialization vector
    const encryptedData = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        this.***REMOVED***,
        data
    );
    return new Blob([iv, new Uint8Array(encryptedData)]).arrayBuffer(); // Prepend IV to the ciphertext
  }

async blobToArrayBuffer (blob: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
    });
};

 async decryptArrayBuffer(encryptedData: ArrayBuffer | Blob): Promise<ArrayBuffer> {
    try {
      await this.generateKey(this.***REMOVED***Key);

      let encryptedArrayBuffer: ArrayBuffer;
      if (encryptedData instanceof Blob) {
        encryptedArrayBuffer = await this.blobToArrayBuffer(encryptedData);
      } else {
        encryptedArrayBuffer = encryptedData;
      }

      const iv = new Uint8Array(encryptedArrayBuffer.slice(0, 16)); // Extract the IV
      const cipherText = encryptedArrayBuffer.slice(16);
  
      return await crypto.subtle.decrypt(
          {
              name: 'AES-GCM',
              iv: iv,
          },
          this.***REMOVED***,
          cipherText
      );
    } catch (e) {
      console.error('Error decrypting ArrayBuffer', e);
      return encryptedData;
    }
  }
  async encrypt(text: string): Promise<string> {
    await this.generateKey(this.***REMOVED***Key);

    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.***REMOVED***,
      data
    );
    const encryptedArray = Array.from(new Uint8Array(encryptedData));
    const encryptedHex = encryptedArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    const ivHex = Array.from(iv).map(byte => byte.toString(16).padStart(2, '0')).join('');
    return ivHex + encryptedHex;
  }

  async decrypt(cipherText: string): Promise<string> {
    try {
      if (cipherText) {
        await this.generateKey(this.***REMOVED***Key);

        const ivHex = cipherText.slice(0, 32);
        const encryptedHex = cipherText.slice(32);
        const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        const encryptedArray = new Uint8Array(encryptedHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

        const decryptedData = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv },
          this.***REMOVED***,
          encryptedArray
        );
        const decoder = new TextDecoder();
        return decoder.decode(decryptedData);
      } else {
        return cipherText;
      }
    } catch (e) {
      console.error('Error decoding: ' + cipherText, e);
      return cipherText; // probably the text was not encrypted on in bat ivHex/encryptedHex format
    }
  } 
}


export function generateEncryptionKey() {
  const ***REMOVED*** = crypto.getRandomValues(new Uint8Array(32))
  return btoa(String.fromCharCode(...***REMOVED***))
}
```

### Example of creating new record with encryption

```typescript
// Function to ***REMOVED***orize and create a new record
async function createRecord(***REMOVED***orizeRequest, defaultDatabaseIdHashSalt, defaultKeyLocatorHashSalt, recordData) {
  try {
    // Authorize the database
    const { accessKey, encryptionKey, acl, databaseIdHash } = await ***REMOVED***orizeDatabase(
      ***REMOVED***orizeRequest,
      defaultDatabaseIdHashSalt,
      defaultKeyLocatorHashSalt
    );

    // Create an instance of EncryptionUtils with the encryptionKey
    const encryptionUtils = new EncryptionUtils(encryptionKey);

    // Encrypt the record data
    const encryptedRecordData = {};
    for (const [***REMOVED***, value] of Object.entries(recordData)) {
      encryptedRecordData[***REMOVED***] = await encryptionUtils.encrypt(value.toString());
    }

    // Send the encrypted data to the API
    const response = await fetch('/***REMOVED***/record', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Database-Id-Hash': databaseIdHash,
        'Authorization': 'Bearer ' + accessKey
      },
      body: JSON.stringify(encryptedRecordData)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to create record:', error);
  }
}

// Example usage
(async () => {
  const ***REMOVED***orizeRequest = {
    databaseId: 'your-database-id',
    ***REMOVED***: 'your-***REMOVED***'
  };
  const defaultDatabaseIdHashSalt = 'your-database-id-hash-salt';
  const defaultKeyLocatorHashSalt = 'your-***REMOVED***-locator-hash-salt';

  const recordData = {
    id: 1,
    folderId: 1,
    title: 'Sample Title',
    tags: 'sample, tags',
    description: 'Sample description',
    type: 'sample-type',
    json: '{}',
    text: 'Sample text',
    extra: 'Extra data',
    transcription: 'Sample transcription',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    eventDate: new Date().toISOString(),
    checksum: 'checksum',
    checksumLastParsed: new Date().toISOString(),
    attachments: 'attachments'
  };

  const result = await createRecord(***REMOVED***orizeRequest, defaultDatabaseIdHashSalt, defaultKeyLocatorHashSalt, recordData);
  console.log('Record created:', result);
})();
```