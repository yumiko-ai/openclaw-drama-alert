import { verifyToken, TokenPayload } from './auth';

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function successResponse<T>(data: T, message?: string): APIResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function errorResponse(error: string, statusCode = 400): APIResponse {
  return {
    success: false,
    error,
  };
}

export async function authenticateRequest(
  request: Request
): Promise<{ user: TokenPayload | null; error: string | null }> {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader) {
    return { user: null, error: 'Missing Authorization header' };
  }

  const token = authHeader.replace('Bearer ', '');
  
  if (!token) {
    return { user: null, error: 'Missing token' };
  }

  const user = verifyToken(token);
  
  if (!user) {
    return { user: null, error: 'Invalid or expired token' };
  }

  return { user, error: null };
}

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export function jsonHeaders() {
  return {
    'Content-Type': 'application/json',
  };
}

export async function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}
