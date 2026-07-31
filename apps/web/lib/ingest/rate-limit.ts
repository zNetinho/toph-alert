/**
 * In-memory sliding-window rate limit per store_key (V1 — single instance).
 * For multi-instance deploy, replace with Redis / edge KV later.
 */

type Bucket = {
  timestamps: number[];
};

const buckets = new Map<string, Bucket>();

function limitPerMinute(): number {
  const raw = process.env.INGEST_RATE_LIMIT_PER_MINUTE;
  const parsed = raw ? Number.parseInt(raw, 10) : 60;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 60;
}

export type RateLimitResult =
  { ok: true; remaining: number } | { ok: false; retryAfterSec: number };

export function consumeStoreRateLimit(storeKey: string, now = Date.now()): RateLimitResult {
  const windowMs = 60_000;
  const limit = limitPerMinute();
  const bucket = buckets.get(storeKey) ?? { timestamps: [] };
  const cutoff = now - windowMs;
  bucket.timestamps = bucket.timestamps.filter((t) => t > cutoff);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    buckets.set(storeKey, bucket);
    return { ok: false, retryAfterSec };
  }

  bucket.timestamps.push(now);
  buckets.set(storeKey, bucket);
  return { ok: true, remaining: limit - bucket.timestamps.length };
}
