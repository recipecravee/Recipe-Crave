'use client';

import { useState } from 'react';
import { Clock, Users, Flame, Eye } from 'lucide-react';

type Status = 'idle' | 'submitting' | 'ok' | 'err';

type DraftState = {
  recipe_title: string;
  recipe_description: string;
  cuisine: string;
  servings: string;
  total_time_min: string;
  ingredients: string;
  instructions: string;
  photo_url: string;
  submitter_name: string;
};

const EMPTY_DRAFT: DraftState = {
  recipe_title: '',
  recipe_description: '',
  cuisine: '',
  servings: '',
  total_time_min: '',
  ingredients: '',
  instructions: '',
  photo_url: '',
  submitter_name: '',
};

export function SubmitRecipeForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftState>(EMPTY_DRAFT);

  function updateDraft(field: keyof DraftState, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    setMessage(null);
    const form = new FormData(e.currentTarget);
    const payload: Record<string, string> = {};
    for (const [k, v] of form.entries()) payload[k] = typeof v === 'string' ? v : '';
    try {
      const res = await fetch('/api/submit-recipe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (data.ok) {
        setStatus('ok');
        setMessage(data.message ?? 'Submission received. We will be in touch within 7 days.');
        (e.target as HTMLFormElement).reset();
        setDraft(EMPTY_DRAFT);
      } else {
        setStatus('err');
        setMessage(data.message ?? 'Could not submit. Try again.');
      }
    } catch {
      setStatus('err');
      setMessage('Network error. Try again.');
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
      <form onSubmit={onSubmit} className="space-y-5">
        <Row label="Your name" name="submitter_name" required placeholder="Jane Cook" value={draft.submitter_name} onChange={(v) => updateDraft('submitter_name', v)} />
        <Row label="Email" name="submitter_email" type="email" required placeholder="jane@example.com" />
        <Row label="Optional link (Instagram, food blog, etc.)" name="submitter_link" type="url" placeholder="https://instagram.com/janescookery" />

        <hr className="border-cream-200" />

        <Row label="Recipe title" name="recipe_title" required placeholder="My grandmother's jollof rice" value={draft.recipe_title} onChange={(v) => updateDraft('recipe_title', v)} />
        <Row label="Short description / story" name="recipe_description" required textarea rows={3} placeholder="Two or three sentences about why this recipe matters to you and what makes it different." value={draft.recipe_description} onChange={(v) => updateDraft('recipe_description', v)} />

        <div className="grid gap-4 sm:grid-cols-3">
          <Row label="Cuisine" name="cuisine" required placeholder="Nigerian" value={draft.cuisine} onChange={(v) => updateDraft('cuisine', v)} />
          <Row label="Servings" name="servings" type="number" required min={1} max={20} placeholder="6" value={draft.servings} onChange={(v) => updateDraft('servings', v)} />
          <Row label="Total time (min)" name="total_time_min" type="number" required min={5} max={1440} placeholder="55" value={draft.total_time_min} onChange={(v) => updateDraft('total_time_min', v)} />
        </div>

        <Row label="Ingredients (one per line)" name="ingredients" textarea rows={8} required placeholder={'2.5 cups long-grain parboiled rice\n3 red bell peppers\n4 plum tomatoes\n1 scotch bonnet\n2 yellow onions\n3 tbsp tomato paste'} value={draft.ingredients} onChange={(v) => updateDraft('ingredients', v)} />
        <Row label="Step-by-step instructions (one step per line)" name="instructions" textarea rows={10} required placeholder={'Blend bell peppers, tomatoes, scotch bonnet, and one onion until smooth.\nIn a heavy pot, heat oil. Dice the second onion and sauté until soft.\nAdd tomato paste and the blended mixture. Simmer 15 minutes.'} value={draft.instructions} onChange={(v) => updateDraft('instructions', v)} />

        <Row label="Photo URL (optional)" name="photo_url" type="url" placeholder="https://i.imgur.com/your-photo.jpg" value={draft.photo_url} onChange={(v) => updateDraft('photo_url', v)} />
        <Row label="Anything else we should know? (optional)" name="notes" textarea rows={3} placeholder="Family origin, dietary considerations, equipment notes, etc." />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <p className="text-xs text-ink-subtle">
            By submitting, you confirm the recipe is your work or that you have permission
            to share it. We may edit for clarity before publishing.
          </p>
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="rounded-full bg-terracotta-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:opacity-60 focus-ring"
          >
            {status === 'submitting' ? 'Sending…' : 'Submit recipe'}
          </button>
        </div>

        {message ? (
          <p
            className={`rounded-xl border px-3 py-2 text-sm ${
              status === 'ok'
                ? 'border-forest-200 bg-forest-50 text-forest-800'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {message}
          </p>
        ) : null}
      </form>

      {/* Right-hand-side live preview — sticky on desktop so it tracks
          the form as the user scrolls. */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <RecipePreview draft={draft} />
      </aside>
    </div>
  );
}

function RecipePreview({ draft }: { draft: DraftState }) {
  const title = draft.recipe_title.trim() || 'Your recipe title';
  const desc = draft.recipe_description.trim() || 'A short story about why this recipe matters to you will appear here.';
  const cuisine = draft.cuisine.trim();
  const servings = parseInt(draft.servings, 10);
  const totalMin = parseInt(draft.total_time_min, 10);
  const ingredients = draft.ingredients.split('\n').map((l) => l.trim()).filter(Boolean);
  const steps = draft.instructions.split('\n').map((l) => l.trim()).filter(Boolean);
  const photo = draft.photo_url.trim();

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-forest-200 bg-white shadow-md">
      <div className="flex items-center gap-2 bg-forest-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-forest-700">
        <Eye className="h-4 w-4" aria-hidden /> Live preview
      </div>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt=""
          className="aspect-[4/3] w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div className="aspect-[4/3] w-full bg-gradient-to-br from-terracotta-100 via-cream-100 to-forest-100" />
      )}
      <div className="space-y-3 p-5">
        {cuisine ? (
          <span className="inline-block rounded-full bg-cream-100 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
            {cuisine}
          </span>
        ) : null}
        <h3 className="font-serif text-2xl font-bold text-ink">{title}</h3>
        <p className="text-sm leading-relaxed text-ink-muted">{desc}</p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
          {totalMin > 0 ? (
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden /> {totalMin} min</span>
          ) : null}
          {servings > 0 ? (
            <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" aria-hidden /> serves {servings}</span>
          ) : null}
          {draft.submitter_name.trim() ? (
            <span className="inline-flex items-center gap-1"><Flame className="h-3.5 w-3.5" aria-hidden /> by {draft.submitter_name.trim()}</span>
          ) : null}
        </div>

        {ingredients.length > 0 ? (
          <details open className="mt-3 rounded-xl bg-cream-50 p-3">
            <summary className="cursor-pointer text-xs font-bold uppercase tracking-widest text-ink-subtle">
              Ingredients ({ingredients.length})
            </summary>
            <ul className="mt-2 list-disc space-y-0.5 pl-5 text-sm text-ink-muted">
              {ingredients.slice(0, 15).map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
              {ingredients.length > 15 ? (
                <li className="text-xs text-ink-subtle">… {ingredients.length - 15} more</li>
              ) : null}
            </ul>
          </details>
        ) : null}

        {steps.length > 0 ? (
          <details className="rounded-xl bg-cream-50 p-3">
            <summary className="cursor-pointer text-xs font-bold uppercase tracking-widest text-ink-subtle">
              Instructions ({steps.length} {steps.length === 1 ? 'step' : 'steps'})
            </summary>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-ink-muted">
              {steps.slice(0, 8).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
              {steps.length > 8 ? (
                <li className="text-xs text-ink-subtle">… {steps.length - 8} more</li>
              ) : null}
            </ol>
          </details>
        ) : null}

        <p className="border-t border-cream-200 pt-3 text-[10px] text-ink-subtle">
          This is what your card will look like once published. Editorial may
          adjust wording, photos, and formatting before publishing.
        </p>
      </div>
    </div>
  );
}

type RowProps = {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
  min?: number;
  max?: number;
  value?: string;
  onChange?: (v: string) => void;
};

function Row({ label, name, required, type = 'text', placeholder, textarea, rows, min, max, value, onChange }: RowProps) {
  const inputClasses =
    'block w-full rounded-xl border border-ink/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-terracotta-400 focus:outline-none';
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-ink-subtle">
        {label}
        {required ? ' *' : ''}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={rows ?? 4}
          placeholder={placeholder}
          className={inputClasses}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          min={min}
          max={max}
          className={inputClasses}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        />
      )}
    </label>
  );
}
