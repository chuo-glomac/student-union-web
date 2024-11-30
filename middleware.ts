import { NextResponse, NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { defaultLocale, locales } from "@/utils/variable";

function getLocale(request: NextRequest) {
  const negotiator = new Negotiator({
    headers: {
      "accept-language": request.headers.get("accept-language") || "",
    },
  });
  const languages = negotiator.languages();
  return match(languages, locales, defaultLocale);
}

// export async function middleware(request: NextRequest) {
//   const { pathname, search } = request.nextUrl;
//   const sessionResponse = await updateSession(request);
//   if (sessionResponse) return sessionResponse;

//   const pathnameHasLocale = locales.some(
//     (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
//   );
//   if (pathnameHasLocale) return NextResponse.next();

//   const locale = getLocale(request);
//   request.nextUrl.pathname = `/${locale}${pathname}${search}`;

//   return NextResponse.redirect(request.nextUrl);
// }

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    request.nextUrl.search = search

    return NextResponse.redirect(request.nextUrl);
  }

  const sessionResponse = await updateSession(request);
  if (sessionResponse) return sessionResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - API routes (/api/)
     * - Common static files (.png, .jpg, etc.)
     */
    // "/((?!_next).*)",
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
