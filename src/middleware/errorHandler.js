/**
 * Global error handling middleware.
 * Catches errors passed via next(err) and returns a consistent JSON response.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal server error'
      : err.message || 'Internal server error';

  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);

  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
