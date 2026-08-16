import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { collapseDuplicateBlogPrefix } from "@/lib/normalize-internal-href";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const fixed = collapseDuplicateBlogPrefix(pathname);

  if (fixed !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = fixed;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/blog/:path*"],
};
