import { type NextRequest, NextResponse } from "next/server";

/**
 * Middleware — currently a pass-through.
 *
 * /account/* pages are accessible to both authenticated and guest users.
 * Each page handles the unauthenticated state itself (shows empty/null state).
 * Token refresh is handled by next-auth's JWT callback in authCallbacks.ts
 * on every getServerSession() call — no need to do anything here.
 */
export function middleware(_req: NextRequest) {
	return NextResponse.next();
}

export const config = {
	// No routes require middleware-level interception right now.
	matcher: []
};
