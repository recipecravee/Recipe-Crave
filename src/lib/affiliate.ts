/**
 * Affiliate-link helper for recipe ingredient lists.
 *
 * Generates an outbound URL that:
 *   - Falls back to a plain Amazon search for the ingredient name when
 *     no Amazon Associates tag is configured.
 *   - Appends the tag (`?tag=...`) when NEXT_PUBLIC_AMAZON_AFFILIATE_TAG
 *     is set, monetizing every outbound click without changing UX.
 *   - Adds `rel="nofollow sponsored noopener"` semantics via the
 *     accompanying React attributes (we return them as a tuple).
 *
 * Owner action to enable monetization: drop the env var
 *   NEXT_PUBLIC_AMAZON_AFFILIATE_TAG=recipecrave-20
 * in Vercel and redeploy. No code changes needed.
 *
 * No tag set → still useful as a "buy this ingredient" outbound link
 * (clean Amazon search). When the tag is added later every click on
 * every recipe page starts paying.
 */

const AMAZON_HOST = 'https://www.amazon.com/s';

export type AffiliateLink = {
  href: string;
  rel: string;
  target: '_blank';
  /** True when an affiliate tag was appended (UI may render a small "sponsored" disclosure). */
  monetized: boolean;
};

export function ingredientAffiliateUrl(ingredient: string): AffiliateLink {
  // Strip leading qty/units (e.g. "2 cups long-grain rice" → "long-grain rice").
  const cleaned = ingredient
    .replace(/^[\d./,]+\s*\w*\s*/, '') // drop "2 ", "1/2 ", "0.33 cup ", etc.
    .replace(/[,()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const query = encodeURIComponent(cleaned.slice(0, 80));
  const tag = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG;
  const href = tag
    ? `${AMAZON_HOST}?k=${query}&tag=${encodeURIComponent(tag)}&i=grocery`
    : `${AMAZON_HOST}?k=${query}&i=grocery`;
  return {
    href,
    target: '_blank',
    // FTC-compliant rel: sponsored when monetized, nofollow otherwise.
    rel: tag ? 'sponsored nofollow noopener noreferrer' : 'nofollow noopener noreferrer',
    monetized: Boolean(tag),
  };
}
