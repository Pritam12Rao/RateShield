import { redis } from './redisClient.js';
import { getAndResetCounters } from './localCounter.js';

export function startFlusher() {
  setInterval(async () => {
    const snapshot = getAndResetCounters();
    if (snapshot.size === 0) return;

    for (const [key, delta] of snapshot.entries()) {
      try {
        await redis.incrby(key, delta);
      } catch (err) {
        console.error(`Flush failed for key ${key}:`, err.message);
      }
    }
  }, 100);
}