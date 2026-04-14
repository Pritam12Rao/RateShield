export function validateCheckLimit(req, res, next) {
  const { client_id, endpoint, limit, window_seconds, algorithm } = req.body;

  if (!client_id || typeof client_id !== 'string') {
    return res.status(400).json({ error: 'client_id is required' });
  }
  if (!endpoint || typeof endpoint !== 'string') {
    return res.status(400).json({ error: 'endpoint is required' });
  }
  if (!limit || typeof limit !== 'number' || limit < 1) {
    return res.status(400).json({ error: 'limit must be a positive number' });
  }
  if (!window_seconds || typeof window_seconds !== 'number' || window_seconds < 1) {
    return res.status(400).json({ error: 'window_seconds must be a positive number' });
  }
  if (algorithm && !['sliding', 'token_bucket'].includes(algorithm)) {
    return res.status(400).json({ error: 'algorithm must be sliding or token_bucket' });
  }

  next();
}