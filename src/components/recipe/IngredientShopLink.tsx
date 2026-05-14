import { ExternalLink } from 'lucide-react';
import { ingredientAffiliateUrl } from '@/lib/affiliate';

/**
 * Tiny outbound "shop" icon next to each recipe ingredient. Renders
 * server-side so the URL bakes into HTML — visible in view-source
 * and crawlable as a sponsored outbound link.
 *
 * Visual: 12×12 lucide ExternalLink icon, faint until hover. Doesn't
 * compete with the ingredient name or quantity for visual weight.
 */
export function IngredientShopLink({ ingredient }: { ingredient: string }) {
  const link = ingredientAffiliateUrl(ingredient);
  return (
    <a
      href={link.href}
      target={link.target}
      rel={link.rel}
      title={`Shop ${ingredient}${link.monetized ? ' — sponsored link supports RecipeCrave' : ''}`}
      className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-ink-subtle/60 transition-colors hover:bg-cream-100 hover:text-terracotta-500 focus-ring print:hidden"
      aria-label={`Shop ${ingredient} on Amazon`}
    >
      <ExternalLink className="h-3 w-3" aria-hidden />
    </a>
  );
}
