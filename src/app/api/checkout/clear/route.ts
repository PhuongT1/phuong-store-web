import { type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CONFIG } from "@/config/config";

/**
 * GET /api/checkout/clear?next=/some/path
 *
 * Deletes the stale checkoutId cookie and redirects back.
 * Must be a Route Handler — cookie mutations are not allowed
 * in Server Component render functions (Next.js 15 App Router).
 */
export async function GET(request: NextRequest) {
	const rawNext = request.nextUrl.searchParams.get("next") ?? "/";
	// Prevent open-redirect: only allow internal paths
	const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

	const cookieStore = await cookies();
	cookieStore.delete(CONFIG.COOKIE_KEY.checkoutId);

	redirect(next);
}
