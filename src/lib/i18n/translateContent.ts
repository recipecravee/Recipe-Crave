// Browser-side helper for fetching recipe-content translations via the
// /api/translate endpoint. Caches per-string in sessionStorage so repeat
// visits to the same recipe don't re-fetch.

const SESSION_PREFIX = 'rc:t:';

export async function translateBatch(
  source: string,
  target: string,
  strings: string[],
): Promise<string[]> {
  if (source === target || target === 'en' || strings.length === 0) {
    return strings;
  }
  // Check session cache first; collect uncached items to send
  const cachedHits: (string | null)[] = strings.map((s) => {
    try {
      const k = `${SESSION_PREFIX}${target}|${s}`;
      const hit = window.sessionStorage.getItem(k);
      return hit ?? null;
    } catch {
      return null;
    }
  });
  const toFetch: string[] = [];
  const fetchIndexes: number[] = [];
  cachedHits.forEach((hit, i) => {
    if (hit === null) {
      toFetch.push(strings[i]!);
      fetchIndexes.push(i);
    }
  });
  if (toFetch.length === 0) {
    return cachedHits as string[];
  }
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, target, q: toFetch }),
    });
    const data = (await res.json()) as { ok: boolean; translations?: string[]; fallback?: boolean };
    if (!data.ok || !data.translations) {
      return strings;
    }
    // Write to sessionStorage + assemble result
    const out: string[] = [...cachedHits as string[]];
    fetchIndexes.forEach((idx, i) => {
      const translated = data.translations![i] ?? strings[idx]!;
      out[idx] = translated;
      try {
        window.sessionStorage.setItem(`${SESSION_PREFIX}${target}|${strings[idx]}`, translated);
      } catch {
        /* ignore */
      }
    });
    return out;
  } catch {
    return strings;
  }
}

export async function translateOne(source: string, target: string, text: string): Promise<string> {
  if (source === target || target === 'en' || !text) return text;
  const result = await translateBatch(source, target, [text]);
  return result[0] ?? text;
}
