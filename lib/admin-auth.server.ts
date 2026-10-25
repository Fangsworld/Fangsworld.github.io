// Server-only: node:crypto and ADMIN_API_TOKEN must never enter a client component.
import { createHash, timingSafeEqual } from 'node:crypto';

/** Return a response to reject the request, or null when authorized. */
export function requireAdmin(request: Request): Response | null {
  const token = process.env.ADMIN_API_TOKEN;
  if (!token || !token.trim()) {
    return Response.json({ error: 'Admin API is disabled' }, {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const authorization = request.headers.get('authorization');
  const match = authorization?.match(/^Bearer ([^\s]+)$/i);
  const candidate = match?.[1];
  const valid = candidate && timingSafeEqual(
    createHash('sha256').update(candidate).digest(),
    createHash('sha256').update(token).digest(),
  );

  if (!valid) {
    return Response.json({ error: 'Unauthorized' }, {
      status: 401,
      headers: { 'Cache-Control': 'no-store', 'WWW-Authenticate': 'Bearer' },
    });
  }
  return null;
}
