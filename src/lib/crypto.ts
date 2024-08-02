import { DTOEncryptionSettings } from "@/data/dto";

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
      { name: 'AES-CBC' },
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
            name: 'AES-CBC',
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
              name: 'AES-CBC',
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
      { name: 'AES-CBC', iv },
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
          { name: 'AES-CBC', iv },
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

export class DTOEncryptionFilter<T> {
    private utils: EncryptionUtils;
  
    constructor(***REMOVED***Key: string) {
      this.utils = new EncryptionUtils(***REMOVED***Key);
    }
  
    async encrypt(dto: T, encryptionSettings?: DTOEncryptionSettings): Promise<T> {
      return this.process(dto, encryptionSettings, async (value) => {
        if (value) {
          if (typeof value === 'object') {
            if(value instanceof Date) {
              value = (value as Date).toISOString();
            }
            return 'json-' + await this.utils.encrypt(JSON.stringify(value));
          }
          return await this.utils.encrypt(value);
        } else 
        {
          return value;
        }
      });
    }
    
    async decrypt(dto: T, encryptionSettings?: DTOEncryptionSettings): Promise<T> {
      return this.process(dto, encryptionSettings, async (value) => {
        if (value) {
          if (typeof value === 'string' && value.startsWith('json-')) {
            return JSON.parse(await this.utils.decrypt(value.slice(5)));
          }
          return await this.utils.decrypt(value);
        } else 
        {
          return value;
        }
      });
    }
  
    private async process(dto: T, encryptionSettings?: DTOEncryptionSettings, processFn: (value: string) => Promise<string>): T {
      const result = {} as T;
      for (const ***REMOVED*** in dto) {
        if ((encryptionSettings && encryptionSettings.ecnryptedFields.indexOf(***REMOVED***) >=0) || (!encryptionSettings && (typeof dto[***REMOVED***] === 'string' || typeof dto[***REMOVED***] === 'object'))) {
          result[***REMOVED***] = await processFn(dto[***REMOVED***] as string);
        } else {
          result[***REMOVED***] = dto[***REMOVED***];
        }
      }
      return result;
    }
  }

  export async function sha256(message: string, salt: string) {
    const msgUint8 = new TextEncoder().encode(message + salt); // encode as (utf-8) Uint8Array
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""); // convert bytes to hex string
    return hashHex;
  }
