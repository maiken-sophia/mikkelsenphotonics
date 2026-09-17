// Minimal BibTeX -> JSON converter (no dependencies).
// Reads publications.bib, writes src/data/publications.json.
// Handles @article entries with title, author, journal, volume, pages, year, doi.
import { readFileSync, writeFileSync } from "node:fs";

const bib = readFileSync(new URL("../publications.bib", import.meta.url), "utf8");
const entries = [];
const re = /@(\w+)\s*\{\s*([^,]+),([\s\S]*?)\n\}/g;
let m;
while ((m = re.exec(bib))) {
  const [, type, key, body] = m;
  const fields = {};
  const fre = /(\w+)\s*=\s*(\{((?:[^{}]|\{[^{}]*\})*)\}|"([^"]*)"|(\d+))/g;
  let f;
  while ((f = fre.exec(body))) fields[f[1].toLowerCase()] = (f[3] ?? f[4] ?? f[5] ?? "").replace(/[{}]/g, "").replace(/\s+/g, " ").trim();
  const authors = (fields.author ?? "")
    .split(/\s+and\s+/)
    .map(a => { a = a.trim();
      if (a.includes(",")) { const [last, first] = a.split(",").map(s => s.trim()); const ini = first.split(/\s+/).filter(Boolean).map(n => n[0] + ".").join(" "); return ini ? `${ini} ${last}` : last; }
      return a; })
    .join(", ");
  entries.push({ key: key.trim(), type, title: fields.title ?? "", authors, journal: fields.journal ?? fields.booktitle ?? "", volume: fields.volume ?? "", pages: (fields.pages ?? "").replace("--", "–"), year: Number(fields.year) || 0, doi: fields.doi ?? "", note: fields.note ?? "" });
}
entries.sort((a, b) => b.year - a.year);
writeFileSync(new URL("../src/data/publications.json", import.meta.url), JSON.stringify(entries, null, 2));
console.log(`Wrote ${entries.length} publications to src/data/publications.json`);
