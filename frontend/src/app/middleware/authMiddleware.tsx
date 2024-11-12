import {NextRequest, NextResponse} from "next/server";

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