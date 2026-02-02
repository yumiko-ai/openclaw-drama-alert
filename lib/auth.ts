import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { supabase } from './supabase';

const JWT_SECRET = process.env.JWT_SECRET!;
const APP_PASSWORD = process.env.APP_PASSWORD!;

export interface TokenPayload {
  userId: string;
  email?: string;
  exp: number;
  iat: number;
}

export function createToken(userId: string, email?: string): string {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('auth-token')?.value || null;
}

export async function getCurrentUser(): Promise<TokenPayload | null> {
  const token = await getAuthToken();
  if (!token) return null;
  return verifyToken(token);
}

export function validatePassword(inputPassword: string): boolean {
  return inputPassword === APP_PASSWORD;
}

export function setAuthCookie(token: string) {
  // This will be used in API routes
  return token;
}

export function clearAuthCookie() {
  // This will be used in API routes
  return 'clear';
}

// Generate a simple session ID for password-less auth
export function createSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}
