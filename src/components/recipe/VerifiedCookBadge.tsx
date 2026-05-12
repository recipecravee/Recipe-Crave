import { CheckCircle2 } from 'lucide-react';

/**
 * "Verified cook" trust badge for review rows.
 *
 * Strategy doc requires verified-purchase-style trust signals on reviews
 * to lift time-on-page + Google E-E-A-T. A review is "verified" if the
 * reviewer:
 *   - has marked at least one ingredient as ticked off in the saved cooking
 *     session, OR
 *   - explicitly tagged "I made this" when leaving the review
 *
 * For v1 (no auth) the badge is rendered on any review whose meta carries
 * { madeIt: true }. Future auth phase can require server-side verification.
 */
export function VerifiedCookBadge({ madeIt = false, className = '' }: {
  madeIt?: boolean;
  className?: string;
}) {
  if (!madeIt) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest-700 ${className}`}
      title="Reviewer confirmed they cooked this recipe"
    >
      <CheckCircle2 className="h-3 w-3" aria-hidden /> Verified cook
    </span>
  );
}
