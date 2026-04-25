const express = require('express');
const router = express.Router();
const holdingController = require('../controllers/holdingController');
const { verifyToken } = require('../middleware/authentication');
const { checkHoldingOwnership } = require('../middleware/authorization');

/**
 * @swagger
 * tags:
 *   name: Holdings
 *   description: Holding management endpoints
 */

/**
 * @swagger
 * /api/holdings:
 *   post:
 *     summary: Create a new holding inside a portfolio (owner only)
 *     tags: [Holdings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - portfolioId
 *               - tickerSymbol
 *               - quantity
 *               - averageCost
 *             properties:
 *               portfolioId:
 *                 type: integer
 *                 example: 5
 *               tickerSymbol:
 *                 type: string
 *                 example: AAPL
 *               quantity:
 *                 type: number
 *                 example: 20
 *               averageCost:
 *                 type: number
 *                 example: 150.00
 *     responses:
 *       201:
 *         description: Holding created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Holding'
 *       400:
 *         description: Missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Portfolio not owned by the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Portfolio does not exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', verifyToken, holdingController.create);

/**
 * @swagger
 * /api/holdings:
 *   get:
 *     summary: Get all holdings for a given portfolio (owner only)
 *     tags: [Holdings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: portfolioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the portfolio whose holdings to retrieve
 *     responses:
 *       200:
 *         description: List of holdings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Holding'
 *       400:
 *         description: Missing or invalid portfolioId query parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Authenticated user does not own this portfolio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Portfolio does not exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', verifyToken, holdingController.getAll);

/**
 * @swagger
 * /api/holdings/{id}:
 *   get:
 *     summary: Get a single holding by ID (owner only)
 *     tags: [Holdings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Holding ID
 *     responses:
 *       200:
 *         description: Holding data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Holding'
 *       400:
 *         description: ID is not a valid positive integer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Authenticated user does not own this holding
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Holding does not exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', verifyToken, checkHoldingOwnership, holdingController.getById);

/**
 * @swagger
 * /api/holdings/{id}:
 *   put:
 *     summary: Update holding metadata (owner only)
 *     tags: [Holdings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Holding ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tickerSymbol:
 *                 type: string
 *                 example: AAPL
 *               quantity:
 *                 type: number
 *                 example: 25
 *               averageCost:
 *                 type: number
 *                 example: 155.00
 *     responses:
 *       200:
 *         description: Updated holding
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Holding'
 *       400:
 *         description: Missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Authenticated user does not own this holding
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Holding does not exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', verifyToken, checkHoldingOwnership, holdingController.update);

/**
 * @swagger
 * /api/holdings/{id}:
 *   delete:
 *     summary: Delete a holding and all its transactions (owner only)
 *     tags: [Holdings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Holding ID
 *     responses:
 *       200:
 *         description: Deleted holding data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Holding'
 *       400:
 *         description: ID is not a valid positive integer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Authenticated user does not own this holding
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Holding does not exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', verifyToken, checkHoldingOwnership, holdingController.remove);

module.exports = router;
