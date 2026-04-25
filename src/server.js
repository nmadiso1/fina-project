require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolios');
const holdingRoutes = require('./routes/holdings');
const transactionRoutes = require('./routes/transactions');

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Swagger UI ──────────────────────────────────────────────────────────────
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Investment Portfolio Tracker API Docs',
  })
);

// Expose raw OpenAPI JSON (useful for tooling)
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ── API Routes ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'Investment Portfolio Tracker API is live!',
    docs: '/api-docs',
    health: '/health'
  });
});
app.use('/api/auth', authRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/holdings', holdingRoutes);
app.use('/api/transactions', transactionRoutes);

// ── Health check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Global error handler (must be last) ────────────────────────────────────
app.use(errorHandler);

// ── Start server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Swagger UI:   http://localhost:${PORT}/api-docs`);
  console.log(`🩺 Health check: http://localhost:${PORT}/health\n`);
});

module.exports = app;
