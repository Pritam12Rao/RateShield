const counters = new Map();

export function localIncrement(key) {
  const current = counters.get(key) || 0;
  counters.set(key, current + 1);
}

export function isHotKey(key) {
  return (counters.get(key) || 0) > 50;
}

export function getAndResetCounters() {
  const snapshot = new Map(counters);
  counters.clear();
  return snapshot;
}