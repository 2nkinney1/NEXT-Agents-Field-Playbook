#!/usr/bin/env node
/**
 * patch-seed.js
 * Usage: node patch-seed.js <exported-playbook.json>
 *
 * Takes a JSON file exported from the Manage Content page and writes the
 * content back into seed-data.js so that every browser sees the same data
 * on first load (before localStorage is set).
 *
 * What gets updated:
 *   COB        ← export.cob        (strips runtime IDs; restores policy arrays)
 *   OBJECTIONS ← export.objections (strips id / deck fields)
 *   VERTICALS  ← export.verticals  (strips id / deck; strips per-product ids)
 *   RESOURCES  ← export.resources  (strips id / section)
 *   SECTIONS   ← export.sections   (kept as-is)
 *   RES_SECTIONS ← export.resSections (kept as-is)
 *   SETTINGS (toolName, toolTagline, banner) ← export.settings
 */

const fs   = require("fs");
const path = require("path");

// ── args ──────────────────────────────────────────────────────────────────
const [,, importPath] = process.argv;
if (!importPath) {
  console.error("Usage: node patch-seed.js <exported-playbook.json>");
  process.exit(1);
}

const seedPath = path.join(__dirname, "seed-data.js");

if (!fs.existsSync(importPath)) { console.error("File not found:", importPath); process.exit(1); }
if (!fs.existsSync(seedPath))   { console.error("seed-data.js not found at", seedPath); process.exit(1); }

// ── load export ───────────────────────────────────────────────────────────
let imp;
try { imp = JSON.parse(fs.readFileSync(importPath, "utf8")); }
catch (e) { console.error("Could not parse JSON:", e.message); process.exit(1); }

if (!imp.cob || !imp.objections || !imp.verticals || !imp.resources) {
  console.error("This doesn't look like a Playbook export (missing cob/objections/verticals/resources).");
  process.exit(1);
}

// ── strip runtime-only fields added by buildSeed() ───────────────────────
function stripCOB(cobArr) {
  return cobArr.map((c) => {
    const clean = { ...c };
    if (clean.policies) {
      ["must", "rec", "opt"].forEach((tier) => {
        if (Array.isArray(clean.policies[tier])) {
          clean.policies[tier] = clean.policies[tier].map((p) => {
            const { id, ...rest } = p; void id;
            return rest;
          });
        }
      });
    }
    return clean;
  });
}

function stripObjVertRes(arr, fieldsToRemove) {
  return arr.map((item) => {
    const clean = { ...item };
    fieldsToRemove.forEach((f) => delete clean[f]);
    if (clean.products) {
      clean.products = clean.products.map((p) => {
        const { id, ...rest } = p; void id;
        return rest;
      });
    }
    return clean;
  });
}

const newCOB        = stripCOB(imp.cob);
const newObjections = stripObjVertRes(imp.objections, ["id", "deck"]);
const newVerticals  = stripObjVertRes(imp.verticals,  ["id", "deck"]);
const newResources  = stripObjVertRes(imp.resources,  ["id"]);
const newSections   = imp.sections   || [];
const newResSections = imp.resSections || [];
const newSettings   = imp.settings   || {};

// ── helpers ───────────────────────────────────────────────────────────────
function serialize(val, indent = 2) {
  return JSON.stringify(val, null, indent);
}

/**
 * Replace `const NAME = <anything ending at a balanced ];>` in the source.
 * Works for array literals. We walk characters to match brackets properly.
 */
function replaceArrayConst(src, name, newArray) {
  const marker = `  const ${name} = [`;
  const start  = src.indexOf(marker);
  if (start === -1) throw new Error(`Could not find "const ${name} = [" in seed-data.js`);

  // find the matching closing ]; by counting brackets from the opening [
  let depth = 0;
  let i = start + marker.length - 1; // points at the opening [
  for (; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]") { depth--; if (depth === 0) break; }
  }
  // i now points at the closing ]
  // consume optional `;` and newline
  let end = i + 1;
  if (src[end] === ";") end++;

  const serialized = serialize(newArray, 4)
    .replace(/^/mg, "  ") // indent two extra spaces to match the IIFE scope
    .trimStart();         // but not the first line (we add it below)

  return src.slice(0, start) + `  const ${name} = ` + serialized + ";" + src.slice(end);
}

/**
 * Replace individual keys inside the SETTINGS object literal.
 */
function replaceSettingsKeys(src, settings) {
  let out = src;

  function replaceKey(s, key, value) {
    // match `  key: <anything>,` or `  key: <anything>` followed by newline/}
    const re = new RegExp(`(\\s+${key}:\\s*)([^,\\n]+)(,?)`, "");
    const replacement = `$1${JSON.stringify(value)}$3`;
    return s.replace(re, replacement);
  }

  if (settings.toolName    !== undefined) out = replaceKey(out, "toolName",    settings.toolName);
  if (settings.toolTagline !== undefined) out = replaceKey(out, "toolTagline", settings.toolTagline);

  // banner is an object — replace the whole banner: { … } block
  if (settings.banner) {
    const bannerRe = /(banner:\s*\{)[^}]*/;
    const b = settings.banner;
    out = out.replace(bannerRe, `$1 on: ${JSON.stringify(b.on)}, tone: ${JSON.stringify(b.tone)}, text: ${JSON.stringify(b.text)} `);
  }

  return out;
}

// ── apply patches ─────────────────────────────────────────────────────────
let src = fs.readFileSync(seedPath, "utf8");

try {
  src = replaceArrayConst(src, "COB",         newCOB);
  src = replaceArrayConst(src, "OBJECTIONS",  newObjections);
  src = replaceArrayConst(src, "VERTICALS",   newVerticals);
  src = replaceArrayConst(src, "RESOURCES",   newResources);
  src = replaceArrayConst(src, "SECTIONS",    newSections);
  src = replaceArrayConst(src, "RES_SECTIONS", newResSections);
  src = replaceSettingsKeys(src, newSettings);
} catch (e) {
  console.error("Patch failed:", e.message);
  process.exit(1);
}

// ── write backup then save ────────────────────────────────────────────────
const backupPath = seedPath + ".bak";
fs.copyFileSync(seedPath, backupPath);
console.log("Backup saved to seed-data.js.bak");

fs.writeFileSync(seedPath, src, "utf8");
console.log("seed-data.js updated successfully.");
console.log("  COB classes:  ", newCOB.length);
console.log("  Objections:   ", newObjections.length);
console.log("  Verticals:    ", newVerticals.length);
console.log("  Resources:    ", newResources.length);
console.log("  Sections:     ", newSections.length);
console.log("  Res sections: ", newResSections.length);
