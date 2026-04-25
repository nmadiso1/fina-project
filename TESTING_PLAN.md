# API Testing Plan - Investment Portfolio Tracker

This guide provides step-by-step instructions to verify the Investment Portfolio Tracker API using the built-in **Swagger UI**.

**API Base URL:** `https://portfolio-tracker-api-gaqb.onrender.com`
**Interactive Docs:** [https://portfolio-tracker-api-gaqb.onrender.com/api-docs/](https://portfolio-tracker-api-gaqb.onrender.com/api-docs/)

---

## 🔑 Authentication Setup (Required for Protected Endpoints)

Before testing protected resources, you must obtain a JWT and authorize the Swagger UI.

1. **Login as Owner:**
   - Endpoint: `POST /api/auth/login`
   - Body: 
     ```json
     { "email": "owner@example.com", "password": "Password123!" }
     ```
   - **Success:** Copy the value of the `token` field in the response.
2. **Authorize Swagger:**
   - Click the green **Authorize** button at the top of the page.
   - Paste the token into the **Value** box (do NOT include "Bearer ").
   - Click **Authorize** then **Close**.

---

## 1. Authentication Endpoints

### POST /api/auth/signup
- **Access Control:** Public
- **Success Case:**
  - Click **Try it out**.
  - Body: `{ "email": "tester@example.com", "password": "Password123!" }`
  - Expect: `201 Created`
- **409 Conflict (User exists):**
  - Use `owner@example.com`.
  - Expect: `409 Conflict`

### POST /api/auth/login
- **Access Control:** Public
- **Success Case:**
  - Body: `{ "email": "owner@example.com", "password": "Password123!" }`
  - Expect: `200 OK` + `token`
- **401 Unauthorized:**
  - Use an incorrect password.
  - Expect: `401 Unauthorized`

---

## 2. Portfolio Endpoints (Owner Only)

### GET /api/portfolios
- **Access Control:** Authenticated User
- **Success Case:**
  - Click **Try it out** -> **Execute**.
  - Expect: `200 OK` with a list of 2 portfolios (Retirement, Growth).
- **401 Unauthorized:**
  - Click **Logout** in the Authorize menu, then Execute.
  - Expect: `401 Unauthorized`. (Re-authorize before continuing).

### POST /api/portfolios
- **Access Control:** Authenticated User
- **Success Case:**
  - Body: `{ "name": "New Savings", "description": "Short term" }`
  - Expect: `201 Created`
- **400 Bad Request:**
  - Leave `name` empty.
  - Expect: `400 Bad Request`

### GET /api/portfolios/{id}
- **Access Control:** Owner Only
- **Success Case:**
  - Use ID `1`.
  - Expect: `200 OK` (Retirement Portfolio).
- **403 Forbidden:**
  - Re-authorize as `not-owner@example.com` (Password: `Password123!`).
  - Attempt to GET ID `1`.
  - Expect: `403 Forbidden`.

---

## 3. Holding Endpoints (Portfolio Owner Only)

### GET /api/holdings
- **Access Control:** Portfolio Owner
- **Setup:** Authorize as `owner@example.com`.
- **Success Case:**
  - Use `portfolioId: 1`.
  - Expect: `200 OK` (AAPL, MSFT).
- **404 Not Found:**
  - Use `portfolioId: 9999`.
  - Expect: `404 Not Found`.

### POST /api/holdings
- **Access Control:** Portfolio Owner
- **Success Case:**
  - Body: `{ "portfolioId": 1, "tickerSymbol": "GOOGL" }`
  - Expect: `201 Created`. (Initial quantity/cost will be 0).

---

## 4. Transaction Endpoints (Holding Owner Only)

### POST /api/transactions
- **Access Control:** Holding Owner
- **Success Case (BUY):**
  - Body: `{ "holdingId": 1, "type": "BUY", "quantity": 10, "price": 180.50 }`
  - Expect: `201 Created`. (Refresh Holding #1 to see updated totals).
- **409 Conflict (Excessive SELL):**
  - Body: `{ "holdingId": 1, "type": "SELL", "quantity": 9999, "price": 100.00 }`
  - Expect: `409 Conflict`.

### DELETE /api/transactions/{id}
- **Access Control:** Transaction Owner
- **Success Case:**
  - Use ID `1` (First AAPL buy).
  - Expect: `200 OK`. (Refresh Holding #1; quantity/cost will recalculate automatically).
- **404 Not Found:**
  - Use ID `9999`.
  - Expect: `404 Not Found`.
