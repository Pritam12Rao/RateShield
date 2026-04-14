import { Router } from 'express';
import { slidingWindow } from '../algorithms/slidingWindow.js';
import { tokenBucket } from '../algorithms/tokenBucket.js';
import { validateCheckLimit } from '../middleware/validate.js';

const router = Router();

router.post('/', validateCheckLimit, async (req, res) => {
  const {
    client_id,
    endpoint,
    limit,
    window_seconds,
    algorithm = 'sliding',
  } = req.body;

  try {
    let result;

    if (algorithm === 'sliding') {
      result = await slidingWindow({
        clientId: client_id,
        endpoint,
        limitCount: limit,
        windowSeconds: window_seconds,
      });
    } else {
      result = await tokenBucket({
        clientId: client_id,
        endpoint,
        capacity: limit,
        refillRate: limit / window_seconds,
      });
    }

    const status = result.allowed ? 200 : 429;
    return res.status(status).json({
      allowed: result.allowed,
      algorithm: result.algorithm,
      limit,
      remaining: result.remaining ?? result.tokens,
      client_id,
      endpoint,
    });

  } catch (err) {
    console.error('check-limit error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;