#!/usr/bin/env node

/**
 * Investment Portfolio Tracker API - Generator Script
 * 
 * Usage:
 *   export ANTHROPIC_API_KEY="your-key"
 *   node generate-api.js
 * 
 * Or on Windows:
 *   set ANTHROPIC_API_KEY=your-key
 *   node generate-api.js
 */

const fs = require("fs");
const path = require("path");

// Check if Anthropic SDK is installed
let Anthropic;
try {
  Anthropic = require("@anthropic-ai/sdk");
} catch (error) {
  console.error("❌ @anthropic-ai/sdk not installed.");
  console.error("   Run: npm install @anthropic-ai/sdk");
  process.exit(1);
}

// Check for API key
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("❌ ANTHROPIC_API_KEY environment variable not set.");
  console.error(
    "   Set it with: export ANTHROPIC_API_KEY='your-api-key' (macOS/Linux)"
  );
  console.error(
    "   Or: set ANTHROPIC_API_KEY=your-api-key (Windows CMD)"
  );
  process.exit(1);
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Read the anti-gravity prompt from file
 */
function readPrompt() {
  const promptPath = path.join(__dirname, "AntiGravity_Prompt.md");

  if (!fs.existsSync(promptPath)) {
    console.error(
      `❌ AntiGravity_Prompt.md not found at ${promptPath}`
    );
    console.error(
      "   Make sure AntiGravity_Prompt.md is in the same directory as this script."
    );
    process.exit(1);
  }

  return fs.readFileSync(promptPath, "utf-8");
}

/**
 * Parse Claude's response and create files
 */
function parseAndCreateFiles(response) {
  // Pattern to match FILE: blocks
  const filePattern = /FILE:\s*([^\n]+)\n---\n([\s\S]*?)(?=\nFILE:|$)/g;
  let match;
  let filesCreated = 0;
  const createdFiles = [];

  while ((match = filePattern.exec(response)) !== null) {
    const filePath = match[1].trim();
    let fileContent = match[2].trim();

    // Remove trailing dashes if present
    if (fileContent.endsWith("---")) {
      fileContent = fileContent.slice(0, -3).trim();
    }

    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`   📁 Created directory: ${dir}`);
    }

    // Write file
    fs.writeFileSync(filePath, fileContent + "\n", "utf-8");
    console.log(`   ✍️  Created: ${filePath}`);
    createdFiles.push(filePath);
    filesCreated++;
  }

  return { filesCreated, createdFiles };
}

/**
 * Main generation function
 */
async function generateAPI() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║     Investment Portfolio Tracker API Generator        ║");
  console.log("║              Powered by Claude                        ║");
  console.log("╚════════════════════════════════════════════════════════╝");
  console.log("\n");

  const prompt = readPrompt();

  console.log("🚀 Starting API generation with Claude...");
  console.log("   (This may take 30-60 seconds)\n");

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const response =
      message.content[0].type === "text" ? message.content[0].text : "";

    if (!response) {
      console.error("❌ No response from Claude. Please try again.");
      process.exit(1);
    }

    console.log("✅ Code generation complete!\n");
    console.log("📦 Creating files...\n");

    // Parse and create files
    const { filesCreated, createdFiles } = parseAndCreateFiles(response);

    if (filesCreated === 0) {
      console.warn(
        "⚠️  No files were created. Response may not have been parsed correctly."
      );
      console.log("\n📄 Raw response (first 500 chars):");
      console.log(response.substring(0, 500));
      console.log("\n💡 Copy the output above and create files manually, or");
      console.log("   check that AntiGravity_Prompt.md is in the correct format.");
      process.exit(1);
    }

    console.log(`\n✨ Success! Created ${filesCreated} files:\n`);
    createdFiles.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`);
    });

    console.log("\n");
    console.log("╔════════════════════════════════════════════════════════╗");
    console.log("║                  Next Steps                           ║");
    console.log("╚════════════════════════════════════════════════════════╝");
    console.log("\n");
    console.log("1. Install dependencies:");
    console.log("   npm install\n");

    console.log("2. Create .env file:");
    console.log(
      '   echo \'DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_tracker"\' > .env'
    );
    console.log('   echo \'JWT_SECRET="your-secret-key"\' >> .env');
    console.log('   echo \'NODE_ENV="development"\' >> .env');
    console.log('   echo \'PORT=3000\' >> .env\n');

    console.log("3. Setup database:");
    console.log("   npx prisma migrate dev --name init");
    console.log("   npx prisma db seed\n");

    console.log("4. Start development server:");
    console.log("   npm start\n");

    console.log("5. Visit Swagger UI:");
    console.log("   http://localhost:3000/api-docs\n");

    console.log("6. Push to GitHub:");
    console.log("   git init");
    console.log("   git add .");
    console.log('   git commit -m "Initial API generation"');
    console.log("   git remote add origin <your-repo-url>");
    console.log("   git push -u origin main\n");

    console.log("7. Deploy to Render:");
    console.log("   Visit https://render.com and connect your repository\n");

    console.log("📚 For detailed instructions, see:");
    console.log("   How_To_Use_AntiGravity.md\n");

  } catch (error) {
    if (error.status === 401) {
      console.error("❌ Authentication failed. Check your ANTHROPIC_API_KEY");
      process.exit(1);
    } else if (error.status === 429) {
      console.error("❌ Rate limited. Please wait a moment and try again.");
      process.exit(1);
    } else if (error.message?.includes("ENOENT")) {
      console.error("❌ File not found. Check AntiGravity_Prompt.md exists.");
      process.exit(1);
    } else {
      console.error("❌ Error generating API:");
      console.error(error.message);
      process.exit(1);
    }
  }
}

// Run if executed directly
if (require.main === module) {
  generateAPI();
}

module.exports = { generateAPI, parseAndCreateFiles };
