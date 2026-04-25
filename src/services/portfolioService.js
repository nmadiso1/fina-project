const prisma = require('../config/database');

/**
 * Creates a portfolio for the given user.
 * @throws 400 if name is missing
 */
const create = async (userId, { name, description }) => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    const err = new Error('Name is required');
    err.statusCode = 400;
    throw err;
  }

  return prisma.portfolio.create({
    data: { userId, name: name.trim(), description: description || null },
  });
};

/**
 * Returns all portfolios owned by the given user.
 */
const getAll = async (userId) => {
  return prisma.portfolio.findMany({ where: { userId } });
};

/**
 * Returns a single portfolio (already ownership-checked by middleware).
 */
const getById = async (portfolio) => portfolio;

/**
 * Updates a portfolio's name/description.
 * @throws 400 if name is missing
 */
const update = async (id, { name, description }) => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    const err = new Error('Name is required');
    err.statusCode = 400;
    throw err;
  }

  return prisma.portfolio.update({
    where: { id },
    data: { name: name.trim(), description: description !== undefined ? description : null },
  });
};

/**
 * Deletes a portfolio (cascades to holdings and transactions via Prisma schema).
 */
const remove = async (id) => {
  return prisma.portfolio.delete({ where: { id } });
};

module.exports = { create, getAll, getById, update, remove };
