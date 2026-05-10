import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { getAllCollections, getCollectionBySlug } from '@/lib/data/recipes';
import { breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo/structured-data';

export async function generateStaticParams() {
  const collections = await getAllCollections();
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return { title: 'Not found' };
  return {
    title: collection.title,
    description: collection.description,
    alternates: { canonical: `/collections/${slug}` },
  };
}

export default async function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Collections', url: '/collections' },
    { name: collection.title, url: `/collections/${slug}` },
  ];

  return (
    <div className="container py-10 lg:py-14">
      <JsonLd
        data={[
          breadcrumbJsonLd(breadcrumbs),
          itemListJsonLd(collection.recipes.map((r) => ({ name: r.title, url: `/recipes/${r.slug}` }))),
        ]}
      />
      <header className="mb-10 max-w-2xl">
        <h1 className="font-serif text-4xl text-ink sm:text-5xl">{collection.title}</h1>
        <p className="mt-3 text-ink-muted">{collection.description}</p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {collection.recipes.map((r) => (
          <RecipeCard key={r.slug} recipe={r} />
        ))}
      </div>
    </div>
  );
}
