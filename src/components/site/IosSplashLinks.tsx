/**
 * Apple iOS splash-screen <link> tags. iOS only consults
 * apple-touch-startup-image links with exact media-query matches —
 * one portrait + one landscape entry per device. Mismatches fall back
 * to the theme-color background which looks unbranded.
 *
 * 12 iOS device tiers × 2 orientations = 24 links. Files are
 * pre-generated under /public/splash/ by scripts/gen-splash.py
 * (one-shot generator using PIL).
 *
 * Server component — renders directly into <head> via the layout's
 * head element. Zero JS cost.
 */

type Splash = {
  width: number;
  height: number;
  label: string;
  /** Device-pixel ratio media query token. iOS exposes -webkit-device-pixel-ratio. */
  dpr: number;
};

const DEVICES: Splash[] = [
  { width: 1290, height: 2796, label: '15-pro-max', dpr: 3 },
  { width: 1179, height: 2556, label: '15-pro', dpr: 3 },
  { width: 1284, height: 2778, label: '14-pro-max', dpr: 3 },
  { width: 1170, height: 2532, label: '14-pro', dpr: 3 },
  { width: 1125, height: 2436, label: 'xs', dpr: 3 },
  { width: 828, height: 1792, label: 'xr', dpr: 2 },
  { width: 1242, height: 2688, label: '11-pro-max', dpr: 3 },
  { width: 750, height: 1334, label: 'se', dpr: 2 },
  { width: 1668, height: 2388, label: 'ipad-pro-11', dpr: 2 },
  { width: 2048, height: 2732, label: 'ipad-pro-13', dpr: 2 },
  { width: 1536, height: 2048, label: 'ipad-mini', dpr: 2 },
  { width: 1620, height: 2160, label: 'ipad-10-9', dpr: 2 },
];

export function IosSplashLinks() {
  return (
    <>
      {DEVICES.map((d) => {
        const wCss = d.width / d.dpr;
        const hCss = d.height / d.dpr;
        const mediaPortrait = `(device-width: ${wCss}px) and (device-height: ${hCss}px) and (-webkit-device-pixel-ratio: ${d.dpr}) and (orientation: portrait)`;
        const mediaLandscape = `(device-width: ${wCss}px) and (device-height: ${hCss}px) and (-webkit-device-pixel-ratio: ${d.dpr}) and (orientation: landscape)`;
        return (
          <>
            <link
              key={`p-${d.label}`}
              rel="apple-touch-startup-image"
              media={mediaPortrait}
              href={`/splash/iphone-${d.label}-${d.width}x${d.height}.png`}
            />
            <link
              key={`l-${d.label}`}
              rel="apple-touch-startup-image"
              media={mediaLandscape}
              href={`/splash/iphone-${d.label}-land-${d.height}x${d.width}.png`}
            />
          </>
        );
      })}
    </>
  );
}
