import { NextRequest, NextResponse } from "next/server";
import { corsHeaders, handleOptions } from "@/lib/api";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET() {
  return NextResponse.json({
    app_password_set: !!process.env.APP_PASSWORD,
    jwt_secret_set: !!process.env.JWT_SECRET,
    node_env: process.env.NODE_ENV,
    app_password_value: process.env.APP_PASSWORD ? process.env.APP_PASSWORD.substring(0, 2) + '...' : 'NOT SET',
  }, { headers: corsHeaders() });
}
