import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create a policy
router.post('/', async (req, res) => {
  const { client_id, endpoint, algorithm, limit_count, window_seconds } = req.body;

  if (!client_id || !endpoint || !limit_count || !window_seconds) {
    return res.status(400).json({ error: 'client_id, endpoint, limit_count, window_seconds are required' });
  }

  try {
    const policy = await prisma.ratePolicy.create({
      data: {
        clientId: client_id,
        endpoint,
        algorithm: algorithm || 'sliding',
        limitCount: limit_count,
        windowSeconds: window_seconds,
      },
    });
    return res.status(201).json(policy);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Policy already exists for this client + endpoint' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all policies
router.get('/', async (req, res) => {
  try {
    const policies = await prisma.ratePolicy.findMany();
    return res.json(policies);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get policy by client_id and endpoint
router.get('/:client_id/:endpoint(*)', async (req, res) => {
  const { client_id } = req.params;
  const endpoint = '/' + req.params.endpoint;

  try {
    const policy = await prisma.ratePolicy.findUnique({
      where: { clientId_endpoint: { clientId: client_id, endpoint } },
    });
    if (!policy) return res.status(404).json({ error: 'Policy not found' });
    return res.json(policy);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a policy
router.delete('/:client_id/:endpoint(*)', async (req, res) => {
  const { client_id } = req.params;
  const endpoint = '/' + req.params.endpoint;

  try {
    await prisma.ratePolicy.delete({
      where: { clientId_endpoint: { clientId: client_id, endpoint } },
    });
    return res.json({ message: 'Policy deleted' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;