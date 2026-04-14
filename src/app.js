import express from 'express';
import { config } from './config/index.js';
import { pingRedis } from './services/redisClient.js';
import { pingDB } from './services/policyService.js';
import checkLimitRouter from './routes/checkLimit.js';
import policiesRouter from './routes/policies.js';

const app = express();
app.use(express.json());
app.use('/policies', policiesRouter);

app.use('/check-limit', checkLimitRouter);

app.get('/health', async (req, res) => {
  const redisOk = await pingRedis();
  const dbOk = await pingDB();
  res.json({
    status: 'ok',
    node: config.NODE_ID,
    redis: redisOk ? 'connected' : 'error',
    db: dbOk ? 'connected' : 'error',
  });
});

app.listen(config.PORT, () => {
  console.log(`RateShield running on port ${config.PORT} | node: ${config.NODE_ID}`);
});