import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];
const VERIFY_ROUTES = ["/verify-your-account", "/verify-email"];

const PROTECTED_ROUTES = ["/dashboard"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("accessToken")?.value;
  const verificationToken = req.cookies.get("verificationToken")?.value;

  const isLoggedIn = !!accessToken;
  const hasVerificationSession = !!verificationToken;

  // 1. Protect private routes
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  //  2. Block auth pages if already logged in
  if (PUBLIC_ROUTES.includes(pathname)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // 3. Handle verify-your-account page
  if (pathname === "/verify-your-account") {
    // no verification session → go login
    if (!hasVerificationSession) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // already logged in → go dashboard
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // 4. Handle verify-email page (token link)
  if (pathname === "/verify-email") {
    const token = req.nextUrl.searchParams.get("token");
    const tokenId = req.nextUrl.searchParams.get("tokenId");

    // invalid link → redirect
    if (!token || !tokenId) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // already logged in → skip verification
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}
