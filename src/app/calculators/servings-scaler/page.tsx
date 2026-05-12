import { redirect } from 'next/navigation';

// The Servings Scaler is fully covered by the Real-time Recipe Scaler.
// Permanent redirect preserves any inbound SEO link equity.
export default function ServingsScalerRedirect(): never {
  redirect('/calculators/realtime-recipe-scaler');
}
