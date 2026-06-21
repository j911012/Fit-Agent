import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const protectedPrefixes = ["/dashboard", "/workouts", "/ai", "/profile"];
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  const isAuthPage = pathname.startsWith("/auth");

  if (isProtected && !isLoggedIn) {
    return Response.redirect(new URL("/auth/login", req.url));
  }

  if (isAuthPage && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/workouts/:path*",
    "/ai/:path*",
    "/profile/:path*",
    "/auth/:path*",
  ],
};
