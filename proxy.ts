// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/sign-in(.*)",
//   "/sign-up(.*)",
//   "/pricing",
//   "/api/webhook(.*)",
// ]);

// // const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

// // export default clerkMiddleware(async (auth, req) => {
// //   const { userId } = await auth();

// //   // Allow public routes
// //   if (isPublicRoute(req)) {
// //     return NextResponse.next();
// //   }

// //   // Redirect to sign-in if not authenticated
// //   if (!userId) {
// //     const signInUrl = new URL("/sign-in", req.url);
// //     signInUrl.searchParams.set("redirect_url", req.url);
// //     return NextResponse.redirect(signInUrl);
// //   }

// //   // // Check admin routes
// //   // if (isAdminRoute(req)) {
// //   //   const { sessionClaims } = await auth();
// //   //   const role = sessionClaims?.metadata?.role as string | undefined;

// //   //   if (role !== "admin") {
// //   //     return NextResponse.redirect(new URL("/dashboard", req.url));
// //   //   }
// //   // }

// //   return NextResponse.next();
// // });


// export default clerkMiddleware(async (auth, req) => {
//   const { userId } = await auth();
//   const { pathname } = req.nextUrl;

//   // 🔥 If logged in and hits "/", send to dashboard
//   if (userId && pathname === "/") {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   if (isPublicRoute(req)) {
//     return NextResponse.next();
//   }

//   if (!userId) {
//     const signInUrl = new URL("/sign-in", req.url);
//     signInUrl.searchParams.set("redirect_url", req.url);
//     return NextResponse.redirect(signInUrl);
//   }

//   return NextResponse.next();
// });




// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };



import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/pricing",
  "/api/webhook(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // ✅ If logged-in user tries to access auth pages → redirect to dashboard
  if (userId && (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ✅ Allow public routes for everyone
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // ❌ If not logged in and accessing protected route
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
