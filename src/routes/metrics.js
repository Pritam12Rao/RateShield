import { Router } from 'express';
import { getMetrics } from '../services/metricsService.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const metrics = await getMetrics();
    return res.json(metrics);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;