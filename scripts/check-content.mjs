// Fails the build early if any content file has invalid YAML frontmatter.
// Astro's own error for this is cryptic ("bad indentation of a mapping entry"),
// usually caused by an unquoted value containing ": ".
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir) {
  return readdirSync(dir).flatMap(f => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".md") ? [p] : [];
  });
}

let bad = 0;
for (const file of walk("src/content")) {
  const parts = readFileSync(file, "utf8").split("---");
  if (parts.length < 3) continue;
  for (const line of parts[1].split("\n")) {
    const m = line.match(/^([A-Za-z_]+):\s+(.+)$/);
    if (!m) continue;
    const value = m[2].trim();
    if (/^["'[{]/.test(value)) continue;
    if (value.includes(": ")) {
      console.error(`${file}: value for "${m[1]}" contains ": " and must be quoted`);
      bad++;
    }
  }
}
if (bad) { console.error(`\n${bad} frontmatter problem(s) — fix before building.`); process.exit(1); }
console.log("Content frontmatter OK");
