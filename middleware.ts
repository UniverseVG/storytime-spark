import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/create(.*)"]);
const isClerkWebhook = createRouteMatcher(["/api/clerk-webhook(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isClerkWebhook(req)) {
    return NextResponse.next();
  }

  if (isProtectedRoute(req)) {
    return auth.protect().then(() => NextResponse.next());
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
