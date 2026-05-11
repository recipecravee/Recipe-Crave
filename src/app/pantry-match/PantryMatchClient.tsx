'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import type { RecipeSummary } from '@/types/recipe';

type DetectedIngredient = { name: string; confidence: number };

export function PantryMatchClient() {
  const [ingredients, setIngredients] = useState('');
  const [matches, setMatches] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [detected, setDetected] = useState<DetectedIngredient[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  async function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Could not read file.'));
      reader.readAsDataURL(file);
    });
  }

  async function downscale(dataUrl: string, maxSide = 1280): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setPhotoBusy(true);
    setDetected([]);
    try {
      const raw = await fileToDataUrl(file);
      const small = await downscale(raw);
      setPhotoPreview(small);

      const res = await fetch('/api/ai/pantry-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageDataUrl: small }),
      });
      const data = (await res.json()) as { ok: boolean; ingredients?: DetectedIngredient[]; error?: string };
      if (!data.ok) {
        setError(data.error ?? 'Could not scan photo.');
        return;
      }
      const found = data.ingredients ?? [];
      setDetected(found);
      // Pre-populate text input with detected ingredients
      if (found.length > 0) {
        setIngredients(found.map((i) => i.name).join(', '));
      } else {
        setError('No ingredients detected. Try a clearer photo or type them in below.');
      }
    } catch {
      setError('Network error while scanning. Try again.');
    } finally {
      setPhotoBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function removeDetected(name: string) {
    const next = detected.filter((d) => d.name !== name);
    setDetected(next);
    setIngredients(next.map((d) => d.name).join(', '));
  }

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/pantry-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: ingredients
            .split(',')
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean),
        }),
      });
      const data = (await res.json()) as { ok: boolean; recipes?: RecipeSummary[]; error?: string };
      if (data.ok && data.recipes) {
        setMatches(data.recipes);
        if (data.recipes.length === 0) {
          setError('No matches yet. Try adding more ingredients.');
        }
      } else {
        setError(data.error ?? 'Could not match. Try again.');
      }
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Photo scan card */}
      <div className="rounded-2xl bg-gradient-to-br from-terracotta-50 to-cream-100 p-6 shadow-sm">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-terracotta-400 text-white">
            <Camera className="h-6 w-6" aria-hidden />
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-xl text-ink">Snap your fridge or pantry</h2>
            <p className="mt-1 text-sm text-ink-muted">
              We&apos;ll identify ingredients in the photo and find recipes you can cook right now. No login.
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhoto}
              className="hidden"
              aria-label="Upload pantry photo"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" onClick={() => fileRef.current?.click()} disabled={photoBusy}>
                {photoBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                {photoBusy ? 'Scanning…' : 'Take or upload photo'}
              </Button>
              {photoPreview ? (
                <Button type="button" variant="outline" onClick={() => { setPhotoPreview(null); setDetected([]); }}>
                  <X className="mr-1.5 h-4 w-4" /> Clear
                </Button>
              ) : null}
            </div>
          </div>
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Pantry preview"
              className="h-24 w-24 rounded-lg object-cover shadow-sm"
            />
          ) : null}
        </div>

        {detected.length > 0 ? (
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              Detected ingredients
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {detected.map((d) => (
                <Badge
                  key={d.name}
                  variant="default"
                  className="cursor-pointer pr-1.5"
                  onClick={() => removeDetected(d.name)}
                  title={`${Math.round(d.confidence * 100)}% confident — click to remove`}
                >
                  {d.name}
                  <span className="ml-1.5 opacity-60 hover:opacity-100">×</span>
                </Badge>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Type-it-out alternative */}
      <form onSubmit={handleSearch} className="rounded-2xl bg-white p-6 shadow-sm">
        <label htmlFor="pantry-input" className="text-sm font-medium">
          Or type ingredients (comma-separated)
        </label>
        <Input
          id="pantry-input"
          placeholder="chicken, rice, garlic, soy sauce, broccoli"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="mt-1"
        />
        <Button type="submit" disabled={loading || !ingredients.trim()} className="mt-4">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          {loading ? 'Finding matches…' : 'Find recipes I can cook'}
        </Button>
        {error ? <p role="alert" className="mt-3 text-sm text-danger">{error}</p> : null}
      </form>

      {matches.length > 0 ? (
        <section>
          <h2 className="mb-6 font-serif text-2xl">
            {matches.length} match{matches.length === 1 ? '' : 'es'}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {matches.map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
