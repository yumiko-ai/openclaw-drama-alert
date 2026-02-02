import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me';

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
  // Use dynamic env access for Vercel
  const appPassword = process.env.APP_PASSWORD;
  
  // Debug logging (will appear in Vercel logs)
  console.log('APP_PASSWORD env present:', !!appPassword, 'Length:', appPassword?.length || 0);
  
  if (!appPassword) {
    // Fallback passwords for testing
    return inputPassword === '$News$101' || inputPassword === 'news101' || inputPassword === 'DramaAlert2024!';
  }
  
  return inputPassword === appPassword;
}

export function setAuthCookie(token: string) {
  return token;
}

export function clearAuthCookie() {
  return 'clear';
}

export function createSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}
