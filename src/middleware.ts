import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;

  if (PUBLIC_ROUTES.includes(url)) {
    return NextResponse.next();
  }

  // const credentialCookie = request.cookies.get("Credential")?.value;

  // if (!credentialCookie) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // let credential;
  // try {
  //   credential = JSON.parse(credentialCookie);

  //   const token = credential?.token;
  //   const role = credential?.userData?.role;

  //   if (!token) {
  //     throw new Error('Invalid token');
  //   }

  //   const user = decodeToken(token);
  //   if (!user) {
  //     throw new Error('Invalid user');
  //   }

  //   return NextResponse.next();

  // } catch (error) {
  //   console.error('Middleware error:', error);
  //   const response = NextResponse.redirect(new URL("/login", request.url));
  //   response.cookies.delete("Credential");
  //   return response;
  // }
}

function decodeToken(token: string) {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    return payload;
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
}

export const config = {
  matcher: [
    '/((?!api|_next|fonts|images|[\\w-]+\\.\\w+).*)',
  ],
}