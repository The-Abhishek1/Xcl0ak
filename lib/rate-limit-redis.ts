/**
 * Redis-backed rate limiter for production.
 *
 * To enable:
 * 1. npm install ioredis
 * 2. Set REDIS_URL in .env
 * 3. Replace the import in API routes:
 *    - from: import { rateLimitResponse } from "@/lib/rate-limit"
 *    + to:   import { rateLimitResponse } from "@/lib/rate-limit-redis"
 *
 * Or just set REDIS_URL and the main rate-limit.ts will auto-detect (see TODO below).
 */

// import Redis from "ioredis";
// import { RATE_LIMITS } from "./constants";
//
// type RateLimitKey = keyof typeof RATE_LIMITS;
//
// const redis = new Redis(process.env.REDIS_URL!, {
//   maxRetriesPerRequest: 1,
//   lazyConnect: true,
// });
//
// redis.on("error", (err) => {
//   console.error("[Rate Limiter] Redis connection error:", err.message);
// });
//
// export async function checkRateLimit(
//   identifier: string,
//   action: RateLimitKey
// ): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
//   const config = RATE_LIMITS[action];
//   const key = `rl:${action}:${identifier}`;
//
//   try {
//     const multi = redis.multi();
//     multi.incr(key);
//     multi.ttl(key);
//     const results = await multi.exec();
//
//     const count = (results?.[0]?.[1] as number) || 0;
//     const ttl = (results?.[1]?.[1] as number) || -1;
//
//     // Set expiry on first request in window
//     if (ttl === -1) {
//       await redis.expire(key, config.duration);
//     }
//
//     if (count > config.points) {
//       return {
//         allowed: false,
//         remaining: 0,
//         resetIn: Math.max(ttl, 1),
//       };
//     }
//
//     return {
//       allowed: true,
//       remaining: config.points - count,
//       resetIn: Math.max(ttl, config.duration),
//     };
//   } catch (error) {
//     // If Redis is down, allow the request (fail open)
//     console.error("[Rate Limiter] Redis error, failing open:", error);
//     return { allowed: true, remaining: config.points, resetIn: config.duration };
//   }
// }
//
// export function rateLimitResponse(identifier: string, action: RateLimitKey): Promise<Response | null> {
//   return checkRateLimit(identifier, action).then((result) => {
//     if (!result.allowed) {
//       return new Response(
//         JSON.stringify({ error: "Rate limit exceeded", retryAfter: result.resetIn }),
//         {
//           status: 429,
//           headers: {
//             "Content-Type": "application/json",
//             "Retry-After": String(result.resetIn),
//             "X-RateLimit-Remaining": "0",
//           },
//         }
//       );
//     }
//     return null;
//   });
// }

export {};
// This file is a template. Uncomment the code above after installing ioredis and setting REDIS_URL.
