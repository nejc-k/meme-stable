import {NextRequest, NextResponse} from "next/server";

/**
 * @description Authentication middleware for protected routes. In case of unauthorized access, user will be redirected
 *              to login page
 * @param {NextRequest} request - Request object
 * @returns {NextResponse} - Redirects to login page if user is not authenticated
 * */
export function authMiddleware(request: NextRequest) {
    // connect.sid is the cookie name for the session of the node.js passport
    const token = request.cookies.get("connect.sid");
    const protectedRoutes = [
        "/generator",
        "/generator/*",
        "/images",
        "/profile",
        "/profile/*"
    ];

    const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}