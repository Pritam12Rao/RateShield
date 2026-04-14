import { Redis } from '@upstash/redis';
import { config } from '../config/index.js';

export const redis = new Redis({
  url: config.UPSTASH_REDIS_REST_URL,
  token: config.UPSTASH_REDIS_REST_TOKEN,
});

export function buildKey(algorithm, clientId, endpoint) {
  return `rl:${algorithm}:${clientId}:${endpoint}`;
}

export async function pingRedis() {
  try {
    await redis.set('ping', 'pong', { ex: 10 });
    const val = await redis.get('ping');
    return val === 'pong';
  } catch {
    return false;
  }
}