import {NextRequest, NextResponse} from "next/server";
import {authMiddleware} from "./app/middleware/authMiddleware";

export function middleware(request: NextRequest) {
    // Auth middleware
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