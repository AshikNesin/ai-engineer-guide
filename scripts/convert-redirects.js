#!/usr/bin/env node
/**
 * Convert between Netlify _redirects file format and TOML format
 * 
 * Usage:
 *   node convert-redirects.js --to-toml    # Convert _redirects to TOML format
 *   node convert-redirects.js --to-plain   # Convert netlify.toml redirects to _redirects format
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

function parseRedirectsFile(content) {
  const lines = content.split("\n");
  const redirects = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) continue;

    const from = parts[0];
    const to = parts[1];
    let status = 301;
    let force = false;

    if (parts[2]) {
      const statusPart = parts[2];
      if (statusPart.endsWith("!")) {
        force = true;
        status = parseInt(statusPart.slice(0, -1), 10);
      } else {
        status = parseInt(statusPart, 10);
      }
    }

    redirects.push({ from, to, status, force });
  }

  return redirects;
}

function toTomlFormat(redirects) {
  let toml = "";
  for (const r of redirects) {
    toml += `[[redirects]]\n`;
    toml += `  from = "${r.from}"\n`;
    toml += `  to = "${r.to}"\n`;
    toml += `  status = ${r.status}\n`;
    if (r.force) {
      toml += `  force = true\n`;
    }
    toml += "\n";
  }
  return toml;
}

function toPlainFormat(redirects) {
  let plain = "# Netlify _redirects file\n# Format: /from /to status[!]\n\n";
  for (const r of redirects) {
    const forceFlag = r.force ? "!" : "";
    plain += `${r.from} ${r.to} ${r.status}${forceFlag}\n`;
  }
  return plain;
}

async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || "--to-toml";

  if (mode === "--to-toml") {
    const redirectsPath = path.join(projectRoot, "static/_redirects");
    const content = await fs.readFile(redirectsPath, "utf-8");
    const redirects = parseRedirectsFile(content);
    const toml = toTomlFormat(redirects);
    console.log(toml);
  } else if (mode === "--to-plain") {
    const tomlPath = path.join(projectRoot, "netlify.toml");
    const content = await fs.readFile(tomlPath, "utf-8");
    
    const redirects = [];
    const regex = /\[\[redirects\]\]\s*\n\s*from\s*=\s*"([^"]+)"\s*\n\s*to\s*=\s*"([^"]+)"\s*\n\s*status\s*=\s*(\d+)(?:\s*\n\s*force\s*=\s*(true|false))?/g;
    
    let match;
    while ((match = regex.exec(content)) !== null) {
      redirects.push({
        from: match[1],
        to: match[2],
        status: parseInt(match[3], 10),
        force: match[4] === "true"
      });
    }
    
    const plain = toPlainFormat(redirects);
    console.log(plain);
  } else {
    console.log("Usage:");
    console.log("  node convert-redirects.js --to-toml    # Convert _redirects to TOML");
    console.log("  node convert-redirects.js --to-plain   # Convert TOML to _redirects");
  }
}

main().catch(console.error);
