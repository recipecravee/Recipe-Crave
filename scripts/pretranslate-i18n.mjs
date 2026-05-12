/**
 * Pre-translate UI strings into 17 minor locales via Lingva Translate (free,
 * no API key). Reads the `en` dict from src/lib/i18n/dict.ts, fetches a
 * machine translation per string per locale, writes the merged output to
 * src/lib/i18n/dict.generated.ts.
 *
 * Why: Lingva is a Google Translate proxy with multiple public mirrors. We
 * fall through them on failure so a single mirror outage doesn't break the
 * build. Strings are cached on disk (scripts/.i18n-cache.json) so we only
 * hit the network for new/changed entries.
 *
 * Usage:  node scripts/pretranslate-i18n.mjs
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DICT_PATH = path.join(ROOT, 'src', 'lib', 'i18n', 'dict.ts');
const GEN_PATH = path.join(ROOT, 'src', 'lib', 'i18n', 'dict.generated.ts');
const CACHE_PATH = path.join(__dirname, '.i18n-cache.json');

// Mirror list — fall through on failure. Order: most reliable first as of late 2025.
const MIRRORS = [
  'https://lingva.ml',
  'https://lingva.lunar.icu',
  'https://translate.plausibility.cloud',
  'https://lingva.garudalinux.org',
];

// Target locales (17). Norwegian Bokmål uses `nb` upstream; Filipino → `tl`.
const TARGETS = [
  { code: 'tr', upstream: 'tr' },
  { code: 'nl', upstream: 'nl' },
  { code: 'pl', upstream: 'pl' },
  { code: 'vi', upstream: 'vi' },
  { code: 'th', upstream: 'th' },
  { code: 'id', upstream: 'id' },
  { code: 'fil', upstream: 'tl' },
  { code: 'sv', upstream: 'sv' },
  { code: 'no', upstream: 'no' },
  { code: 'da', upstream: 'da' },
  { code: 'fi', upstream: 'fi' },
  { code: 'el', upstream: 'el' },
  { code: 'he', upstream: 'iw' },
  { code: 'fa', upstream: 'fa' },
  { code: 'ur', upstream: 'ur' },
  { code: 'bn', upstream: 'bn' },
  { code: 'sw', upstream: 'sw' },
];

// Native picker label for each locale (preserved so picker stays readable
// even if a string fails to translate).
const NATIVE_LABEL = {
  tr: 'Dil', nl: 'Taal', pl: 'Język', vi: 'Ngôn ngữ', th: 'ภาษา',
  id: 'Bahasa', fil: 'Wika', sv: 'Språk', no: 'Språk', da: 'Sprog',
  fi: 'Kieli', el: 'Γλώσσα', he: 'שפה', fa: 'زبان', ur: 'زبان',
  bn: 'ভাষা', sw: 'Lugha',
};

async function loadCache() {
  try {
    return JSON.parse(await fs.readFile(CACHE_PATH, 'utf8'));
  } catch {
    return {};
  }
}

async function saveCache(cache) {
  await fs.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2));
}

/**
 * Pull the `en` object literal out of dict.ts. The file is hand-edited TS
 * not JSON, so parse with a permissive regex that handles single quotes,
 * trailing commas, and inline comments.
 */
