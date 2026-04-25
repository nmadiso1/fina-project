const holdingService = require('../services/holdingService');

/**
 * POST /api/holdings
 */
const create = async (req, res, next) => {
  try {
    const holding = await holdingService.create(req.user.id, req.body);
    res.status(201).json(holding);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/holdings?portfolioId=5
 */
const getAll = async (req, res, next) => {
  try {
    const holdings = await holdingService.getAll(req.user.id, req.query.portfolioId);
    res.status(200).json(holdings);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/holdings/:id
 * req.resource is set by checkHoldingOwnership middleware.
 */
const getById = async (req, res, next) => {
  try {
    res.status(200).json(req.resource);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/holdings/:id
 */
const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await holdingService.update(id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/holdings/:id
 */
const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await holdingService.remove(id);
    res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, getById, update, remove };
