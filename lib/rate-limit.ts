import { RATE_LIMITS } from "./constants";
const store = new Map<string, { points: number; resetAt: number }>();
type Key = keyof typeof RATE_LIMITS;

export function checkRateLimit(id: string, action: Key) {
  const config = RATE_LIMITS[action];
  const key = `${action}:${id}`;
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || entry.resetAt <= now) { store.set(key, { points: 1, resetAt: now + config.duration * 1000 }); return { allowed: true, remaining: config.points - 1 }; }
  if (entry.points >= config.points) return { allowed: false, remaining: 0, resetIn: Math.ceil((entry.resetAt - now) / 1000) };
  entry.points++;
  return { allowed: true, remaining: config.points - entry.points };
}

export function rateLimitResponse(id: string, action: Key): Response | null {
  const r = checkRateLimit(id, action);
  if (!r.allowed) return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { "Content-Type": "application/json" } });
  return null;
}

if (typeof setInterval !== "undefined") setInterval(() => { const now = Date.now(); for (const [k, v] of store) if (v.resetAt <= now) store.delete(k); }, 300000);
