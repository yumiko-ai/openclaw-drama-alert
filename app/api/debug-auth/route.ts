import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const password = process.env.APP_PASSWORD;
  // Get first and last character to verify
  const firstChar = password?.charCodeAt(0);
  const lastChar = password?.charCodeAt(password.length - 1);
  
  return NextResponse.json({
    hasPassword: !!password,
    passwordLength: password?.length || 0,
    envValue: password ? 'SET' : 'NOT SET',
    firstCharCode: firstChar,
    lastCharCode: lastChar,
    firstChar: password?.charAt(0),
    lastChar: password?.slice(-1),
    // Send back hashed comparison for debugging
    matchesPass1234: password === 'pass1234',
    matchesNews: password === 'news',
    matchesDollar: password?.startsWith('$')
  });
}
