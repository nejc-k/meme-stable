import {NextRequest, NextResponse} from "next/server";

export function authMiddleware(request: NextRequest) {
    // TODO: Check token name when backend is ready
    const token = request.cookies.get("token");
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