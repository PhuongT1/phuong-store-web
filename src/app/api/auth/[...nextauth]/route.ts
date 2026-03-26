import NextAuth from "next-auth";
import { type NextRequest, type NextResponse } from "next/server";
import { authConfig } from "@/auth/authConfig";

const handler = NextAuth(authConfig) as (req: NextRequest) => Promise<NextResponse>;

export const GET = handler;
export const POST = handler;
