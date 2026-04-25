const transactionService = require('../services/transactionService');

/**
 * POST /api/transactions
 */
const create = async (req, res, next) => {
  try {
    const transaction = await transactionService.create(req.user.id, req.body);
    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/transactions?holdingId=10
 */
const getAll = async (req, res, next) => {
  try {
    const transactions = await transactionService.getAll(req.user.id, req.query.holdingId);
    res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/transactions/:id
 * req.resource is set by checkTransactionOwnership middleware.
 */
const getById = async (req, res, next) => {
  try {
    res.status(200).json(req.resource);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/transactions/:id
 */
const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const holdingId = req.resource.holdingId;
    const updated = await transactionService.update(id, holdingId, req.body);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/transactions/:id
 */
const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const holdingId = req.resource.holdingId;
    const deleted = await transactionService.remove(id, holdingId);
    res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, getById, update, remove };
