import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { corsHeaders, handleOptions } from "@/lib/api";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      { authenticated: true, user: { userId: user.userId } },
      { headers: corsHeaders() }
    );
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { authenticated: false, error: "Auth check failed" },
      { status: 500, headers: corsHeaders() }
    );
  }
}
