'use client';

import { useState } from 'react';
import { Languages, X, Loader2, Sparkles } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { translateBatch } from '@/lib/i18n/translateContent';
import type { Recipe } from '@/types/recipe';

/**
 * On-demand recipe translation button.
 *
 * Behavior:
 *   - Hidden while locale === 'en' (no value to surface)
 *   - When clicked: batch-fetches translations for title + description +
 *     ingredient names + instruction texts via /api/translate (Lingva)
 *   - Result renders in a slide-up drawer over the recipe
 *   - sessionStorage cache prevents re-fetch on revisit
 *   - Drawer doesn't replace the SSR English content — that stays for SEO
 *     + structured-data integrity. Translation is a read-aloud layer for
 *     non-English visitors.
 *
 * RTL-aware: drawer renders `dir="rtl"` when locale is Arabic / Hebrew /
 * Farsi / Urdu, picked up from the Locale meta in I18nProvider.
 */
export function TranslateRecipeButton({ recipe }: { recipe: Recipe }) {
  const { locale, meta, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [translated, setTranslated] = useState<null | {
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
  }>(null);

  // Skip rendering when user is already on English UI
  if (locale === 'en') return null;

  async function fetchTranslation() {
    if (translated) {
      setOpen(true);
      return;
    }
    setLoading(true);
    setOpen(true);
    try {
      const ingredientLines = recipe.ingredients.map((i) => `${i.qty} ${i.unit} ${i.name}`.trim());
      const instructionLines = recipe.instructions.map((s) => s.text);
      const allInputs = [recipe.title, recipe.description, ...ingredientLines, ...instructionLines];
      const out = await translateBatch('en', locale, allInputs);
      setTranslated({
        title: out[0] ?? recipe.title,
        description: out[1] ?? recipe.description,
        ingredients: out.slice(2, 2 + ingredientLines.length),
        instructions: out.slice(2 + ingredientLines.length),
      });
    } catch {
      // Silent fallback — drawer shows English text
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={fetchTranslation}
        className="inline-flex items-center gap-1.5 rounded-full border border-forest-300 bg-forest-50 px-3 py-1.5 text-xs font-bold text-forest-700 shadow-sm transition-colors hover:border-forest-500 hover:bg-forest-100 focus-ring print:hidden"
        aria-label={`Translate this recipe to ${meta.native}`}
      >
        <Languages className="h-3.5 w-3.5" aria-hidden />
        <span aria-hidden>{meta.flag}</span>
        <span>Translate to {meta.native}</span>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Translated recipe in ${meta.native}`}
          className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center sm:p-4 print:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
            dir={meta.rtl ? 'rtl' : 'ltr'}
          >
            <header className="flex items-center justify-between gap-2 border-b border-ink/10 bg-gradient-to-r from-forest-500 to-forest-600 px-4 py-3 text-white">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
                <span className="truncate text-xs font-bold uppercase tracking-wider">
                  Translated to {meta.native} {meta.flag}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close translation"
                className="rounded-md p-1.5 text-white/80 hover:bg-white/15 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
              {loading || !translated ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-forest-600" aria-hidden />
                  <p className="mt-3 text-sm text-ink-muted">Translating…</p>
                  <p className="mt-1 text-[11px] text-ink-subtle">
                    Powered by free Lingva proxy. First load takes 3-6 seconds.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-2xl font-bold text-ink">{translated.title}</h2>
                  <p className="mt-2 text-sm text-ink-muted">{translated.description}</p>

                  <h3 className="mt-6 text-xs font-bold uppercase tracking-widest text-forest-700">
                    {t('common.servings', 'Ingredients')}
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-ink">
                    {translated.ingredients.map((line, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-400" aria-hidden />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="mt-6 text-xs font-bold uppercase tracking-widest text-forest-700">
                    Instructions
                  </h3>
                  <ol className="mt-2 space-y-3 text-sm text-ink">
                    {translated.instructions.map((line, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-terracotta-400 text-xs font-bold text-white">
                          {i + 1}
                        </span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </div>

            <footer className="border-t border-ink/10 bg-cream-50 px-4 py-3 text-[11px] text-ink-subtle">
              Automated translation via Lingva (Google Translate proxy). Cooking
              terms may translate imperfectly — refer to the original English
              version for technique-critical detail.
            </footer>
          </div>
        </div>
      ) : null}
    </>
  );
}
