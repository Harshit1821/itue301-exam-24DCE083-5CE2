/**
 * Custom Request Logger Middleware (Task 3 Requirement)
 * Format: [METHOD] [PATH] [TIMESTAMP]
 * Example: [GET] /api/v1/appointments [2026-08-20T10:15:20.000Z]
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${req.method}] ${req.originalUrl || req.url} [${timestamp}]`);
  next();
};

module.exports = requestLogger;
