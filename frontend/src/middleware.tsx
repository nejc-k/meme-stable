import {NextRequest, NextResponse} from "next/server";
import {authMiddleware} from "./app/middleware/authMiddleware";

/**
 * @description Middleware for the frontend (Next.js documentation states that it should be placed in src/ folder and it
 *              will be automatically detected and processed by Next.js).
 * */
export function middleware(request: NextRequest) {

    // Auth middleware (protected routes)
    const authResponse = authMiddleware(request);
    if (authResponse) return authResponse;

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/generator/create",
        "/generator/edit",
        "/images",
        "/images/:imageId",
        "/profile",
    ]
}