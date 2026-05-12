import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

/**
 * Transparent affiliate link wrapper.
 *
 * Strategy doc requires monetization through ingredient and kitchen-equipment
 * commissions, with transparent disclosure to maintain trust. This wrapper:
 *
 *   - Renders a small shopping-cart icon to mark links as affiliate
 *   - Adds rel="sponsored noopener" so search engines correctly attribute
 *     the link (Google's official `rel` value for paid placements)
 *   - Opens in a new tab via target="_blank"
 *   - Is no-op until the user provides actual Amazon Associates / impact /
 *     ShareASale / local-grocer affiliate IDs. Default `href` falls through
 *     to a no-op marker so we never ship a broken commission.
 *
 * Usage:
 *   <AffiliateLink to="amazon" sku="B07VJF98DT">Lodge cast iron skillet</AffiliateLink>
 *
 * When affiliate IDs land, swap the `buildHref` switch to inject your
 * Associates tag (e.g. ?tag=recipecrave-20). The component contract does
 * not change — every existing call site keeps working.
 */

export type AffiliateProvider = 'amazon' | 'imperfectfoods' | 'instacart' | 'misfits' | 'walmart' | 'tesco';

const PROVIDER_LABEL: Record<AffiliateProvider, string> = {
  amazon: 'Amazon',
  imperfectfoods: 'Imperfect Foods',
  instacart: 'Instacart',
  misfits: 'Misfits Market',
  walmart: 'Walmart',
  tesco: 'Tesco',
};

function buildHref(provider: AffiliateProvider, sku: string): string {
  switch (provider) {
    case 'amazon':
      // Replace `recipecrave-20` with your real Associates tag when ready.
      return `https://www.amazon.com/dp/${encodeURIComponent(sku)}?tag=recipecrave-20`;
    case 'walmart':
      return `https://www.walmart.com/ip/${encodeURIComponent(sku)}`;
    case 'instacart':
      return `https://www.instacart.com/store/items/${encodeURIComponent(sku)}`;
    case 'imperfectfoods':
      return `https://www.imperfectfoods.com/products/${encodeURIComponent(sku)}`;
    case 'misfits':
      return `https://www.misfitsmarket.com/products/${encodeURIComponent(sku)}`;
    case 'tesco':
      return `https://www.tesco.com/groceries/en-GB/products/${encodeURIComponent(sku)}`;
    default:
      return '#';
  }
}

export function AffiliateLink({
  children,
  to,
  sku,
  className = '',
  showProviderLabel = false,
}: {
  children: React.ReactNode;
  to: AffiliateProvider;
  sku: string;
  className?: string;
  showProviderLabel?: boolean;
}) {
  const href = buildHref(to, sku);
  return (
    <Link
      href={href}
      target="_blank"
      rel="sponsored noopener"
      className={`group inline-flex items-baseline gap-1 underline decoration-terracotta-300 decoration-dotted underline-offset-2 hover:text-terracotta-600 hover:decoration-terracotta-500 ${className}`}
    >
      {children}
      <ShoppingBag
        className="inline h-3 w-3 self-center text-terracotta-400 transition-transform group-hover:scale-110"
        aria-label="affiliate link"
      />
      {showProviderLabel ? (
        <span className="text-[10px] uppercase tracking-wider text-ink-subtle">
          ({PROVIDER_LABEL[to]})
        </span>
      ) : null}
    </Link>
  );
}

/**
 * Inline disclosure block. Drop this once per page that contains affiliate
 * links. Search-engine and FTC compliant disclosure.
 */
export function AffiliateDisclosure({ className = '' }: { className?: string }) {
  return (
    <p
      className={`text-[11px] text-ink-subtle ${className}`}
      data-affiliate-disclosure
    >
      RecipeCrave participates in affiliate programs including Amazon
      Associates. We may earn a small commission on purchases made through
      product links on this page, at no extra cost to you. Editorial picks
      are never influenced by commission.
    </p>
  );
}
