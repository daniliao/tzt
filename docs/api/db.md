### REST API Documentation for DbApiClient

This documentation is based on the `DbApiClient` class defined in `src/data/client/db-***REMOVED***-client.ts`.

This is an implementation of [Application Security Archirecture](https://github.com/CatchTheTornado/doctor-dok/issues/65)

#### POST `/***REMOVED***/db/create`

Creates a new database.

- **Request Body**: 
  - `DatabaseCreateRequestDTO`: Data required to create a new database.
- **Response**:
  - **Success** (`200 OK`):
    - `CreateDbResponse`: Contains a message, the database ID hash, and a status code. Optional issues.

```typescript
async create(createRequest: DatabaseCreateRequestDTO): Promise<CreateDbResponse> {
  return this.request<CreateDbResponse>('/***REMOVED***/db/create', 'POST', { ecnryptedFields: [] }, createRequest) as Promise<CreateDbResponse>;
}
```

#### POST `/***REMOVED***/db/challenge`

Authorizes a challenge for database access.

- **Request Body**:
  - `DatabaseAuthorizeChallengeRequestDTO`: Data required to ***REMOVED***orize a challenge.
- **Response**:
  - **Success** (`200 OK`):
    - `AuthorizeDbChallengeResponse`: Contains a message, optional ***REMOVED*** hash parameters, and a status code. Optional issues.

```typescript
async ***REMOVED***orizeChallenge(***REMOVED***orizeChallengeRequest: DatabaseAuthorizeChallengeRequestDTO): Promise<AuthorizeDbChallengeResponse> {
  return this.request<AuthorizeDbChallengeResponse>('/***REMOVED***/db/challenge?databaseIdHash=' + encodeURIComponent(***REMOVED***orizeChallengeRequest.databaseIdHash), 'POST', { ecnryptedFields: [] }, ***REMOVED***orizeChallengeRequest) as Promise<AuthorizeDbChallengeResponse>;
}
```

#### POST `/***REMOVED***/db/***REMOVED***orize`

Authorizes access to the database.

- **Request Body**:
  - `DatabaseAuthorizeRequestDTO`: Data required to ***REMOVED***orize access.
- **Response**:
  - **Success** (`200 OK`):
    - `AuthorizeDbResponse`: Contains a message, encrypted master ***REMOVED***, access ***REMOVED***, refresh ***REMOVED***, ACL, optional SaaS context, and a status code. Optional issues.

```typescript
async ***REMOVED***orize(***REMOVED***orizeRequest: DatabaseAuthorizeRequestDTO): Promise<AuthorizeDbResponse> {
  return this.request<AuthorizeDbResponse>('/***REMOVED***/db/***REMOVED***orize?databaseIdHash=' + encodeURIComponent(***REMOVED***orizeRequest.databaseIdHash), 'POST', { ecnryptedFields: [] }, ***REMOVED***orizeRequest) as Promise<AuthorizeDbResponse>;
}
```

#### POST `/***REMOVED***/db/refresh`

Refreshes the database access ***REMOVED***.

- **Request Body**:
  - `DatabaseRefreshRequestDTO`: Data required to refresh the access ***REMOVED***.
- **Response**:
  - **Success** (`200 OK`):
    - `RefreshDbResponse`: Contains a message, new access ***REMOVED***, refresh ***REMOVED***, and a status code. Optional issues.

```typescript
async refresh(refreshRequest: DatabaseRefreshRequestDTO): Promise<RefreshDbResponse> {
  return this.request<AuthorizeDbResponse>('/***REMOVED***/db/refresh', 'POST', { ecnryptedFields: [] }, refreshRequest) as Promise<AuthorizeDbResponse>;
}
```

### Data Structures

#### DatabaseCreateRequestDTO

Represents the data required to create a new database.

```typescript
export interface DatabaseCreateRequestDTO {
  databaseName: string;
  encryptionKey: string;
}
```

#### DatabaseAuthorizeChallengeRequestDTO

Represents the data required to ***REMOVED***orize a challenge for database access.

```typescript
export interface DatabaseAuthorizeChallengeRequestDTO {
  databaseIdHash: string;
}
```

#### DatabaseAuthorizeRequestDTO

Represents the data required to ***REMOVED***orize access to the database.

```typescript
export interface DatabaseAuthorizeRequestDTO {
  databaseIdHash: string;
  ***REMOVED***HashParams: KeyHashParamsDTO;
}
```

#### DatabaseRefreshRequestDTO

Represents the data required to refresh the database access ***REMOVED***.

```typescript
export interface DatabaseRefreshRequestDTO {
  refreshToken: string;
}
```

#### KeyHashParamsDTO

Represents ***REMOVED*** hash parameters.

```typescript
export interface KeyHashParamsDTO {
  ***REMOVED***: string;
  salt: string;
}
```

#### KeyACLDTO

Represents the Access Control List (ACL) for a ***REMOVED***.

```typescript
export interface KeyACLDTO {
  role: string;
  features: string[];
}
```

#### SaaSDTO

Represents the SaaS context.

```typescript
export interface SaaSDTO {
  currentQuota: {
    allowedDatabases: number;
    allowedUSDBudget: number;
    allowedTokenBudget: number;
  };
  currentUsage: {
    usedDatabases: number;
    usedUSDBudget: number;
    usedTokenBudget: number;
  };
  email?: string;
  userId?: string;
  saasToken: string;
}
```

#### CreateDbResponse

Represents the response for creating a new database.

```typescript
export type CreateDbResponse = {
  message: string;
  data: {
    databaseIdHash: string;
  };
  status: number;
  issues?: any[];
};
```

#### AuthorizeDbChallengeResponse

Represents the response for ***REMOVED***orizing a challenge.

```typescript
export type AuthorizeDbChallengeResponse = {
  message: string;
  data?: KeyHashParamsDTO;
  status: number;
  issues?: any[];
};
```

#### AuthorizeDbResponse

Represents the response for ***REMOVED***orizing database access.

```typescript
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
};
```

#### RefreshDbResponse

Represents the response for refreshing the database access ***REMOVED***.

```typescript
export type RefreshDbResponse = {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  status: number;
  issues?: any[];
};
```

For more details, see the [source code](https://github.com/CatchTheTornado/doctor-dok/blob/main/src/data/client/db-***REMOVED***-client.ts).

