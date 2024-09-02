import { NextResponse, type NextRequest } from 'next/server'
import {SignJWT, jwtVerify, type JWTPayload} from 'jose'

export async function middleware(request: NextRequest) {
    const ***REMOVED***orizationHeader = request.headers.get('Authorization');
    const jwtToken = ***REMOVED***orizationHeader?.replace('Bearer ', '');

    if (!jwtToken) {
        return NextResponse.json({ message: 'Un***REMOVED***orized', status: 401 }, { status: 401 });
    } else {
        try {
            const decoded = await jwtVerify(jwtToken, new TextEncoder().encode(process.env.NEXT_PUBLIC_TOKEN_SECRET || 'Jeipho7ahchue4ahhohsoo3jahmui6Ap'));
            const checkDbHeader = request.headers.get('database-id-hash') === decoded.payload.databaseIdHash;

            if(!checkDbHeader) {
                return NextResponse.json({ message: 'Un***REMOVED***orized', status: 401 }, { status: 401 });
            }

        } catch (error) {
            console.log(error);
            return NextResponse.json({ message: 'Un***REMOVED***orized', status: 401 }, { status: 401 });
        }

    }

    return NextResponse.next();
}
 
export const config = {
  matcher: ['/((?!***REMOVED***/db|_next/static|content|_next/image|img|manifest|favicon.ico|$).*)'],
}