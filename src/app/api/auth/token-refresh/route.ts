// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
// 	try {
// 		// Parse request body
// 		const { accessToken } = await req.json();

// 		if (!accessToken) {
// 			return NextResponse.json({ error: "Access token is required" }, { status: 400 });
// 		}

// 		// Create response object
// 		const response = NextResponse.json({
// 			message: "Cookie has been set successfully!"
// 		});

// 		// Set the cookie
// 		response.cookies.set("accessToken", accessToken, {
// 			httpOnly: true,
// 			path: "/",
// 			sameSite: "strict",
// 			secure: process.env.NODE_ENV === "production" // Secure cookies for production
// 		});

// 		console.log("Cookie set:", accessToken);

// 		return response;
// 	} catch (error) {
// 		console.error("Error setting cookie:", error);
// 		return NextResponse.json({ error: "Failed to set cookie" }, { status: 500 });
// 	}
// }
