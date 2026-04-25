const prisma = require('../config/database');

/**
 * Checks that the authenticated user owns the portfolio specified by :id.
 * Returns 400 if ID is not a positive integer.
 * Returns 404 if portfolio does not exist.
 * Returns 403 if user does not own it.
 * Attaches portfolio to req.resource on success.
 */
const checkPortfolioOwnership = async (req, res, next) => {
  const rawId = req.params.id;
  const id = parseInt(rawId, 10);
  if (!rawId || isNaN(id) || id <= 0 || String(id) !== rawId) {
    return res.status(400).json({ error: 'ID must be a valid positive integer' });
  }

  try {
    const portfolio = await prisma.portfolio.findUnique({ where: { id } });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    if (portfolio.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: you do not own this portfolio' });
    }

    req.resource = portfolio;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Checks that the authenticated user owns the holding specified by :id
 * (by traversing holding → portfolio → user).
 * Returns 400 if ID is not a positive integer.
 * Returns 404 if holding does not exist.
 * Returns 403 if user does not own it.
 * Attaches holding (with portfolio) to req.resource on success.
 */
const checkHoldingOwnership = async (req, res, next) => {
  const rawId = req.params.id;
  const id = parseInt(rawId, 10);
  if (!rawId || isNaN(id) || id <= 0 || String(id) !== rawId) {
    return res.status(400).json({ error: 'ID must be a valid positive integer' });
  }

  try {
    const holding = await prisma.holding.findUnique({
      where: { id },
      include: { portfolio: true },
    });

    if (!holding) {
      return res.status(404).json({ error: 'Holding not found' });
    }

    if (holding.portfolio.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: you do not own this holding' });
    }

    req.resource = holding;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Checks that the authenticated user owns the transaction specified by :id
 * (by traversing transaction → holding → portfolio → user).
 * Returns 400 if ID is not a positive integer.
 * Returns 404 if transaction does not exist.
 * Returns 403 if user does not own it.
 * Attaches transaction (with holding.portfolio) to req.resource on success.
 */
const checkTransactionOwnership = async (req, res, next) => {
  const rawId = req.params.id;
  const id = parseInt(rawId, 10);
  if (!rawId || isNaN(id) || id <= 0 || String(id) !== rawId) {
    return res.status(400).json({ error: 'ID must be a valid positive integer' });
  }

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { holding: { include: { portfolio: true } } },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.holding.portfolio.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: you do not own this transaction' });
    }

    req.resource = transaction;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkPortfolioOwnership,
  checkHoldingOwnership,
  checkTransactionOwnership,
};
