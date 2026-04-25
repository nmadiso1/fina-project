const prisma = require('../config/database');

/**
 * Creates a holding inside a portfolio.
 * Validates portfolioId, tickerSymbol, quantity, averageCost.
 * @throws 400 for validation errors
 * @throws 404 if portfolio not found
 * @throws 403 if user does not own portfolio
 */
const create = async (userId, { portfolioId, tickerSymbol, quantity, averageCost }) => {
  const pId = parseInt(portfolioId, 10);
  if (!portfolioId || isNaN(pId) || pId <= 0) {
    const err = new Error('portfolioId must be a valid positive integer');
    err.statusCode = 400;
    throw err;
  }
  if (!tickerSymbol || typeof tickerSymbol !== 'string' || tickerSymbol.trim() === '') {
    const err = new Error('tickerSymbol is required');
    err.statusCode = 400;
    throw err;
  }
  if (quantity === undefined || quantity === null || isNaN(Number(quantity)) || Number(quantity) <= 0) {
    const err = new Error('quantity must be a positive number');
    err.statusCode = 400;
    throw err;
  }
  if (averageCost === undefined || averageCost === null || isNaN(Number(averageCost)) || Number(averageCost) < 0) {
    const err = new Error('averageCost must be a non-negative number');
    err.statusCode = 400;
    throw err;
  }

  // Verify portfolio ownership
  const portfolio = await prisma.portfolio.findUnique({ where: { id: pId } });
  if (!portfolio) {
    const err = new Error('Portfolio not found');
    err.statusCode = 404;
    throw err;
  }
  if (portfolio.userId !== userId) {
    const err = new Error('Forbidden: you do not own this portfolio');
    err.statusCode = 403;
    throw err;
  }

  return prisma.holding.create({
    data: {
      portfolioId: pId,
      tickerSymbol: tickerSymbol.trim().toUpperCase(),
      quantity: Number(quantity),
      averageCost: Number(averageCost),
    },
  });
};

/**
 * Returns all holdings for a given portfolio (ownership check via service).
 * @throws 400 if portfolioId query param is missing or invalid
 * @throws 404 if portfolio not found
 * @throws 403 if user does not own it
 */
const getAll = async (userId, portfolioId) => {
  const pId = parseInt(portfolioId, 10);
  if (!portfolioId || isNaN(pId) || pId <= 0) {
    const err = new Error('portfolioId query parameter must be a valid positive integer');
    err.statusCode = 400;
    throw err;
  }

  const portfolio = await prisma.portfolio.findUnique({ where: { id: pId } });
  if (!portfolio) {
    const err = new Error('Portfolio not found');
    err.statusCode = 404;
    throw err;
  }
  if (portfolio.userId !== userId) {
    const err = new Error('Forbidden: you do not own this portfolio');
    err.statusCode = 403;
    throw err;
  }

  return prisma.holding.findMany({ where: { portfolioId: pId } });
};

/**
 * Returns a single holding (already ownership-checked by middleware).
 */
const getById = (holding) => holding;

/**
 * Updates a holding's tickerSymbol, quantity, or averageCost.
 * @throws 400 if no valid fields provided
 */
const update = async (id, { tickerSymbol, quantity, averageCost }) => {
  const data = {};

  if (tickerSymbol !== undefined) {
    if (typeof tickerSymbol !== 'string' || tickerSymbol.trim() === '') {
      const err = new Error('tickerSymbol must be a non-empty string');
      err.statusCode = 400;
      throw err;
    }
    data.tickerSymbol = tickerSymbol.trim().toUpperCase();
  }
  if (quantity !== undefined) {
    if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      const err = new Error('quantity must be a positive number');
      err.statusCode = 400;
      throw err;
    }
    data.quantity = Number(quantity);
  }
  if (averageCost !== undefined) {
    if (isNaN(Number(averageCost)) || Number(averageCost) < 0) {
      const err = new Error('averageCost must be a non-negative number');
      err.statusCode = 400;
      throw err;
    }
    data.averageCost = Number(averageCost);
  }

  if (Object.keys(data).length === 0) {
    const err = new Error('At least one field (tickerSymbol, quantity, averageCost) must be provided');
    err.statusCode = 400;
    throw err;
  }

  return prisma.holding.update({ where: { id }, data });
};

/**
 * Deletes a holding (cascades to transactions via schema).
 */
const remove = async (id) => {
  return prisma.holding.delete({ where: { id } });
};

module.exports = { create, getAll, getById, update, remove };
