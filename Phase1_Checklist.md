# Investment Portfolio Tracker API - Phase 1 Checklist

Use this checklist to track your progress on the Phase 1 implementation.

---

## Project Setup

- [ ] Created Node.js/Express project
- [ ] Installed dependencies: express, @prisma/client, prisma, bcrypt, jsonwebtoken, swagger-ui-express, swagger-jsdoc, dotenv
- [ ] Created `.env` file with DATABASE_URL and JWT_SECRET
- [ ] Created `.gitignore` and added node_modules, .env
- [ ] Initialized Git repository
- [ ] Created GitHub repository

---

## Database & Prisma Setup

- [ ] Initialized Prisma with `npx prisma init`
- [ ] Set DATABASE_URL in .env
- [ ] Created PostgreSQL database (local or cloud)
- [ ] Created `prisma/schema.prisma` with:
  - [ ] User model with id, email, password, createdAt, updatedAt
  - [ ] Portfolio model with userId, name, description, timestamps
  - [ ] Holding model with portfolioId, tickerSymbol, quantity, averageCost, timestamps
  - [ ] Transaction model with holdingId, type, quantity, price, executedAt, timestamps
  - [ ] All relationships defined (1-to-many)
  - [ ] Cascade deletes configured
  - [ ] Foreign key indexes added
- [ ] Ran initial migration: `npx prisma migrate dev --name init`
- [ ] Prisma client generated

---

## Folder Structure

- [ ] Created `src/` directory
- [ ] Created `src/config/` for database config
- [ ] Created `src/middleware/` for auth, authorization, validation, error handling
- [ ] Created `src/routes/` for route definitions
- [ ] Created `src/controllers/` for endpoint logic
- [ ] Created `src/services/` for business logic
- [ ] Created `src/repositories/` (optional but recommended) for data access
- [ ] Created `prisma/` directory
- [ ] Created `tests/` directory for testing plan

---

## Authentication Implementation

- [ ] Implemented bcrypt password hashing (salt rounds ≥ 10)
- [ ] Implemented JWT token generation
- [ ] Created JWT secret in .env
- [ ] Implemented signup endpoint (POST /api/auth/signup)
  - [ ] Validates email and password
  - [ ] Checks for existing email
  - [ ] Returns 201 with user data
  - [ ] Returns appropriate error codes (400, 409)
- [ ] Implemented login endpoint (POST /api/auth/login)
  - [ ] Validates credentials
  - [ ] Returns JWT token
  - [ ] Returns user data with token
  - [ ] Returns 401 for invalid credentials
- [ ] Created authentication middleware
  - [ ] Extracts JWT from Authorization header
  - [ ] Verifies token validity
  - [ ] Attaches user to request object
  - [ ] Returns 401 for missing/invalid tokens

---

## Authorization Implementation

- [ ] Created authorization middleware for ownership checks
- [ ] Implemented Portfolio ownership verification
- [ ] Implemented Holding ownership verification (via portfolio)
- [ ] Implemented Transaction ownership verification (via holding → portfolio)
- [ ] Returns 403 Forbidden when user doesn't own resource
- [ ] Returns 404 Not Found for non-existent resources

---

## API Endpoints - Authentication

- [ ] POST /api/auth/signup
  - [ ] Success: 201 Created
  - [ ] Error: 400 Bad Request (missing fields)
  - [ ] Error: 409 Conflict (email exists)
- [ ] POST /api/auth/login
  - [ ] Success: 200 OK with token
  - [ ] Error: 400 Bad Request (missing credentials)
  - [ ] Error: 401 Unauthorized (invalid credentials)

---

## API Endpoints - Portfolio (Full CRUD)

- [ ] POST /api/portfolios
  - [ ] Create new portfolio
  - [ ] Authenticated users only
  - [ ] Success: 201 Created
  - [ ] Error: 400 Bad Request
  - [ ] Error: 401 Unauthorized
- [ ] GET /api/portfolios
  - [ ] Get all user's portfolios
  - [ ] Authenticated users only
  - [ ] Returns array (possibly empty)
  - [ ] Error: 401 Unauthorized
- [ ] GET /api/portfolios/:id
  - [ ] Get single portfolio
  - [ ] Owner only
  - [ ] Success: 200 OK
  - [ ] Error: 400 Bad Request (invalid ID)
  - [ ] Error: 401 Unauthorized
  - [ ] Error: 403 Forbidden (not owner)
  - [ ] Error: 404 Not Found
- [ ] PUT /api/portfolios/:id
  - [ ] Update portfolio
  - [ ] Owner only
  - [ ] Success: 200 OK with updated data
  - [ ] Error: 400 Bad Request
  - [ ] Error: 401 Unauthorized
  - [ ] Error: 403 Forbidden (not owner)
  - [ ] Error: 404 Not Found
