import { NextRequest, NextResponse } from "next/server";
import { createToken, validatePassword } from "@/lib/auth";
import { corsHeaders, handleOptions } from "@/lib/api";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400, headers: corsHeaders() }
      );
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401, headers: corsHeaders() }
      );
    }

    const token = createToken("admin-user", "admin@dramaalert.local");

    const response = NextResponse.json(
      {
        success: true,
        token,
        expiresIn: 604800, // 7 days
      },
      { headers: corsHeaders() }
    );

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 604800,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: corsHeaders() }
    );
  }
}
