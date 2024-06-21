import * as CryptoJS from 'crypto-js';

export class EncryptionUtils {
  private ***REMOVED***: CryptoJS.lib.WordArray;

  constructor(***REMOVED***Key: string) {
    this.***REMOVED*** = CryptoJS.enc.Utf8.parse(***REMOVED***Key);
  }

  encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.***REMOVED***).toString();
  }

  decrypt(cipherText: string): string {
    const bytes = CryptoJS.AES.decrypt(cipherText, this.***REMOVED***);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}

export class DTOEncryptionFilter<T> {
    private utils: EncryptionUtils;
  
    constructor(***REMOVED***Key: string) {
      this.utils = new EncryptionUtils(***REMOVED***Key);
    }
  
    encrypt(dto: T): T {
      return this.process(dto, (value) => {
        if (typeof value === 'object') {
          return 'json-' + this.utils.encrypt(JSON.stringify(value));
        }
        return this.utils.encrypt(value);
      });
    }
  
    decrypt(dto: T): T {
      return this.process(dto, (value) => {
        if (value.startsWith('json-')) {
          return JSON.parse(this.utils.decrypt(value.slice(5)));
        }
        return this.utils.decrypt(value);
      });
    }
  
    private process(dto: T, processFn: (value: string) => string): T {
      const result = {} as T;
      for (const ***REMOVED*** in dto) {
        if (typeof dto[***REMOVED***] === 'string' || typeof dto[***REMOVED***] === 'object') {
          result[***REMOVED***] = processFn(dto[***REMOVED***] as unknown as string);
        } else {
          result[***REMOVED***] = dto[***REMOVED***];
        }
      }
      return result;
    }
  }