- [ ] DELETE /api/portfolios/:id
  - [ ] Delete portfolio and cascading holdings
  - [ ] Owner only
  - [ ] Success: 200 OK with deleted data
  - [ ] Error: 400 Bad Request (invalid ID)
  - [ ] Error: 401 Unauthorized
  - [ ] Error: 403 Forbidden (not owner)
  - [ ] Error: 404 Not Found

---

## API Endpoints - Holding (Full CRUD)

- [ ] POST /api/holdings
  - [ ] Create new holding
  - [ ] Must own portfolio
  - [ ] Success: 201 Created
  - [ ] Error: 400 Bad Request
  - [ ] Error: 401 Unauthorized
  - [ ] Error: 403 Forbidden
  - [ ] Error: 404 Not Found (portfolio)
- [ ] GET /api/holdings?portfolioId=5
  - [ ] Get holdings for portfolio
  - [ ] Owner only
  - [ ] Success: 200 OK with array
  - [ ] Error: 400 Bad Request (missing portfolioId)
  - [ ] Error: 401 Unauthorized
  - [ ] Error: 403 Forbidden
  - [ ] Error: 404 Not Found (portfolio)
- [ ] GET /api/holdings/:id
  - [ ] Get single holding
  - [ ] Owner only
  - [ ] Success: 200 OK
  - [ ] Error: 400 Bad Request (invalid ID)
  - [ ] Error: 401 Unauthorized
  - [ ] Error: 403 Forbidden
  - [ ] Error: 404 Not Found
- [ ] PUT /api/holdings/:id
  - [ ] Update holding
  - [ ] Owner only
  - [ ] Success: 200 OK with updated data
  - [ ] Error: 400 Bad Request
  - [ ] Error: 401 Unauthorized
  - [ ] Error: 403 Forbidden
  - [ ] Error: 404 Not Found
- [ ] DELETE /api/holdings/:id
  - [ ] Delete holding and cascading transactions
  - [ ] Owner only
  - [ ] Success: 200 OK with deleted data
  - [ ] Error: 400 Bad Request (invalid ID)
  - [ ] Error: 401 Unauthorized
  - [ ] Error: 403 Forbidden
  - [ ] Error: 404 Not Found

---

## API Endpoints - Transaction (Full CRUD)

- [ ] POST /api/transactions
  - [ ] Create BUY or SELL transaction
  - [ ] Must own holding
  - [ ] Updates holding quantity and average cost
  - [ ] Success: 201 Created
  - [ ] Error: 400 Bad Request
  - [ ] Error: 401 Unauthorized
  - [ ] Error: 403 Forbidden
  - [ ] Error: 404 Not Found (holding)
  - [ ] Error: 409 Conflict (sell exceeds quantity)
- [ ] GET /api/transactions?holdingId=10
  - [ ] Get transactions for holding
  - [ ] Owner only
  - [ ] Success: 200 OK with array
  - [ ] Error: 400 Bad Request (missing holdingId)
  - [ ] Error: 401 Unauthorized
  - [ ] Error: 403 Forbidden
  - [ ] Error: 404 Not Found (holding)
- [ ] GET /api/transactions/:id
  - [ ] Get single transaction
  - [ ] Owner only
  - [ ] Success: 200 OK
  - [ ] Error: 400 Bad Request (invalid ID)
  - [ ] Error: 401 Unauthorized
  - [ ] Error: 403 Forbidden
  - [ ] Error: 404 Not Found
- [ ] PUT /api/transactions/:id
  - [ ] Update transaction
  - [ ] Owner only
  - [ ] Updates holding if quantity/price changed
  - [ ] Success: 200 OK with updated data
  - [ ] Error: 400 Bad Request
  - [ ] Error: 401 Unauthorized
  - [ ] Error: 403 Forbidden
  - [ ] Error: 404 Not Found
  - [ ] Error: 409 Conflict (sell would exceed holdings)
- [ ] DELETE /api/transactions/:id
  - [ ] Delete transaction
  - [ ] Updates holding quantity
  - [ ] Owner only
  - [ ] Success: 200 OK with deleted data
  - [ ] Error: 400 Bad Request (invalid ID)
  - [ ] Error: 401 Unauthorized
  - [ ] Error: 403 Forbidden
  - [ ] Error: 404 Not Found

---

## Input Validation

- [ ] Email validation (valid format, unique)
- [ ] Password validation (non-empty, minimum length)
- [ ] Positive integer validation for IDs
- [ ] Positive decimal validation for quantities and prices
- [ ] Transaction type validation (BUY or SELL only)
- [ ] Required field validation (name, email, password, etc.)
- [ ] Proper error messages returned

