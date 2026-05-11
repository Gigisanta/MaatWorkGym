// GymPro Rate Limiting
interface RateLimitEntry {
  count: number;
  resetAt: number;
  blockedUntil?: number;
}
interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}
const DEFAULT_CONFIG: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
  blockDurationMs: 15 * 60 * 1000,
};
class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private config: RateLimitConfig;
  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  check(identifier: string) {
    const now = Date.now();
    const entry = this.store.get(identifier);
    if (entry && now > entry.resetAt) this.store.delete(identifier);
    const current = this.store.get(identifier);
    if (!current) {
      this.store.set(identifier, { count: 1, resetAt: now + this.config.windowMs });
      return { allowed: true, remaining: this.config.maxAttempts - 1 };
    }
    if (current.blockedUntil && now < current.blockedUntil)
      return {
        allowed: false,
        remaining: 0,
        retryAfter: Math.ceil((current.blockedUntil - now) / 1000),
      };
    current.count++;
    if (current.count > this.config.maxAttempts) {
      current.blockedUntil = now + this.config.blockDurationMs;
      current.count = 0;
      this.store.set(identifier, current);
      return {
        allowed: false,
        remaining: 0,
        retryAfter: Math.ceil(this.config.blockDurationMs / 1000),
      };
    }
    this.store.set(identifier, current);
    return { allowed: true, remaining: this.config.maxAttempts - current.count };
  }
  reset(identifier: string) {
    this.store.delete(identifier);
  }
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetAt && (!entry.blockedUntil || now > entry.blockedUntil))
        this.store.delete(key);
    }
  }
}
export const loginRateLimiter = new RateLimiter();
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return 'login:' + ip;
}
