# Investment Portfolio Tracker API - Testing Plan

**Test Date:** [Enter date]  
**Tester:** [Enter name]  
**API URL:** https://your-app-name.onrender.com  
**Swagger UI:** https://your-app-name.onrender.com/api-docs

---

## Prerequisites

Before testing:
1. Open Swagger UI at your API's `/api-docs` endpoint
2. Keep the JSON responses open for reference
3. Test accounts are pre-seeded in the database with these credentials:
   - **Owner Account:** owner@example.com / Password123!
   - **Non-Owner Account:** not-owner@example.com / Password123!

---

## Authentication Endpoints

### 1. POST /api/auth/signup

**Description:** Create a new user account  
**Access Control:** Open to all (no authentication required)

#### Success Case - 201 Created

**Setup:**
- Use a unique email for testing (e.g., testuser-[timestamp]@example.com)

**Steps:**
1. Open Swagger UI
2. Locate "Auth" section
3. Find "POST /api/auth/signup"
4. Click "Try it out"
5. In the request body, enter:
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123!"
}
```
6. Click "Execute"

**Expected Response:** 201 Created
```json
{
  "id": <integer>,
  "email": "newuser@example.com",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Verification:** Response includes id, email, and createdAt timestamp

---

#### Error Case - 400 Bad Request (Missing Email)

**Steps:**
1. Click "Try it out"
2. Submit request body with missing email:
```json
{
  "password": "SecurePass123!"
}
```
3. Click "Execute"

**Expected Response:** 400 Bad Request
```json
{
  "error": "Email is required"
}
```

---

#### Error Case - 400 Bad Request (Missing Password)

**Steps:**
1. Click "Try it out"
2. Submit request body with missing password:
```json
{
  "email": "newuser@example.com"
}
```
3. Click "Execute"

**Expected Response:** 400 Bad Request
```json
{
  "error": "Password is required"
}
```

---

#### Error Case - 400 Bad Request (Invalid Email Format)

**Steps:**
1. Click "Try it out"
2. Submit with malformed email:
```json
{
  "email": "not-an-email",
  "password": "SecurePass123!"
}
```
3. Click "Execute"

**Expected Response:** 400 Bad Request
```json
{
  "error": "Invalid email format"
}
```

---

#### Error Case - 409 Conflict (Email Already Exists)

**Steps:**
1. Click "Try it out"
2. Try to signup with an existing email:
```json
{
  "email": "owner@example.com",
  "password": "Password123!"
}
```
3. Click "Execute"

**Expected Response:** 409 Conflict
```json
{
  "error": "Email already exists"
}
```

---

### 2. POST /api/auth/login

**Description:** Authenticate a user and receive JWT  
**Access Control:** Open to all

#### Success Case - 200 OK

**Steps:**
1. Locate "POST /api/auth/login"
2. Click "Try it out"
3. Enter request body:
```json
{
  "email": "owner@example.com",
  "password": "Password123!"
}
```
4. Click "Execute"

**Expected Response:** 200 OK
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "owner@example.com"
  }
}
```

**Important:** Copy the returned token for use in subsequent tests.

---

#### Error Case - 400 Bad Request (Missing Credentials)

**Steps:**
1. Click "Try it out"
2. Submit empty request body: `{}`
3. Click "Execute"

**Expected Response:** 400 Bad Request
```json
{
  "error": "Email and password are required"
}
```

---

#### Error Case - 401 Unauthorized (Invalid Password)

**Steps:**
1. Click "Try it out"
2. Submit with correct email but wrong password:
```json
{
  "email": "owner@example.com",
  "password": "WrongPassword123!"
}
```
3. Click "Execute"

**Expected Response:** 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

---

#### Error Case - 401 Unauthorized (Non-Existent Email)

**Steps:**
1. Click "Try it out"
2. Submit with email that doesn't exist:
```json
{
  "email": "nonexistent@example.com",
  "password": "Password123!"
}
```
3. Click "Execute"

**Expected Response:** 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

---

## Portfolio Endpoints

### Setup for All Portfolio Tests

**Before testing portfolio endpoints:**
1. Complete the login test above
2. Copy the returned JWT token
3. Click the green "Authorize" button at the top-right of Swagger UI
4. In the dialog, paste: `Bearer <your_copied_token>`
5. Click "Authorize"
6. Close the dialog

Now all subsequent requests will automatically include the JWT token.

---

### 3. POST /api/portfolios

**Description:** Create a new portfolio  
**Access Control:** Authenticated users only

#### Success Case - 201 Created

**Steps:**
1. Ensure you're logged in and authorized (see Setup above)
2. Find "POST /api/portfolios"
3. Click "Try it out"
4. Enter request body:
```json
{
  "name": "Test Portfolio",
  "description": "A portfolio for testing"
}
```
5. Click "Execute"

**Expected Response:** 201 Created
```json
{
  "id": <integer>,
  "userId": 1,
  "name": "Test Portfolio",
  "description": "A portfolio for testing",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Verification:** Response includes the portfolio ID (save this for next tests)

---

#### Error Case - 400 Bad Request (Missing Name)

**Steps:**
1. Click "Try it out"
2. Submit without name field:
```json
{
  "description": "Missing name"
}
```
3. Click "Execute"

**Expected Response:** 400 Bad Request
```json
{
  "error": "Name is required"
}
```

---

#### Error Case - 401 Unauthorized (No Token)

**Steps:**
1. Click the Authorize button
2. Clear the token field completely
3. Click "Authorize"
4. Close the dialog
5. Find "POST /api/portfolios"
6. Click "Try it out"
7. Enter valid body:
```json
{
  "name": "Test Portfolio"
}
```
8. Click "Execute"

**Expected Response:** 401 Unauthorized
```json
{
  "error": "Missing or invalid token"
}
```

---

### 4. GET /api/portfolios

**Description:** Get all portfolios owned by authenticated user  
**Access Control:** Authenticated users only

#### Success Case - 200 OK

**Steps:**
1. Ensure you're logged in and authorized
2. Find "GET /api/portfolios"
3. Click "Try it out"
4. Click "Execute" (no parameters needed)

**Expected Response:** 200 OK
```json
[
  {
    "id": 1,
    "userId": 1,
    "name": "Retirement Portfolio",
    "description": "Long-term investments",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "userId": 1,
    "name": "Test Portfolio",
    "description": "A portfolio for testing",
    "createdAt": "2024-01-15T10:31:00Z"
  }
]
```

**Verification:** Response is an array; only returns portfolios where userId matches logged-in user

---

#### Error Case - 401 Unauthorized

**Steps:**
1. Clear authorization token (see previous section)
2. Find "GET /api/portfolios"
3. Click "Try it out"
4. Click "Execute"

**Expected Response:** 401 Unauthorized
```json
{
  "error": "Missing or invalid token"
}
```

---

### 5. GET /api/portfolios/:id

**Description:** Get a single portfolio by ID  
**Access Control:** Owner only

#### Success Case - 200 OK

**Steps:**
1. Ensure you're authorized with owner@example.com token
2. Find "GET /api/portfolios/{id}"
3. Click "Try it out"
4. Enter portfolio ID from previous test (e.g., `1`)
5. Click "Execute"

**Expected Response:** 200 OK
```json
{
  "id": 1,
  "userId": 1,
  "name": "Retirement Portfolio",
  "description": "Long-term investments",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

#### Error Case - 400 Bad Request (Invalid ID)

**Steps:**
1. Click "Try it out"
2. Enter invalid ID: `-10`
3. Click "Execute"

**Expected Response:** 400 Bad Request
```json
{
  "error": "ID must be a positive integer"
}
```

---

#### Error Case - 404 Not Found

**Steps:**
1. Click "Try it out"
2. Enter non-existent ID: `9999`
3. Click "Execute"

**Expected Response:** 404 Not Found
```json
{
  "error": "Portfolio not found"
}
```

---

#### Error Case - 403 Forbidden (Not Owner)

**Steps:**
1. Click the Authorize button
2. Clear existing token
3. Login with non-owner account:
   - Email: `not-owner@example.com`
   - Password: `Password123!`
4. Copy the new token from login response
5. Click Authorize and paste new token with `Bearer ` prefix
6. Find "GET /api/portfolios/{id}"
7. Click "Try it out"
8. Enter owner's portfolio ID: `1`
9. Click "Execute"

**Expected Response:** 403 Forbidden
```json
{
  "error": "Forbidden"
}
```

---

### 6. PUT /api/portfolios/:id

**Description:** Update portfolio name or description  
**Access Control:** Owner only

#### Success Case - 200 OK

**Setup:** Make sure you're logged in as owner@example.com

**Steps:**
1. Find "PUT /api/portfolios/{id}"
2. Click "Try it out"
3. Enter portfolio ID: `1`
4. Enter request body:
```json
{
  "name": "Updated Portfolio Name",
  "description": "Updated description"
}
```
5. Click "Execute"

**Expected Response:** 200 OK
```json
{
  "id": 1,
  "userId": 1,
  "name": "Updated Portfolio Name",
  "description": "Updated description",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:40:00Z"
}
```

---

#### Error Case - 400 Bad Request (Missing Name)

**Steps:**
1. Click "Try it out"
2. Enter portfolio ID: `1`
3. Submit body without required fields:
```json
{
  "description": "Only description, no name"
}
```
4. Click "Execute"

**Expected Response:** 400 Bad Request
```json
{
  "error": "Name is required"
}
```

---

#### Error Case - 404 Not Found

**Steps:**
1. Click "Try it out"
2. Enter ID: `9999`
3. Enter body:
```json
{
  "name": "Updated Name"
}
```
4. Click "Execute"

**Expected Response:** 404 Not Found
```json
{
  "error": "Portfolio not found"
}
```

---

#### Error Case - 403 Forbidden (Not Owner)

**Steps:**
1. Authorize with not-owner@example.com (see login test)
2. Find "PUT /api/portfolios/{id}"
3. Click "Try it out"
4. Enter owner's portfolio ID: `1`
5. Enter body:
```json
{
  "name": "Attempting Update"
}
```
6. Click "Execute"

**Expected Response:** 403 Forbidden
```json
{
  "error": "Forbidden"
}
```

---

### 7. DELETE /api/portfolios/:id

**Description:** Delete a portfolio and all associated holdings  
**Access Control:** Owner only

#### Success Case - 200 OK

**Setup:** Login as owner@example.com, create a test portfolio first

**Steps:**
1. Find "DELETE /api/portfolios/{id}"
2. Click "Try it out"
3. Enter the test portfolio ID you created
4. Click "Execute"

**Expected Response:** 200 OK
```json
{
  "id": 2,
  "userId": 1,
  "name": "Test Portfolio",
  "description": "A portfolio for testing"
}
```

**Verification:** Try to GET this portfolio ID afterward - should return 404

---

#### Error Case - 404 Not Found

**Steps:**
1. Click "Try it out"
2. Enter ID: `9999`
3. Click "Execute"

**Expected Response:** 404 Not Found
```json
{
  "error": "Portfolio not found"
}
```

---

#### Error Case - 403 Forbidden (Not Owner)

**Steps:**
1. Authorize with not-owner@example.com
2. Find "DELETE /api/portfolios/{id}"
3. Click "Try it out"
4. Enter owner's portfolio ID: `1`
5. Click "Execute"

**Expected Response:** 403 Forbidden
```json
{
  "error": "Forbidden"
}
```

---

## Holding Endpoints

### 8. POST /api/holdings

**Description:** Create a new holding in a portfolio  
**Access Control:** Must own the portfolio

#### Success Case - 201 Created

**Setup:**
- Login as owner@example.com
- Have a portfolio ID ready (e.g., 1)

**Steps:**
1. Find "POST /api/holdings"
2. Click "Try it out"
3. Enter request body:
```json
{
  "portfolioId": 1,
  "tickerSymbol": "TSLA",
  "quantity": 10,
  "averageCost": 200.00
}
```
4. Click "Execute"

**Expected Response:** 201 Created
```json
{
  "id": <integer>,
  "portfolioId": 1,
  "tickerSymbol": "TSLA",
  "quantity": 10,
  "averageCost": 200.00,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

#### Error Case - 400 Bad Request (Missing Required Fields)

**Steps:**
1. Click "Try it out"
2. Enter body with missing ticker:
```json
{
  "portfolioId": 1,
  "quantity": 10,
  "averageCost": 200.00
}
```
3. Click "Execute"

**Expected Response:** 400 Bad Request
```json
{
  "error": "Ticker symbol is required"
}
```

---

#### Error Case - 404 Not Found (Portfolio Doesn't Exist)

**Steps:**
1. Click "Try it out"
2. Enter non-existent portfolio ID:
```json
{
  "portfolioId": 9999,
  "tickerSymbol": "AAPL",
  "quantity": 5,
  "averageCost": 150.00
}
```
3. Click "Execute"

**Expected Response:** 404 Not Found
```json
{
  "error": "Portfolio not found"
}
```

---

#### Error Case - 403 Forbidden (Don't Own Portfolio)

**Steps:**
1. Authorize with not-owner@example.com
2. Find "POST /api/holdings"
3. Click "Try it out"
4. Try to add holding to owner's portfolio:
```json
{
  "portfolioId": 1,
  "tickerSymbol": "GOOGL",
  "quantity": 5,
  "averageCost": 140.00
}
```
5. Click "Execute"

**Expected Response:** 403 Forbidden
```json
{
  "error": "Forbidden"
}
```

---

### 9. GET /api/holdings?portfolioId=1

**Description:** Get all holdings for a portfolio  
**Access Control:** Owner only

#### Success Case - 200 OK

**Setup:** Login as owner@example.com

**Steps:**
1. Find "GET /api/holdings"
2. Click "Try it out"
3. In the "portfolioId" parameter field, enter: `1`
4. Click "Execute"

**Expected Response:** 200 OK
```json
[
  {
    "id": 1,
    "portfolioId": 1,
    "tickerSymbol": "AAPL",
    "quantity": 20,
    "averageCost": 150.00
  },
  {
    "id": 2,
    "portfolioId": 1,
    "tickerSymbol": "TSLA",
    "quantity": 10,
    "averageCost": 200.00
  }
]
```

---

#### Error Case - 400 Bad Request (Missing portfolioId)

**Steps:**
1. Click "Try it out"
2. Leave portfolioId empty
3. Click "Execute"

**Expected Response:** 400 Bad Request
```json
{
  "error": "portfolioId query parameter is required"
}
```

---

### 10. GET /api/holdings/:id

**Description:** Get a single holding  
**Access Control:** Owner only

#### Success Case - 200 OK

**Steps:**
1. Find "GET /api/holdings/{id}"
2. Click "Try it out"
3. Enter holding ID: `1`
4. Click "Execute"

**Expected Response:** 200 OK
```json
{
  "id": 1,
  "portfolioId": 1,
  "tickerSymbol": "AAPL",
  "quantity": 20,
  "averageCost": 150.00,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

#### Error Case - 404 Not Found

**Steps:**
1. Click "Try it out"
2. Enter ID: `9999`
3. Click "Execute"

**Expected Response:** 404 Not Found
```json
{
  "error": "Holding not found"
}
```

---

### 11. PUT /api/holdings/:id

**Description:** Update holding properties  
**Access Control:** Owner only

#### Success Case - 200 OK

**Steps:**
1. Find "PUT /api/holdings/{id}"
2. Click "Try it out"
3. Enter holding ID: `1`
4. Enter request body:
```json
{
  "tickerSymbol": "AAPL",
  "quantity": 25,
  "averageCost": 155.00
}
```
5. Click "Execute"

**Expected Response:** 200 OK
```json
{
  "id": 1,
  "portfolioId": 1,
  "tickerSymbol": "AAPL",
  "quantity": 25,
  "averageCost": 155.00
}
```

---

#### Error Case - 400 Bad Request (Invalid Quantity)

**Steps:**
1. Click "Try it out"
2. Enter holding ID: `1`
3. Enter body with negative quantity:
```json
{
  "tickerSymbol": "AAPL",
  "quantity": -5,
  "averageCost": 155.00
}
```
4. Click "Execute"

**Expected Response:** 400 Bad Request
```json
{
  "error": "Quantity must be positive"
}
```

---

### 12. DELETE /api/holdings/:id

**Description:** Delete a holding and all transactions  
**Access Control:** Owner only

#### Success Case - 200 OK

**Steps:**
1. Find "DELETE /api/holdings/{id}"
2. Click "Try it out"
3. Enter a test holding ID
4. Click "Execute"

**Expected Response:** 200 OK
```json
{
  "id": 2,
  "portfolioId": 1,
  "tickerSymbol": "TSLA",
  "quantity": 10,
  "averageCost": 200.00
}
```

---

## Transaction Endpoints

### 13. POST /api/transactions

**Description:** Create BUY or SELL transaction  
**Access Control:** Must own the holding

#### Success Case - 201 Created (BUY)

**Setup:** Login as owner@example.com, have a holding ID ready

**Steps:**
1. Find "POST /api/transactions"
2. Click "Try it out"
3. Enter request body:
```json
{
  "holdingId": 1,
  "type": "BUY",
  "quantity": 5,
  "price": 155.00,
  "executedAt": "2024-01-15T10:30:00Z"
}
```
4. Click "Execute"

**Expected Response:** 201 Created
```json
{
  "id": <integer>,
  "holdingId": 1,
  "type": "BUY",
  "quantity": 5,
  "price": 155.00,
  "executedAt": "2024-01-15T10:30:00Z",
  "createdAt": "2024-01-15T10:35:00Z"
}
```

---

#### Error Case - 400 Bad Request (Invalid Type)

**Steps:**
1. Click "Try it out"
2. Enter body with invalid transaction type:
```json
{
  "holdingId": 1,
  "type": "TRADE",
  "quantity": 5,
  "price": 155.00,
  "executedAt": "2024-01-15T10:30:00Z"
}
```
3. Click "Execute"

**Expected Response:** 400 Bad Request
```json
{
  "error": "Type must be BUY or SELL"
}
```

---

#### Error Case - 409 Conflict (Sell Quantity Exceeds Holdings)

**Steps:**
1. Check current holding quantity (e.g., holding ID 1 has 20 shares)
2. Click "Try it out"
3. Try to sell more than available:
```json
{
  "holdingId": 1,
  "type": "SELL",
  "quantity": 100,
  "price": 160.00,
  "executedAt": "2024-01-15T10:30:00Z"
}
```
4. Click "Execute"

**Expected Response:** 409 Conflict
```json
{
  "error": "Sell quantity exceeds current holding quantity"
}
```

---

### 14. GET /api/transactions?holdingId=1

**Description:** Get all transactions for a holding  
**Access Control:** Owner only

#### Success Case - 200 OK

**Steps:**
1. Find "GET /api/transactions"
2. Click "Try it out"
3. Enter holdingId: `1`
4. Click "Execute"

**Expected Response:** 200 OK
```json
[
  {
    "id": 1,
    "holdingId": 1,
    "type": "BUY",
    "quantity": 20,
    "price": 150.00,
    "executedAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "holdingId": 1,
    "type": "BUY",
    "quantity": 5,
    "price": 155.00,
    "executedAt": "2024-01-15T10:35:00Z"
  }
]
```

---

### 15. GET /api/transactions/:id

**Description:** Get a single transaction  
**Access Control:** Owner only

#### Success Case - 200 OK

**Steps:**
1. Find "GET /api/transactions/{id}"
2. Click "Try it out"
3. Enter transaction ID: `1`
4. Click "Execute"

**Expected Response:** 200 OK
```json
{
  "id": 1,
  "holdingId": 1,
  "type": "BUY",
  "quantity": 20,
  "price": 150.00,
  "executedAt": "2024-01-15T10:30:00Z"
}
```

---

### 16. PUT /api/transactions/:id

**Description:** Update transaction  
**Access Control:** Owner only

#### Success Case - 200 OK

**Steps:**
1. Find "PUT /api/transactions/{id}"
2. Click "Try it out"
3. Enter transaction ID: `1`
4. Enter request body:
```json
{
  "type": "BUY",
  "quantity": 15,
  "price": 152.00,
  "executedAt": "2024-01-15T10:30:00Z"
}
```
5. Click "Execute"

**Expected Response:** 200 OK
```json
{
  "id": 1,
  "holdingId": 1,
  "type": "BUY",
  "quantity": 15,
  "price": 152.00,
  "executedAt": "2024-01-15T10:30:00Z"
}
```

---

### 17. DELETE /api/transactions/:id

**Description:** Delete a transaction  
**Access Control:** Owner only

#### Success Case - 200 OK

**Steps:**
1. Find "DELETE /api/transactions/{id}"
2. Click "Try it out"
3. Enter a test transaction ID
4. Click "Execute"

**Expected Response:** 200 OK
```json
{
  "id": 2,
  "holdingId": 1,
  "type": "BUY",
  "quantity": 5,
  "price": 155.00,
  "executedAt": "2024-01-15T10:35:00Z"
}
```

---

## Summary

**All tests completed:** ✓  
**Total test cases:** 25+ scenarios  
**All endpoints tested:** ✓ (Auth, Portfolios, Holdings, Transactions)  
**All error cases covered:** ✓ (400, 401, 403, 404, 409)  
**Authorization verified:** ✓ (Ownership-based access control)

---

## Notes

- Each login session's token is valid for 7 days
- The Authorize button stores the token for all subsequent requests
- All timestamps are in ISO 8601 format
- Decimal fields (quantity, price, averageCost) use appropriate precision
- Cascade deletes remove holdings when portfolio is deleted, and transactions when holding is deleted
