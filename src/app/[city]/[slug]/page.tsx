import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ScreenDetailView from '@/components/ScreenDetailView';
import { generateScreenImageAlt } from '@/lib/seoImageUtils';
import {
  fetchRelatedScreens,
  fetchScreenByCustomPath,
  getScreenPath,
} from '@/lib/screenUtils';

const BASE = 'https://piksel.lt';

type PageProps = {
  params: Promise<{ city: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city, slug } = await params;
  const screen = await fetchScreenByCustomPath(`${city}/${slug}`);

  if (!screen) {
    return { title: 'Ekranas nerastas | PIKSEL' };
  }

  const title = `${screen.name} – LED ekranas ${screen.city} | PIKSEL`;
  const description =
    screen.description ||
    `LED reklamos ekranas ${screen.name}, ${screen.address}, ${screen.city}. Tikrinkite prieinamumą ir planuokite kampaniją PIKSEL tinkle.`;
  const path = getScreenPath(screen);
  const url = `${BASE}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'PIKSEL',
      locale: 'lt_LT',
      type: 'website',
      images: screen.image_url
        ? [{ url: screen.image_url, alt: generateScreenImageAlt(screen.name, screen.city) }]
        : undefined,
    },
  };
}

export default async function CustomUrlScreenPage({ params }: PageProps) {
  const { city, slug } = await params;
  const screen = await fetchScreenByCustomPath(`${city}/${slug}`);

  if (!screen) {
    notFound();
  }

  const relatedScreens = await fetchRelatedScreens(screen.city, screen.id);

  return <ScreenDetailView screen={screen} relatedScreens={relatedScreens} />;
}
