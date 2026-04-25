const prisma = require('../config/database');

/**
 * Recalculates a holding's quantity and averageCost from all its transactions.
 * Called after any create/update/delete on transactions.
 */
const recalculateHolding = async (holdingId) => {
  const transactions = await prisma.transaction.findMany({ where: { holdingId } });

  let totalShares = 0;
  let totalCost = 0;

  for (const tx of transactions) {
    const qty = Number(tx.quantity);
    const price = Number(tx.price);

    if (tx.type === 'BUY') {
      totalCost += qty * price;
      totalShares += qty;
    } else if (tx.type === 'SELL') {
      // Reduce total shares; cost basis reduces proportionally
      totalShares -= qty;
    }
  }

  // Avoid division by zero
  const newAverageCost = totalShares > 0 ? totalCost / totalShares : 0;

  await prisma.holding.update({
    where: { id: holdingId },
    data: {
      quantity: totalShares < 0 ? 0 : totalShares,
      averageCost: newAverageCost,
    },
  });
};

/**
 * Creates a BUY or SELL transaction.
 * For SELL: validates that quantity does not exceed current holding quantity.
 * Updates holding's quantity and averageCost on success.
 * @throws 400 for validation errors
 * @throws 403 if user does not own the holding
 * @throws 404 if holding not found
 * @throws 409 if SELL quantity exceeds current holding quantity
 */
const create = async (userId, { holdingId, type, quantity, price, executedAt }) => {
  const hId = parseInt(holdingId, 10);
  if (!holdingId || isNaN(hId) || hId <= 0) {
    const err = new Error('holdingId must be a valid positive integer');
    err.statusCode = 400;
    throw err;
  }
  if (!type || !['BUY', 'SELL'].includes(type)) {
    const err = new Error('type must be BUY or SELL');
    err.statusCode = 400;
    throw err;
  }
  if (quantity === undefined || quantity === null || isNaN(Number(quantity)) || Number(quantity) <= 0) {
    const err = new Error('quantity must be a positive number');
    err.statusCode = 400;
    throw err;
  }
  if (price === undefined || price === null || isNaN(Number(price)) || Number(price) < 0) {
    const err = new Error('price must be a non-negative number');
    err.statusCode = 400;
    throw err;
  }

  // Validate executedAt if provided
  let execDate = executedAt ? new Date(executedAt) : new Date();
  if (isNaN(execDate.getTime())) {
    const err = new Error('executedAt must be a valid date-time string');
    err.statusCode = 400;
    throw err;
  }

  // Verify holding and ownership
  const holding = await prisma.holding.findUnique({
    where: { id: hId },
    include: { portfolio: true },
  });
  if (!holding) {
    const err = new Error('Holding not found');
    err.statusCode = 404;
    throw err;
  }
  if (holding.portfolio.userId !== userId) {
    const err = new Error('Forbidden: you do not own this holding');
    err.statusCode = 403;
    throw err;
  }

  // 409: SELL quantity check
  if (type === 'SELL' && Number(quantity) > Number(holding.quantity)) {
    const err = new Error('SELL quantity exceeds current holding quantity');
    err.statusCode = 409;
    throw err;
  }

  const transaction = await prisma.transaction.create({
    data: {
      holdingId: hId,
      type,
      quantity: Number(quantity),
      price: Number(price),
      executedAt: execDate,
    },
  });

  await recalculateHolding(hId);
  return transaction;
};

/**
 * Returns all transactions for a given holding (with ownership check).
 * @throws 400 if holdingId query param is missing or invalid
 * @throws 404 if holding not found
 * @throws 403 if user does not own it
 */
const getAll = async (userId, holdingId) => {
  const hId = parseInt(holdingId, 10);
  if (!holdingId || isNaN(hId) || hId <= 0) {
    const err = new Error('holdingId query parameter must be a valid positive integer');
    err.statusCode = 400;
    throw err;
  }

  const holding = await prisma.holding.findUnique({
    where: { id: hId },
    include: { portfolio: true },
  });
  if (!holding) {
    const err = new Error('Holding not found');
    err.statusCode = 404;
    throw err;
  }
  if (holding.portfolio.userId !== userId) {
    const err = new Error('Forbidden: you do not own this holding');
    err.statusCode = 403;
    throw err;
  }

  return prisma.transaction.findMany({ where: { holdingId: hId } });
};

/**
 * Returns a single transaction (already ownership-checked by middleware).
 */
const getById = (transaction) => transaction;

/**
 * Updates a transaction's type, quantity, or price.
 * Recalculates the holding after update.
 * @throws 400 for validation errors
 * @throws 409 if updated SELL quantity would exceed holding quantity
 */
const update = async (id, holdingId, { type, quantity, price, executedAt }) => {
  const data = {};

  if (type !== undefined) {
    if (!['BUY', 'SELL'].includes(type)) {
      const err = new Error('type must be BUY or SELL');
      err.statusCode = 400;
      throw err;
    }
    data.type = type;
  }
  if (quantity !== undefined) {
    if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      const err = new Error('quantity must be a positive number');
      err.statusCode = 400;
      throw err;
    }
    data.quantity = Number(quantity);
  }
  if (price !== undefined) {
    if (isNaN(Number(price)) || Number(price) < 0) {
      const err = new Error('price must be a non-negative number');
      err.statusCode = 400;
      throw err;
    }
    data.price = Number(price);
  }
  if (executedAt !== undefined) {
    const d = new Date(executedAt);
    if (isNaN(d.getTime())) {
      const err = new Error('executedAt must be a valid date-time string');
      err.statusCode = 400;
      throw err;
    }
    data.executedAt = d;
  }

  if (Object.keys(data).length === 0) {
    const err = new Error('At least one field (type, quantity, price, executedAt) must be provided');
    err.statusCode = 400;
    throw err;
  }

  // Get current transaction for SELL-quantity check simulation
  const currentTx = await prisma.transaction.findUnique({ where: { id } });
  const resolvedType = data.type || currentTx.type;
  const resolvedQty = data.quantity !== undefined ? data.quantity : Number(currentTx.quantity);

  if (resolvedType === 'SELL') {
    // Get holding quantity excluding this transaction's current contribution
    const holding = await prisma.holding.findUnique({ where: { id: holdingId } });
    // Add back this tx's quantity then subtract new SELL qty
    const adjustedHoldingQty = Number(holding.quantity) +
      (currentTx.type === 'SELL' ? Number(currentTx.quantity) : -Number(currentTx.quantity));

    if (resolvedQty > adjustedHoldingQty) {
      const err = new Error('Updated SELL quantity would exceed holding quantity');
      err.statusCode = 409;
      throw err;
    }
  }

  const updated = await prisma.transaction.update({ where: { id }, data });
  await recalculateHolding(holdingId);
  return updated;
};

/**
 * Deletes a transaction by ID and recalculates the holding.
 */
const remove = async (id, holdingId) => {
  const deleted = await prisma.transaction.delete({ where: { id } });
  await recalculateHolding(holdingId);
  return deleted;
};

module.exports = { create, getAll, getById, update, remove };
