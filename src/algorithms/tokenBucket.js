import { redis } from '../services/redisClient.js';

const tokenBucketScript = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local capacity = tonumber(ARGV[2])
local refillRate = tonumber(ARGV[3])

local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
local tokens = tonumber(bucket[1])
local lastRefill = tonumber(bucket[2])

if tokens == nil then
  tokens = capacity
  lastRefill = now
end

local elapsed = (now - lastRefill) / 1000
local refilled = elapsed * refillRate
tokens = math.min(capacity, tokens + refilled)

if tokens >= 1 then
  tokens = tokens - 1
  redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
  return {1, math.floor(tokens)}
else
  redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
  return {0, 0}
end
`;

export async function tokenBucket({ clientId, endpoint, capacity, refillRate }) {
  const key = `rl:tb:${clientId}:${endpoint}`;
  const now = Date.now();

  const [allowed, tokens] = await redis.eval(
    tokenBucketScript,
    [key],
    [now, capacity, refillRate]
  );

  return {
    allowed: allowed === 1,
    tokens: Number(tokens),
    capacity,
    algorithm: 'token_bucket',
  };
}