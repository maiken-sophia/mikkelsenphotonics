// Post-build typography pass: prevents awkward line breaks in the generated HTML.
// Runs after `astro build` (see package.json). It only touches text between tags,
// never attributes, <script>, <style>, <title> or <pre>. If anything goes wrong with a
// file it is left untouched and the build still succeeds.
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const NBSP = "&nbsp;";
const WJ = "&#8288;"; // word joiner: invisible, forbids a line break at that point

// Multi-word names that should never be split across lines.
const PHRASES = [
  "Niels Bohr", "Novo Nordisk", "Google Scholar", "NIH R01", "Jagtvej 155", "Copenhagen N",
  "Santa Barbara", "van der Waals", "Van der Waals", "et al.", "DKK 35 million", "H. Mikkelsen",
];
const UNITS = "nm|µm|μm|mm|ps|fs|ns|GHz|MHz|THz|dpi|K|million|billion|nanometers|nanometres|picoseconds|femtoseconds|years|percent";

export function fixText(s) {
  // en dash inside a compound or range (light–matter, 2010–2012): no break on either side
  s = s.replace(/([^\s–])–([^\s–])/g, `$1${WJ}–${WJ}$2`);
  // spaced em dash: keep the dash with the preceding word, allow the break after it
  s = s.replace(/ — /g, `${NBSP}— `);
  // protected phrases
  for (const p of PHRASES) s = s.split(p).join(p.replace(/ /g, NBSP));
  // number + unit
  s = s.replace(new RegExp(`(\\d) (${UNITS})(?![A-Za-z])`, "g"), `$1${NBSP}$2`);
  return s;
}

export function fixHtml(html) {
  // split out blocks that must not be touched
  const parts = html.split(/(<(script|style|title|pre|textarea)\b[\s\S]*?<\/\2>)/gi);
  let out = "";
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part === undefined) continue;
    if (i % 3 === 1) { out += part; continue; }   // protected block
    if (i % 3 === 2) continue;                      // captured tag name
    out += part.replace(/>([^<]+)</g, (m, text) => (/\S/.test(text) ? ">" + fixText(text) + "<" : m));
  }
  return out;
}

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (p.endsWith(".html")) files.push(p);
  }
  return files;
}

const isCli = process.argv[1] && process.argv[1].endsWith("typography.mjs");
if (isCli) {
  const dir = process.argv[2] ?? "dist";
  if (!existsSync(dir)) { console.log(`typography: ${dir} not found, skipping`); process.exit(0); }
  let n = 0;
  for (const f of walk(dir)) {
    try {
      const before = readFileSync(f, "utf8");
      const after = fixHtml(before);
      if (after !== before) { writeFileSync(f, after); n++; }
    } catch (e) { console.warn(`typography: skipped ${f}: ${e.message}`); }
  }
  console.log(`typography: adjusted ${n} page(s)`);
}
