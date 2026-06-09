/**
 * post-build.js
 *
 * Next.js standalone output does NOT automatically include the public/ folder
 * or the .next/static/ assets inside the standalone directory.
 * This script copies them so the standalone server can serve them correctly.
 *
 * Run automatically via the "postbuild" npm script after `next build`.
 */

const { cpSync, existsSync } = require("fs");
const { join } = require("path");

const root = join(__dirname, "..");
const standaloneDir = join(root, ".next", "standalone");

if (!existsSync(standaloneDir)) {
  console.log("⚠  No standalone directory found — skipping post-build copy.");
  process.exit(0);
}

// Copy public/ → .next/standalone/public/
const publicSrc = join(root, "public");
if (existsSync(publicSrc)) {
  cpSync(publicSrc, join(standaloneDir, "public"), { recursive: true });
  console.log("✓ Copied public/ into standalone");
}

// Copy .next/static/ → .next/standalone/.next/static/
const staticSrc = join(root, ".next", "static");
if (existsSync(staticSrc)) {
  cpSync(staticSrc, join(standaloneDir, ".next", "static"), { recursive: true });
  console.log("✓ Copied .next/static/ into standalone");
}

console.log("✓ Post-build complete — standalone server is ready.");
