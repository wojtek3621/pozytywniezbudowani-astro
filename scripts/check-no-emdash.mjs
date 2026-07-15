#!/usr/bin/env node
/**
 * Guardrail: zero em-dash (—, U+2014) w artykułach bloga.
 *
 * Em-dash to typograficzny "podpis AI". Konwencja PZ (spójna z książką Wojtka) = półpauza (–, U+2013).
 * Ten check skanuje src/data/post/*.md i FAILuje (exit 1), jeśli znajdzie choć jeden em-dash.
 *
 * Świadomie prosty: flaguje KAŻDY em-dash w postach (także w blokach kodu). Dziś posty mają 0
 * em-dashy gdziekolwiek, więc zero fałszywych alarmów. Gdyby kiedyś pojawił się uzasadniony em-dash
 * w bloku kodu — wtedy rozbudować o wyjątek; na razie YAGNI (najlżejsza rzecz, która łapie nawrót).
 *
 * Wpięty w `npm run build` (realny gate deployu) oraz `npm run check`; wołalny też samodzielnie:
 *   npm run check:emdash
 */
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const EMDASH = "—"; // —
const HERE = dirname(fileURLToPath(import.meta.url));
const POST_DIR = join(HERE, "..", "src", "data", "post");

let files;
try {
  files = readdirSync(POST_DIR).filter((f) => f.endsWith(".md"));
} catch (err) {
  console.error(`check-no-emdash: nie mogę odczytać ${POST_DIR}: ${err.message}`);
  process.exit(2);
}

const hits = [];
for (const name of files) {
  const full = join(POST_DIR, name);
  const text = readFileSync(full, "utf8");
  if (!text.includes(EMDASH)) continue;
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    if (line.includes(EMDASH)) {
      const count = (line.match(/—/g) || []).length;
      hits.push({ name, line: i + 1, count, snippet: line.trim().slice(0, 120) });
    }
  });
}

if (hits.length > 0) {
  const total = hits.reduce((s, h) => s + h.count, 0);
  const fileSet = new Set(hits.map((h) => h.name));
  console.error(
    `✗ check-no-emdash: znaleziono ${total} em-dash (—) w ${fileSet.size} plik(ach) src/data/post/.`,
  );
  console.error("  Em-dash = podpis AI. Zamień na półpauzę (–, U+2013). Napraw:");
  console.error(
    "    node -e \"const fs=require('fs'),d='src/data/post';for(const f of fs.readdirSync(d).filter(x=>x.endsWith('.md'))){const p=d+'/'+f,s=fs.readFileSync(p,'utf8');if(s.includes('\\u2014'))fs.writeFileSync(p,s.replaceAll('\\u2014','\\u2013'))}\"",
  );
  console.error("  Wystąpienia:");
  for (const h of hits) {
    console.error(`    ${h.name}:${h.line}  (${h.count}×)  ${h.snippet}`);
  }
  process.exit(1);
}

console.log(`✓ check-no-emdash: 0 em-dash w ${files.length} postach src/data/post/. OK.`);
process.exit(0);
