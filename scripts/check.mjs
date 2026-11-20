#!/usr/bin/env node
/**
 * scripts/check.mjs
 * Standalone link and asset guard (zero dependencies).
 * Scans index.html, 404.html, and js/data.js.
 * Fails with a list if any href/src/url contains "PASTE", "<<", "TODO", "seller_dashboard",
 * an empty "#"-only link, or if any local file does not exist on disk.
 * Prints every external https URL found so it can be verified by hand.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const FORBIDDEN = ["PASTE", "<<", "TODO", "seller_dashboard"];
const failures = [];
const externalUrls = new Set();

function checkValue(file, type, rawVal) {
  if (!rawVal || typeof rawVal !== "string") return;
  const val = rawVal.trim();
  if (!val) return;

  // 1. Check for empty "#" link
  if (val === "#") {
    failures.push({ file, type, value: val, reason: 'empty "#"-only link' });
    return;
  }

  // 2. Check for forbidden substrings
  for (const forbidden of FORBIDDEN) {
    if (val.includes(forbidden)) {
      failures.push({ file, type, value: val, reason: `contains "${forbidden}"` });
      return;
    }
  }

  // 3. External URLs
  if (val.startsWith("https://")) {
    externalUrls.add(val);
    return;
  }
  if (val.startsWith("http://")) {
    failures.push({ file, type, value: val, reason: "insecure http:// URL (must use https://)" });
    return;
  }
  if (val.startsWith("mailto:") || val.startsWith("tel:") || val.startsWith("#")) {
    // In-page anchor or mailto/tel is fine
    return;
  }

  // 4. Local file paths: check existence on disk
  // Strip query parameters (e.g., ?v=4.3) and hash fragments
  const cleanPath = val.split("?")[0].split("#")[0];
  if (!cleanPath) return;

  // Resolve root-relative or relative path
  const localDiskPath = cleanPath.startsWith("/")
    ? path.join(ROOT, cleanPath.slice(1))
    : path.join(ROOT, cleanPath);

  if (!fs.existsSync(localDiskPath)) {
    failures.push({
      file,
      type,
      value: val,
      reason: `local file does not exist on disk (${path.relative(ROOT, localDiskPath)})`
    });
  }
}

// ============================================================================
// 1. Scan HTML files (index.html, 404.html)
// ============================================================================
const htmlFiles = ["index.html", "404.html"];

for (const relFile of htmlFiles) {
  const filePath = path.join(ROOT, relFile);
  if (!fs.existsSync(filePath)) {
    failures.push({ file: relFile, type: "file", value: relFile, reason: "file not found on disk" });
    continue;
  }

  const content = fs.readFileSync(filePath, "utf-8");

  // Regex to extract href and src attribute values
  const attrRegex = /(?:href|src)=["']([^"']*)["']/gi;
  let match;
  while ((match = attrRegex.exec(content)) !== null) {
    const val = match[1];
    checkValue(relFile, "href/src", val);
  }
}

// ============================================================================
// 2. Scan js/data.js
// ============================================================================
const dataFile = "js/data.js";
const dataFilePath = path.join(ROOT, dataFile);

if (fs.existsSync(dataFilePath)) {
  const content = fs.readFileSync(dataFilePath, "utf-8");

  // A. Check src properties (e.g. src: "path/to/media.mp3")
  const srcRegex = /\bsrc\s*:\s*["']([^"']+)["']/g;
  let match;
  while ((match = srcRegex.exec(content)) !== null) {
    checkValue(dataFile, "src", match[1]);
  }

  // B. Check url / link / repo properties
  const urlPropRegex = /\b(?:url|repo|demo|spotifyEmbedUrl|fiverr|github|instagram|linkedin|siteUrl)\s*:\s*["']([^"']+)["']/g;
  while ((match = urlPropRegex.exec(content)) !== null) {
    checkValue(dataFile, "link", match[1]);
  }
} else {
  failures.push({ file: dataFile, type: "file", value: dataFile, reason: "file not found on disk" });
}

// ============================================================================
// Output Results
// ============================================================================
console.log("================================================================================");
console.log("🔗 LINK & ASSET GUARD AUDIT REPORT (scripts/check.mjs)");
console.log("================================================================================");

console.log(`\n📌 External HTTPS URLs found (${externalUrls.size}):`);
const sortedUrls = Array.from(externalUrls).sort();
sortedUrls.forEach((u) => console.log(`  - ${u}`));

if (failures.length > 0) {
  console.log(`\n❌ FAILURES FOUND (${failures.length}):`);
  failures.forEach((f, idx) => {
    console.log(`  ${idx + 1}. [${f.file}] (${f.type}) "${f.value}" -> ${f.reason}`);
  });
  console.log("\n❌ Audit check failed.");
  process.exit(1);
} else {
  console.log("\n✅ All links, sources, and local disk paths passed successfully!");
  process.exit(0);
}

