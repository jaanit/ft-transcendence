import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import axios, { AxiosResponse } from "axios";

export async function middleware(request: NextRequest, res: NextResponse) {
  const jwtCookie = request.cookies.get("token")?.value;
  if (!jwtCookie) {
    if (request.nextUrl.pathname === "/login") return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url).toString());
  }
  if (request.nextUrl.pathname === "/login") {
    const response = NextResponse.redirect(
      new URL("/login", request.url).toString()
    );
    response.cookies.delete("token");
    return response;
  }
  if (request.nextUrl.pathname === "/rank")
    return NextResponse.redirect(new URL("/Rank", request.url).toString());
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|tfa).*)"],
};
