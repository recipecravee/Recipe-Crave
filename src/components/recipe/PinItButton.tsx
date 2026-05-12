'use client';

import { ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * "Pin it" share button — opens Pinterest's pin-creation modal pre-filled
 * with the recipe page URL, pin description, and the 2:3 vertical pin
 * image generated at /api/pin/[slug].png.
 *
 * Pinterest accepts query-string parameters on /pin/create/button/:
 *   - url:         page URL Pinterest links the pin to
 *   - media:       URL of the image to use for the pin
 *   - description: pin caption (160 chars max for best visibility)
 *
 * Renders nothing on the server (avoids hydration mismatch with the
 * window-based origin lookup). Print-hidden.
 */
export function PinItButton({
  recipeSlug,
  title,
  description,
}: {
  recipeSlug: string;
  title: string;
  description?: string;
}) {
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  if (!origin) return null;

  const pageUrl = `${origin}/recipes/${recipeSlug}`;
  const imageUrl = `${origin}/api/pin/${recipeSlug}.png`;
  const caption = (description ?? title).slice(0, 160);

  const href =
    `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl)}` +
    `&media=${encodeURIComponent(imageUrl)}` +
    `&description=${encodeURIComponent(`${title} — ${caption}`)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Save this recipe to Pinterest"
      className="inline-flex items-center gap-1.5 rounded-full bg-[#E60023] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#bd001d] focus-ring print:hidden"
    >
      {/* Pinterest "P" icon */}
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12.04 2C6.5 2 2 6.5 2 12.05c0 4.16 2.54 7.7 6.15 9.2-.09-.78-.16-1.97.03-2.82.18-.78 1.16-4.97 1.16-4.97s-.3-.6-.3-1.48c0-1.39.8-2.43 1.81-2.43.85 0 1.27.64 1.27 1.41 0 .86-.55 2.14-.83 3.33-.24 1 .5 1.81 1.49 1.81 1.79 0 3.16-1.88 3.16-4.6 0-2.41-1.73-4.09-4.21-4.09-2.86 0-4.54 2.15-4.54 4.37 0 .87.33 1.8.75 2.3a.3.3 0 0 1 .07.29c-.08.32-.26 1.04-.3 1.18-.05.2-.15.24-.36.14-1.34-.62-2.18-2.58-2.18-4.16 0-3.38 2.46-6.49 7.08-6.49 3.72 0 6.61 2.65 6.61 6.19 0 3.7-2.33 6.67-5.57 6.67-1.09 0-2.11-.57-2.46-1.24l-.67 2.54c-.24.93-.89 2.1-1.33 2.81 1 .31 2.06.48 3.16.48 5.55 0 10.05-4.5 10.05-10.05C22.06 6.5 17.56 2 12.04 2z" />
      </svg>
      Pin it
      <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
    </a>
  );
}
