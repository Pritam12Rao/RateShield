import 'dotenv/config';

export const config = {
  PORT: process.env.PORT || 3000,
  NODE_ID: process.env.NODE_ID || 'local-node-1',
  NODE_ENV: process.env.NODE_ENV || 'development',
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
};