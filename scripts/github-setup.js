#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 LibRaw Node.js - GitHub Setup");
console.log("=================================\n");

try {
  // Check if git is available
  console.log("📋 Checking prerequisites...");
  execSync("git --version", { stdio: "ignore" });
  console.log("✅ Git is available");

  // Initialize git repo if not already done
  if (!fs.existsSync(".git")) {
    console.log("🔧 Initializing Git repository...");
    execSync("git init", { stdio: "inherit" });
    console.log("✅ Git repository initialized");
  } else {
    console.log("✅ Git repository already exists");
  }

  // Add all files
  console.log("📦 Adding files to git...");
  execSync("git add .", { stdio: "inherit" });
  console.log("✅ Files added");

  // Check if there are changes to commit
  try {
    execSync("git diff --staged --quiet", { stdio: "ignore" });
    console.log("ℹ️  No changes to commit");
  } catch (error) {
    // There are staged changes
    console.log("💾 Creating initial commit...");
    execSync(
      'git commit -m "feat: initial LibRaw Node.js implementation\n\n- Native addon for RAW image processing\n- Comprehensive metadata extraction\n- Promise-based API\n- Sample tests and examples\n- GitHub-ready project structure"',
      { stdio: "inherit" }
    );
    console.log("✅ Initial commit created");
  }

  console.log("\n🎉 Project is ready for GitHub!");
  console.log("\n📋 Next steps:");
  console.log("1. Create a new repository on GitHub");
  console.log("2. Add the remote origin:");
  console.log(
    "   git remote add origin https://github.com/unique01082/lightdrift-libraw.git"
  );
  console.log("3. Push to GitHub:");
  console.log("   git branch -M main");
  console.log("   git push -u origin main");
  console.log("\n🧪 Test the project:");
  console.log("   npm run build");
  console.log("   npm run test:quick");
  console.log("   npm run test:samples");
} catch (error) {
  console.error("❌ Error:", error.message);
  console.error("\nPlease ensure Git is installed and try again.");
  process.exit(1);
}
