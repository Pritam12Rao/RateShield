import { redis } from './redisClient.js';

export async function incrementMetric(key) {
  await redis.incr(`metrics:${key}`);
}

export async function getMetrics() {
  const [total, allowed, blocked] = await Promise.all([
    redis.get('metrics:total_requests'),
    redis.get('metrics:allowed'),
    redis.get('metrics:blocked'),
  ]);

  const t = Number(total) || 0;
  const a = Number(allowed) || 0;
  const b = Number(blocked) || 0;

  return {
    total_requests: t,
    allowed: a,
    blocked: b,
    block_rate: t > 0 ? ((b / t) * 100).toFixed(2) + '%' : '0%',
  };
}