async function loadEnglishStrings() {
  const src = await fs.readFile(DICT_PATH, 'utf8');
  const match = src.match(/const en: Dict = \{([\s\S]*?)\n\};/);
  if (!match) throw new Error('Could not locate `const en: Dict = { ... }` in dict.ts');
  const body = match[1];
  const out = {};
  // Match: 'key': 'value', — value may contain escaped single quotes via \'
  const rx = /'([^']+)':\s*'((?:[^'\\]|\\.)*)'/g;
  let m;
  while ((m = rx.exec(body)) !== null) {
    out[m[1]] = m[2].replace(/\\'/g, "'");
  }
  return out;
}

async function translateOne(text, targetUpstream) {
  // URL-encode but preserve common ASCII so the path stays readable in logs.
  const encoded = encodeURIComponent(text);
  for (const base of MIRRORS) {
    const url = `${base}/api/v1/en/${targetUpstream}/${encoded}`;
    // Race the fetch against a hard 5s timer — defensive against Node's
    // abort-controller occasionally not killing a hung TLS handshake on
    // Windows. Without this, a single dead connection can stall the run.
    const fetchPromise = (async () => {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 5000);
      try {
        const res = await fetch(url, {
          signal: ctrl.signal,
          headers: { 'User-Agent': 'RecipeCrave-i18n-prebuild/1.0' },
        });
        if (!res.ok) return null;
        const json = await res.json();
        if (json && typeof json.translation === 'string' && json.translation.trim()) {
          return json.translation;
        }
        return null;
      } finally {
        clearTimeout(t);
      }
    })();
    const timeoutPromise = new Promise((resolve) =>
      setTimeout(() => resolve('__TIMEOUT__'), 6000),
    );
    try {
      const tr = await Promise.race([fetchPromise, timeoutPromise]);
      if (tr && tr !== '__TIMEOUT__') return tr;
    } catch {
      // try next mirror
    }
  }
  return null; // all mirrors failed
}

function tsEscape(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function main() {
  console.log('[i18n] Loading English strings…');
  const en = await loadEnglishStrings();
  const keys = Object.keys(en);
  console.log(`[i18n] ${keys.length} keys × ${TARGETS.length} locales = ${keys.length * TARGETS.length} translation lookups.`);

  const cache = await loadCache();
  const result = {}; // { localeCode: { key: translation } }

  for (const { code, upstream } of TARGETS) {
    result[code] = { 'lang.label': NATIVE_LABEL[code] || 'Language' };
    let hits = 0, misses = 0, fetched = 0;
    for (const key of keys) {
      if (key === 'lang.label') continue; // already set natively above
      const src = en[key];
      const cacheKey = `${upstream}::${src}`;
      let tr = cache[cacheKey];
      if (tr) {
        hits++;
      } else {
        tr = await translateOne(src, upstream);
        if (tr) {
          cache[cacheKey] = tr;
          fetched++;
          // Save cache incrementally so a crash mid-run doesn't waste progress.
          if (fetched % 10 === 0) await saveCache(cache);
          process.stdout.write(`[i18n] ${code} ${fetched} fetched (latest: ${key})\n`);
        } else {
          misses++;
          process.stdout.write(`[i18n] ${code} MISS ${key}\n`);
          continue; // leave key out → English fallback applies at runtime
        }
        // Polite to free mirrors. ~3 req/sec across rotating mirrors.
        await new Promise((r) => setTimeout(r, 120));
      }
      result[code][key] = tr;
    }
    console.log(`[i18n] ${code}: cache=${hits} fetched=${fetched} missing=${misses}`);
    await saveCache(cache);
  }

  // Emit dict.generated.ts
  const lines = [];
  lines.push('// AUTO-GENERATED by scripts/pretranslate-i18n.mjs. Do not edit by hand.');
  lines.push('// Translations sourced from Lingva Translate (free Google Translate proxy).');
  lines.push('// Re-run the script to refresh; commit the regenerated file.');
  lines.push('');
  lines.push('import type { Dict } from "./dict";');
  lines.push('');
  lines.push('export const GENERATED_LOCALE_PARTIALS: Record<string, Partial<Dict>> = {');
  for (const { code } of TARGETS) {
    lines.push(`  '${code}': {`);
    for (const [k, v] of Object.entries(result[code])) {
      lines.push(`    '${tsEscape(k)}': '${tsEscape(v)}',`);
    }
    lines.push('  },');
  }
  lines.push('};');
  lines.push('');

  await fs.writeFile(GEN_PATH, lines.join('\n'), 'utf8');
  console.log(`[i18n] Wrote ${GEN_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
