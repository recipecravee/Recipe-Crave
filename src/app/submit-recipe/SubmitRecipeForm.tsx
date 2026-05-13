'use client';

import { useState } from 'react';

type Status = 'idle' | 'submitting' | 'ok' | 'err';

export function SubmitRecipeForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | null>(null);

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
    <form onSubmit={onSubmit} className="space-y-5">
      <Row label="Your name" name="submitter_name" required placeholder="Jane Cook" />
      <Row label="Email" name="submitter_email" type="email" required placeholder="jane@example.com" />
      <Row label="Optional link (Instagram, food blog, etc.)" name="submitter_link" type="url" placeholder="https://instagram.com/janescookery" />

      <hr className="border-cream-200" />

      <Row label="Recipe title" name="recipe_title" required placeholder="My grandmother's jollof rice" />
      <Row label="Short description / story" name="recipe_description" required textarea rows={3} placeholder="Two or three sentences about why this recipe matters to you and what makes it different." />

      <div className="grid gap-4 sm:grid-cols-3">
        <Row label="Cuisine" name="cuisine" required placeholder="Nigerian" />
        <Row label="Servings" name="servings" type="number" required min={1} max={20} placeholder="6" />
        <Row label="Total time (min)" name="total_time_min" type="number" required min={5} max={1440} placeholder="55" />
      </div>

      <Row label="Ingredients (one per line)" name="ingredients" textarea rows={8} required placeholder={'2.5 cups long-grain parboiled rice\n3 red bell peppers\n4 plum tomatoes\n1 scotch bonnet\n2 yellow onions\n3 tbsp tomato paste'} />
      <Row label="Step-by-step instructions (one step per line)" name="instructions" textarea rows={10} required placeholder={'Blend bell peppers, tomatoes, scotch bonnet, and one onion until smooth.\nIn a heavy pot, heat oil. Dice the second onion and sauté until soft.\nAdd tomato paste and the blended mixture. Simmer 15 minutes.'} />

      <Row label="Photo URL (optional)" name="photo_url" type="url" placeholder="https://i.imgur.com/your-photo.jpg" />
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
};

function Row({ label, name, required, type = 'text', placeholder, textarea, rows, min, max }: RowProps) {
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
        />
      )}
    </label>
  );
}
