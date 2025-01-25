/*
<ai_context>
Contains middleware for protecting routes, checking user authentication, and redirecting as needed.
</ai_context>
*/

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher(["/", "/login(.*)", "/signup(.*)", "/subscribe"])

export default clerkMiddleware(async (auth, req) => {
  // Skip auth for webhook
  if (req.url.includes("/api/stripe/webhook")) {
    return NextResponse.next()
  }

  const { userId } = await auth()
  
  if (!userId && !isPublicRoute(req)) {
    const loginUrl = new URL("/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"]
}
