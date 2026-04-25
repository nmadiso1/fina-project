const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Investment Portfolio Tracker API',
      version: '1.0.0',
      description:
        'REST API for managing investment portfolios, holdings, and transactions. ' +
        'Authentication uses JWT Bearer tokens. Only resource owners may modify or delete resources.',
    },
    servers: [
      {
        url: '/',
        description: 'Default Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token (without "Bearer " prefix)',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Descriptive error message' },
          },
        },
        UserResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                email: { type: 'string', format: 'email', example: 'user@example.com' },
              },
            },
          },
        },
        Portfolio: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 5 },
            userId: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Retirement Portfolio' },
            description: { type: 'string', nullable: true, example: 'Long-term investments' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Holding: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 10 },
            portfolioId: { type: 'integer', example: 5 },
            tickerSymbol: { type: 'string', example: 'AAPL' },
            quantity: { type: 'number', format: 'decimal', example: 20 },
            averageCost: { type: 'number', format: 'decimal', example: 150.0 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 33 },
            holdingId: { type: 'integer', example: 10 },
            type: { type: 'string', enum: ['BUY', 'SELL'], example: 'BUY' },
            quantity: { type: 'number', format: 'decimal', example: 5 },
            price: { type: 'number', format: 'decimal', example: 155.0 },
            executedAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  // Route files containing @swagger JSDoc comments
  apis: [require('path').join(__dirname, './routes/*.js')],
};

module.exports = swaggerJsdoc(options);
