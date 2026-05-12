// Lingva Translate proxy + 24-hour in-memory cache.
//
// Why Lingva: free, no API key, no signup, no rate-limit headers.
// Lingva is a public Google-Translate proxy that returns translations as
// JSON. Quality === Google Translate quality. No commercial restrictions
// for our scale.
//
// Endpoint: GET /api/translate?source={src}&target={tgt}&q={text}
//   - source defaults to "en"
//   - target must be a supported ISO code (see fallbacks below)
//
// Cache: per-process Map keyed by `${target}|${text}`. TTL 24h. Reset on
// each dev-server restart or Vercel cold-start. For production-grade
// caching, swap to Supabase translations table or Vercel KV. Current
// in-memory layer is sufficient for the small-but-steady recipe traffic
// we expect at launch.
//
// Fallback: if Lingva is rate-limited or down, returns the original
// English text with `ok: false, fallback: true`. Client should display
// English content in that case.

import { NextRequest, NextResponse } from 'next/server';

// Lingva community instance pool — rotates if first fails
const LINGVA_INSTANCES = [
  'https://lingva.ml',
  'https://translate.plausibility.cloud',
  'https://lingva.thedaviddelta.com',
];

// Most of our app's locale codes map directly to Lingva codes.
// Differences: Mexican Spanish 'es-MX' → 'es'; Filipino 'fil' → 'tl'.
const LOCALE_MAP: Record<string, string> = {
  en: 'en',
  es: 'es',
  'es-MX': 'es',
  zh: 'zh',
  hi: 'hi',
  fr: 'fr',
  ar: 'ar',
  pt: 'pt',
  ru: 'ru',
  ja: 'ja',
  de: 'de',
  it: 'it',
  ko: 'ko',
  tr: 'tr',
  nl: 'nl',
  pl: 'pl',
  vi: 'vi',
  th: 'th',
  id: 'id',
  fil: 'tl',          // Lingva uses Tagalog code
  sv: 'sv',
  no: 'no',
  da: 'da',
  fi: 'fi',
  el: 'el',
  he: 'he',           // Hebrew
  fa: 'fa',           // Persian/Farsi
  ur: 'ur',
  bn: 'bn',
  sw: 'sw',
};

// 24-hour in-memory cache. TTL purges on access.
type CacheEntry = { value: string; expires: number };
const cache: Map<string, CacheEntry> = new Map();
const TTL_MS = 24 * 60 * 60 * 1000;

function cacheGet(key: string): string | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function cacheSet(key: string, value: string): void {
  cache.set(key, { value, expires: Date.now() + TTL_MS });
}

async function translateOnce(source: string, target: string, text: string): Promise<string | null> {
  for (const base of LINGVA_INSTANCES) {
    try {
      const url = `${base}/api/v1/${encodeURIComponent(source)}/${encodeURIComponent(target)}/${encodeURIComponent(text)}`;
      const res = await fetch(url, {
        // Short timeout — fall through to next instance fast on hang
        signal: AbortSignal.timeout(7000),
        headers: { 'User-Agent': 'RecipeCrave/1.0 (translation proxy)' },
      });
      if (!res.ok) continue;
      const json = (await res.json()) as { translation?: string };
      if (json.translation && typeof json.translation === 'string') {
        return json.translation;
      }
    } catch {
      // try next instance
    }
  }
  return null;
}

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const source = searchParams.get('source') ?? 'en';
  const target = searchParams.get('target') ?? '';
  const q = searchParams.get('q') ?? '';

  if (!q.trim()) {
    return NextResponse.json({ ok: false, error: 'Missing q parameter' }, { status: 400 });
  }
  if (q.length > 5000) {
    return NextResponse.json({ ok: false, error: 'q too long (max 5000 chars)' }, { status: 400 });
  }

  const targetLingva = LOCALE_MAP[target];
  if (!targetLingva) {
    return NextResponse.json({ ok: false, error: 'Unsupported target locale' }, { status: 400 });
  }

  // English-to-English is a no-op
  if (source === targetLingva || target === source) {
    return NextResponse.json({ ok: true, translation: q, cached: true });
  }

  const cacheKey = `${source}|${targetLingva}|${q}`;
  const cached = cacheGet(cacheKey);
  if (cached !== null) {
    return NextResponse.json({ ok: true, translation: cached, cached: true });
  }

  const translation = await translateOnce(source, targetLingva, q);
  if (translation === null) {
    return NextResponse.json(
      { ok: false, fallback: true, translation: q, error: 'Translation provider unavailable' },
      { status: 200 },
    );
  }

  cacheSet(cacheKey, translation);
  return NextResponse.json({ ok: true, translation, cached: false });
}

// POST: batch translation — accepts JSON `{ source?, target, q: string[] }`
// Useful for translating an entire recipe (ingredients[] + instructions[])
// in one round-trip. Returns ordered `translations: string[]`.
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as
    | { source?: string; target?: string; q?: string[] }
    | null;

  if (!body || !Array.isArray(body.q)) {
    return NextResponse.json({ ok: false, error: 'Body must be {target, q: string[]}' }, { status: 400 });
  }
  if (body.q.length > 100) {
    return NextResponse.json({ ok: false, error: 'Max 100 strings per batch' }, { status: 400 });
  }

  const source = body.source ?? 'en';
  const target = body.target ?? '';
  const targetLingva = LOCALE_MAP[target];
  if (!targetLingva) {
    return NextResponse.json({ ok: false, error: 'Unsupported target locale' }, { status: 400 });
  }

  // English-to-English is a no-op (pass-through)
  if (source === targetLingva) {
    return NextResponse.json({ ok: true, translations: body.q, cached: true });
  }

  const out: string[] = [];
  let anyFailed = false;
  for (const text of body.q) {
    if (!text || !text.trim()) {
      out.push(text);
      continue;
    }
    const cacheKey = `${source}|${targetLingva}|${text}`;
    const cached = cacheGet(cacheKey);
    if (cached !== null) {
      out.push(cached);
      continue;
    }
    const translation = await translateOnce(source, targetLingva, text);
    if (translation === null) {
      out.push(text); // fallback to English
      anyFailed = true;
    } else {
      cacheSet(cacheKey, translation);
      out.push(translation);
    }
  }

  return NextResponse.json({ ok: !anyFailed, translations: out, fallback: anyFailed });
}
