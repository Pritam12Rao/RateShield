import client from "prom-client";

const register = new client.Registry();

client.collectDefaultMetrics({ register });

export const httpRequestsTotal = new client.Counter({
  name: "rateshield_requests_total",
  help: "Total number of requests",
  labelNames: ["status"],
  registers: [register],
});

export const httpLatency = new client.Histogram({
  name: "rateshield_request_duration_ms",
  help: "Request duration in milliseconds",
  buckets: [5, 10, 25, 50, 100, 250],
  registers: [register],
});

export { register };
