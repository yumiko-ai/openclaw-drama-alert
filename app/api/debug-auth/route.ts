import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const password = process.env.APP_PASSWORD;
  return NextResponse.json({
    hasPassword: !!password,
    passwordLength: password?.length || 0,
    envValue: password ? 'SET' : 'NOT SET'
  });
}