---

## Error Handling

- [ ] Global error handling middleware
- [ ] Proper HTTP status codes used (200, 201, 400, 401, 403, 404, 409, 500)
- [ ] Consistent error response format
- [ ] No stack traces exposed in production
- [ ] Null/undefined handling
- [ ] Database constraint violation handling

---

## Swagger/OpenAPI Documentation

- [ ] Created swagger.js file with OpenAPI 3.0 definition
- [ ] Installed swagger-ui-express and swagger-jsdoc
- [ ] Defined all endpoints in Swagger
- [ ] Added request/response schemas for each endpoint
- [ ] Added security scheme for JWT (BearerAuth)
- [ ] Configured Swagger UI endpoint (usually /api-docs)
- [ ] Tested all endpoints in Swagger UI
- [ ] Error responses documented
- [ ] Example requests and responses provided
- [ ] All required parameters documented
- [ ] Authentication requirements clear (marked with security)

---

## Database Seeding

- [ ] Created `prisma/seeds.js` file
- [ ] Seeding script creates test users
  - [ ] owner@example.com / Password123!
  - [ ] not-owner@example.com / Password123!
- [ ] Seeding script creates sample portfolios
- [ ] Seeding script creates sample holdings
- [ ] Seeding script creates sample transactions
- [ ] Configured seed script in package.json
- [ ] Can run with `npm run seed` or `npx prisma db seed`
- [ ] Script cleans database before seeding (for idempotency)

---

## Testing Plan

- [ ] Created comprehensive testing plan document
- [ ] Included setup instructions (login, token management)
- [ ] Documented all authentication endpoints
  - [ ] Signup success and error cases
  - [ ] Login success and error cases
- [ ] Documented all portfolio endpoints
  - [ ] Create, read, update, delete
  - [ ] Authorization checks
  - [ ] All error cases
- [ ] Documented all holding endpoints
  - [ ] Create, read, update, delete
  - [ ] Authorization checks
  - [ ] All error cases
- [ ] Documented all transaction endpoints
  - [ ] Create (BUY/SELL)
  - [ ] Read, update, delete
  - [ ] 409 Conflict case (sell exceeds holdings)
  - [ ] All error cases
- [ ] Step-by-step Swagger UI instructions
- [ ] Clear expected responses for each test
- [ ] Test credentials provided
- [ ] Total of 20+ test cases

---

## Deployment to Render

- [ ] GitHub repository created and pushed
- [ ] Render account created
- [ ] Connected GitHub repository to Render
- [ ] Created PostgreSQL database on Render
- [ ] Set environment variables in Render:
  - [ ] DATABASE_URL
  - [ ] JWT_SECRET
  - [ ] NODE_ENV=production
- [ ] Set build command: `npm install && npx prisma migrate deploy && npm run seed`
- [ ] Set start command: `npm start`
- [ ] API is publicly accessible via live URL
- [ ] Swagger documentation accessible at /api-docs
- [ ] Database migrations run on deploy
- [ ] Seed data automatically populated

---

## Code Quality

- [ ] Layered architecture implemented (routes, controllers, services, repositories)
- [ ] No hardcoded secrets
- [ ] Environment variables properly managed
- [ ] Consistent naming conventions
- [ ] Code is well-organized
- [ ] Comments where necessary
- [ ] README.md created with:
  - [ ] Project description
  - [ ] Tech stack
  - [ ] Setup instructions
  - [ ] Database migration instructions
  - [ ] Deployment instructions
  - [ ] API documentation link
  - [ ] Testing plan location

---

## Submission

- [ ] GitHub repository link ready
- [ ] Render API URL ready
- [ ] Render Swagger UI link ready
- [ ] Testing plan finalized
- [ ] PDF document created with:
  - [ ] Repository link
  - [ ] API URL link
  - [ ] Swagger documentation link
  - [ ] Complete testing plan
- [ ] Submitted to Canvas before deadline

---

## Final Verification

- [ ] Test all endpoints in Swagger UI
- [ ] Verify authorization works (403 for non-owners)
- [ ] Verify authentication required (401 without token)
- [ ] Test with both user accounts
- [ ] Verify cascade deletes work
- [ ] Verify timestamps are correct
- [ ] Verify error messages are helpful
- [ ] Check API response formats match design doc
- [ ] Verify decimal precision for financial data
- [ ] Ensure no console errors in browser
- [ ] Test on production Render URL

---

## Quick Start Commands

```bash
# Setup
npm install
npx prisma migrate dev --name init
npx prisma db seed

# Development
npm start

# Render deployment
# Push to GitHub, Render auto-deploys

# Check database
npx prisma studio
```

---

**Total Items:** 100+
**Status:** Track as you complete each item

Good luck with your implementation!
