const portfolioService = require('../services/portfolioService');

/**
 * POST /api/portfolios
 */
const create = async (req, res, next) => {
  try {
    const portfolio = await portfolioService.create(req.user.id, req.body);
    res.status(201).json(portfolio);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/portfolios
 */
const getAll = async (req, res, next) => {
  try {
    const portfolios = await portfolioService.getAll(req.user.id);
    res.status(200).json(portfolios);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/portfolios/:id
 * req.resource is set by checkPortfolioOwnership middleware.
 */
const getById = async (req, res, next) => {
  try {
    res.status(200).json(req.resource);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/portfolios/:id
 */
const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await portfolioService.update(id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/portfolios/:id
 */
const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await portfolioService.remove(id);
    res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, getById, update, remove };
