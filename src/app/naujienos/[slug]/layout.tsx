import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { getNewsBySlug, newsItems } from '@/data/newsData';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const { data } = await supabase.from('news').select('slug');
    if (data?.length) return data.map((n) => ({ slug: n.slug }));
  } catch {
    // fallback
  }
  return newsItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = await supabase.from('news').select('title, excerpt').eq('slug', slug).single();
    if (data) {
      return {
        title: `${data.title} | PIKSEL - Naujienos`,
        description: data.excerpt || undefined,
      };
    }
  } catch {
    // fallback
  }
  const article = getNewsBySlug(slug);
  if (!article) return { title: 'Naujiena nerasta | PIKSEL' };
  return {
    title: `${article.title} | PIKSEL - Naujienos`,
    description: article.excerpt,
  };
}

export default function NewsArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
