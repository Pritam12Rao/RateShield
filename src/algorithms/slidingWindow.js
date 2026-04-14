import { redis } from '../services/redisClient.js';

const slidingWindowScript = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local windowStart = now - (window * 1000)

redis.call('ZREMRANGEBYSCORE', key, '-inf', windowStart)
local count = redis.call('ZCARD', key)

if count < limit then
  redis.call('ZADD', key, now, now)
  redis.call('PEXPIRE', key, window * 1000)
  return {1, count + 1}
else
  return {0, count}
end
`;

export async function slidingWindow({ clientId, endpoint, limitCount, windowSeconds }) {
  const key = `rl:sw:${clientId}:${endpoint}`;
  const now = Date.now();

  const [allowed, count] = await redis.eval(
    slidingWindowScript,
    [key],
    [now, windowSeconds, limitCount]
  );

  return {
    allowed: allowed === 1,
    count: Number(count),
    limit: limitCount,
    remaining: Math.max(0, limitCount - Number(count)),
    algorithm: 'sliding_window',
  };
}