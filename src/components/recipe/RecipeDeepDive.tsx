import { Compass, Flame, AlertTriangle, Sparkles, Salad, Archive, Layers } from 'lucide-react';
import type { Recipe } from '@/types/recipe';
import { generateDeepDive } from '@/lib/content/deep-dive';

type Props = { recipe: Recipe };

/**
 * Six-section deep-dive panel rendered below the recipe instructions.
 * Adds ~1,200-1,500 words of metadata-driven crawlable content to every
 * recipe page so each lands well clear of the 1,500 word floor for
 * high-intent recipe queries.
 *
 * Section titles map to common search-intent queries
 * ("recipe origin", "how to cook X", "common mistakes", "make-ahead").
 */
export function RecipeDeepDive({ recipe }: Props) {
  const dd = generateDeepDive(recipe);

  return (
    <section className="mt-10 rounded-3xl border border-cream-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-forest-700">
        <Layers className="h-4 w-4" aria-hidden />
        Deep dive — the recipe explained
      </div>

      <Block icon={Compass} title="Origin & tradition">
        <p>{dd.origin}</p>
      </Block>

      <Block icon={Flame} title="Technique that drives this dish">
        <p>{dd.technique}</p>
      </Block>

      <Block icon={Sparkles} title="Difficulty notes for the home cook">
        <p>{dd.difficulty}</p>
      </Block>

      <Block icon={AlertTriangle} title="Common mistakes (and how to dodge them)">
        <ul className="list-disc space-y-2 pl-5">
          {dd.mistakes.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </Block>

      <Block icon={Archive} title="Storage, freezer & make-ahead">
        <DeepDiveStorage text={dd.storage} />
      </Block>

      <Block icon={Salad} title="Nutrition & dietary fit">
        <p>{dd.dietary}</p>
      </Block>

      <Block icon={Compass} title="Variations that keep the dish honest">
        <ul className="list-disc space-y-2 pl-5">
          {dd.variations.map((v, i) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
      </Block>
    </section>
  );
}

function Block({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-2 border-t border-cream-200 pt-6 first:border-t-0 first:pt-0">
      <h3 className="mb-3 flex items-center gap-2 font-serif text-xl text-ink sm:text-2xl">
        <Icon className="h-5 w-5 text-terracotta-500" aria-hidden />
        {title}
      </h3>
      <div className="space-y-3 text-sm leading-relaxed text-ink-muted sm:text-[15px]">
        {children}
      </div>
    </div>
  );
}

/**
 * Renders the storage block. The generator returns one string with three
 * **bold-labeled** paragraphs separated by blank lines. We split on the
 * double newline and render markdown-light: any `**...**` becomes <strong>.
 */
function DeepDiveStorage({ text }: { text: string }) {
  const paragraphs = text.split('\n\n');
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i}>
          {p.split(/\*\*(.+?)\*\*/g).map((chunk, j) =>
            j % 2 === 1 ? (
              <strong key={j} className="text-ink">
                {chunk}
              </strong>
            ) : (
              <span key={j}>{chunk}</span>
            ),
          )}
        </p>
      ))}
    </>
  );
}
