### REST API Documentation for KeyApiClient

This documentation is based on the `KeyApiClient` class defined in `src/data/client/***REMOVED***-***REMOVED***-client.ts`.

#### GET `/***REMOVED***/***REMOVED***s`

Fetches all ***REMOVED***s.

- **Request Parameters**: None
- **Response**:
  - **Success** (`200 OK`):
    - Returns an array of `KeyDTO` objects representing the ***REMOVED***s.

```typescript
async get(): Promise<KeyDTO[]> {
  return this.request<KeyDTO[]>('/***REMOVED***/***REMOVED***s', 'GET', { ecnryptedFields: [] }) as Promise<KeyDTO[]>;
}
```

#### PUT `/***REMOVED***/***REMOVED***s`

Updates a ***REMOVED***.

- **Request Body**: 
  - `PutKeyRequest`: A `KeyDTO` object representing the ***REMOVED*** to be updated.
- **Response**:
  - **Success** (`200 OK`):
    - `PutKeyResponseSuccess`: Contains a message, the updated `KeyDTO` object, and a status code.
  - **Error** (`400 Bad Request`):
    - `PutKeyResponseError`: Contains an error message, status code, and optional issues.

```typescript
async put(***REMOVED***: PutKeyRequest): Promise<PutKeyResponse> {
  return this.request<PutKeyResponse>('/***REMOVED***/***REMOVED***s', 'PUT', { ecnryptedFields: [] }, ***REMOVED***) as Promise<PutKeyResponse>;
}
```

#### DELETE `/***REMOVED***/***REMOVED***s/{***REMOVED***LocatorHash}`

Deletes a ***REMOVED***.

- **Request Parameters**:
  - `***REMOVED***LocatorHash` (Path): The locator hash of the ***REMOVED*** to be deleted.
- **Response**:
  - **Success** (`200 OK`):
    - `PutKeyResponseSuccess`: Contains a message and a status code.
  - **Error** (`400 Bad Request`):
    - `PutKeyResponseError`: Contains an error message, status code, and optional issues.

```typescript
async delete(***REMOVED***LocatorHash: string): Promise<PutKeyResponse> {
  return this.request<PutKeyResponse>('/***REMOVED***/***REMOVED***s/' + ***REMOVED***LocatorHash, 'DELETE', { ecnryptedFields: [] }) as Promise<PutKeyResponse>;
}
```

### Data Structures

#### KeyDTO

Represents a ***REMOVED*** in the system.

```typescript
export interface KeyDTO {
  id: number;
  name: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}
```

#### PutKeyRequest

A `KeyDTO` object representing the ***REMOVED*** to be updated.

```typescript
export type PutKeyRequest = KeyDTO;
```

#### PutKeyResponseSuccess

Represents a successful response for updating a ***REMOVED***.

```typescript
export type PutKeyResponseSuccess = {
  message: string;
  data: KeyDTO;
  status: 200;
};
```

#### PutKeyResponseError

Represents an error response for updating a ***REMOVED***.

```typescript
export type PutKeyResponseError = {
  message: string;
  status: 400;
  issues?: ZodIssue[];
};
```

#### PutKeyResponse

A union type of `PutKeyResponseSuccess` and `PutKeyResponseError`.

```typescript
export type PutKeyResponse = PutKeyResponseSuccess | PutKeyResponseError;
```

For more details, see the [source code](https://github.com/CatchTheTornado/doctor-dok/blob/main/src/data/client/***REMOVED***-***REMOVED***-client.ts).