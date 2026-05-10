import { StarRating } from './StarRating';

type SyntheticReview = {
  name: string;
  rating: number;
  body: string;
  date: string;
  wouldMakeAgain: boolean;
};

// Lightweight curated review pool. Real reviews land in DB later.
const POOL: SyntheticReview[] = [
  {
    name: 'Tola O.',
    rating: 5,
    body: 'Made this for Sunday lunch — the smoky bottom turned out perfect. Family demolished the pot in twenty minutes.',
    date: '3 days ago',
    wouldMakeAgain: true,
  },
  {
    name: 'Marcus B.',
    rating: 5,
    body: 'First time cooking this and the timing notes saved me. Did not lift the lid once. The crust at the bottom was the best part.',
    date: '1 week ago',
    wouldMakeAgain: true,
  },
  {
    name: 'Aisha K.',
    rating: 4,
    body: 'Loved it but added an extra scotch bonnet — we like it spicy. Recipe scales well, made a double batch.',
    date: '2 weeks ago',
    wouldMakeAgain: true,
  },
];

export function ReviewsSection({
  avgRating,
  ratingCount,
  recipeTitle,
}: {
  avgRating: number;
  ratingCount: number;
  recipeTitle: string;
}) {
  if (ratingCount === 0) return null;

  // Pick 3 deterministic reviews based on recipe title hash so it varies per recipe.
  const offset = recipeTitle.length % POOL.length;
  const reviews = [...POOL.slice(offset), ...POOL.slice(0, offset)].slice(0, 3);

  return (
    <section className="mt-10">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h2 className="font-serif text-2xl">Reviews</h2>
        <div className="flex items-center gap-3 text-sm">
          <StarRating value={avgRating} size="md" />
          <span className="font-medium">{avgRating.toFixed(1)}</span>
          <span className="text-ink-muted">
            ({ratingCount} review{ratingCount === 1 ? '' : 's'})
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((r, i) => (
          <article key={i} className="rounded-2xl bg-white p-5 shadow-sm">
            <header className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  aria-hidden
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta-100 text-sm font-semibold text-terracotta-600"
                >
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-ink">{r.name}</p>
                  <p className="text-xs text-ink-muted">{r.date}</p>
                </div>
              </div>
              <StarRating value={r.rating} size="sm" />
            </header>
            <p className="text-sm text-ink-muted">{r.body}</p>
            {r.wouldMakeAgain ? (
              <p className="mt-2 text-xs font-medium text-success">✓ Would make again</p>
            ) : null}
          </article>
        ))}
      </div>

      <p className="mt-4 text-xs text-ink-subtle">
        Reviews shown are illustrative pre-launch. Real user reviews appear here as the community grows.
      </p>
    </section>
  );
}
