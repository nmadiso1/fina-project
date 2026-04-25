# 🚀 Quick Start: Generate Your API in 3 Minutes

## Super Quick Start

### 1️⃣ Get Your API Key

Visit [api.anthropic.com](https://api.anthropic.com) and get your API key.

### 2️⃣ Create Project Directory

```bash
mkdir investment-portfolio-tracker
cd investment-portfolio-tracker
```

### 3️⃣ Copy These Files Here

You should have these 3 files in your project directory:
- `AntiGravity_Prompt.md`
- `generate-api.js`
- `package.json` (create below)

### 4️⃣ Create Initial package.json

```bash
cat > package.json << 'EOF'
{
  "name": "investment-portfolio-tracker",
  "version": "1.0.0",
  "description": "Investment Portfolio Tracker API",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "seed": "npx prisma db seed",
    "migrate": "npx prisma migrate dev"
  },
  "keywords": ["api", "portfolio", "investment"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "@prisma/client": "^5.8.0",
    "bcrypt": "^5.1.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.1.2",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "prisma": "^5.8.0",
    "nodemon": "^3.0.2"
  }
}
EOF
```

### 5️⃣ Install Anthropic SDK

```bash
npm install @anthropic-ai/sdk
```

### 6️⃣ Set API Key and Generate

**On macOS/Linux:**
```bash
export ANTHROPIC_API_KEY="sk-ant-..." 
node generate-api.js
```

**On Windows (CMD):**
```bash
set ANTHROPIC_API_KEY=sk-ant-...
node generate-api.js
```

**On Windows (PowerShell):**
```powershell
$env:ANTHROPIC_API_KEY="sk-ant-..."
node generate-api.js
```

## What You'll See

```
╔════════════════════════════════════════════════════════╗
║     Investment Portfolio Tracker API Generator        ║
║              Powered by Claude                        ║
╚════════════════════════════════════════════════════════╝

🚀 Starting API generation with Claude...
   (This may take 30-60 seconds)

✅ Code generation complete!

📦 Creating files...

   📁 Created directory: src/config
   ✍️  Created: prisma/schema.prisma
   ✍️  Created: src/config/database.js
   ✍️  Created: src/middleware/authentication.js
   ... (21 files total)

✨ Success! Created 21 files:
   1. prisma/schema.prisma
   2. src/config/database.js
   ... (and 19 more)
```

## After Generation

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Environment
```bash
cat > .env << 'EOF'
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_tracker"
JWT_SECRET="your-super-secret-key-change-this"
NODE_ENV="development"
PORT=3000
EOF
```

### Step 3: Create Local Database

**Using PostgreSQL locally:**

```bash
# Create database
createdb portfolio_tracker

# Update DATABASE_URL in .env to:
# DATABASE_URL="postgresql://localhost/portfolio_tracker"
```

Or use a cloud database (Neon, Supabase, etc.) and update the URL.

### Step 4: Run Migrations & Seed
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### Step 5: Start Server
```bash
npm start
```

You'll see:
```
Server running on http://localhost:3000
Swagger UI: http://localhost:3000/api-docs
```

### Step 6: Test It Out

Open your browser to: **http://localhost:3000/api-docs**

Try this:
1. Click "Authorize" (top right)
2. Try POST /api/auth/login
3. Use credentials: owner@example.com / Password123!
4. Copy the token it returns

Now you can test all other endpoints!

---

## Troubleshooting

### "ANTHROPIC_API_KEY not found"
```bash
# Check it's set
echo $ANTHROPIC_API_KEY

# If empty, set it again
export ANTHROPIC_API_KEY="your-key-here"
```

### "@anthropic-ai/sdk not installed"
```bash
npm install @anthropic-ai/sdk
```

### "Database connection failed"
- Install PostgreSQL locally, OR
- Use a cloud database (Neon, Supabase, Railway)
- Update DATABASE_URL in .env

### "Port 3000 already in use"
```bash
# Change PORT in .env
echo "PORT=3001" >> .env
```

### Files weren't created
- Check AntiGravity_Prompt.md exists
- Make sure API key is correct
- Check internet connection
- Run again with: `node generate-api.js`

---

## File Structure After Generation

```
investment-portfolio-tracker/
├── src/
│   ├── config/database.js
│   ├── middleware/
│   │   ├── authentication.js
│   │   ├── authorization.js
│   │   └── errorHandler.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── portfolioController.js
│   │   ├── holdingController.js
│   │   └── transactionController.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── portfolioService.js
│   │   ├── holdingService.js
│   │   └── transactionService.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── portfolios.js
│   │   ├── holdings.js
│   │   └── transactions.js
│   ├── swagger.js
│   └── app.js
├── prisma/
│   ├── schema.prisma
│   └── seeds.js
├── .env (you create this)
├── .gitignore
├── package.json
└── package-lock.json
```

---

## Next: Push to GitHub

```bash
# Initialize git
git init

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
*.log
dist/
.DS_Store
EOF

# Commit
git add .
git commit -m "Initial Investment Portfolio Tracker API"

# Add remote (create repo on github.com first)
git remote add origin https://github.com/yourusername/investment-portfolio-tracker.git
git branch -M main
git push -u origin main
```

---

## Finally: Deploy to Render

1. Visit [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `npm install && npx prisma migrate deploy && npm run seed`
   - **Start Command:** `npm start`
5. Add Environment Variables:
   - `DATABASE_URL`: Use Render's PostgreSQL
   - `JWT_SECRET`: Generate a secure key
   - `NODE_ENV`: production
6. Click "Create Web Service"
7. Done! Your API is live! 🎉

Get your live URL from the Render dashboard.

---

## Test Your Live API

1. Visit `https://your-app.onrender.com/api-docs`
2. Test all endpoints
3. Follow the testing plan (Testing_Plan_Template.md)

---

## Documentation Files

You also received:
- **Phase1_Implementation_Guide.md** - Detailed technical guide
- **Testing_Plan_Template.md** - 25+ test cases with instructions
- **Phase1_Checklist.md** - 100+ item progress tracker
- **How_To_Use_AntiGravity.md** - Detailed anti-gravity guide

---

## That's It! 🎉

You now have a fully functional REST API with:
✅ Authentication (signup/login)
✅ Authorization (ownership checks)
✅ 4 main resources with full CRUD
✅ Swagger documentation
✅ Database seeding
✅ Error handling
✅ Production-ready code

Questions? Check the detailed guides or the code comments!

**Start generating:** `node generate-api.js`
