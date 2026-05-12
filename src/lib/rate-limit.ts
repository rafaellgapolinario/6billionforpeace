// In-memory rate limit. Não persiste entre instâncias serverless do Vercel,
// mas cada instância vive ~minutos e cada admin tem 1 owner — suficiente
// pra travar brute force/scraping. Pra produção rigorosa, trocar por Upstash.

type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

function gc(now: number) {
  if (store.size < 1000) return;
  for (const [k, b] of store) if (b.resetAt < now) store.delete(k);
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
};

export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  gc(now);
  const b = store.get(key);
  if (!b || b.resetAt < now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { ok: true, remaining: max - 1, resetAt };
  }
  b.count += 1;
  return { ok: b.count <= max, remaining: Math.max(0, max - b.count), resetAt: b.resetAt };
}
