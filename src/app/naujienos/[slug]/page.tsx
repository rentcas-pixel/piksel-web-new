'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useNews } from '@/hooks/useNews';
import { getNewsBySlug } from '@/data/newsData';
import { generateNewsImageAlt } from '@/lib/seoImageUtils';

export default function NewsArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { news, loading } = useNews();
  const dbArticle = news.find((n) => n.slug === slug);
  const staticArticle = getNewsBySlug(slug);
  const article: { title: string; content: string; tag: string; image: string; date: string } | null = dbArticle
    ? { ...dbArticle, image: dbArticle.image_url || '/sliede-1.jpeg', date: dbArticle.created_at }
    : staticArticle
      ? { ...staticArticle, image: staticArticle.image, date: staticArticle.date }
      : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-14 md:pt-0 ml-0 md:ml-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1329d4]" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white pt-14 md:pt-0 ml-0 md:ml-80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Naujiena nerasta</h1>
          <Link
            href="/naujienos"
            className="inline-flex items-center gap-2 text-[#1329d4] font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Grįžti į naujienas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-14 md:pt-0 ml-0 md:ml-80">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <Link
          href="/naujienos"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1329d4] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Grįžti į naujienas
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <time
            dateTime={article.date || ''}
            className="flex items-center gap-1.5 text-sm text-gray-500"
          >
            <Calendar className="w-4 h-4" />
            {new Date(article.date || '').toLocaleDateString('lt-LT', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span className="px-2.5 py-0.5 text-xs font-semibold text-white bg-[#141414] rounded">
            {article.tag}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          {article.title}
        </h1>

        <div className="aspect-video relative rounded-xl overflow-hidden bg-gray-100 mb-8">
          <Image
            src={article.image || '/sliede-1.jpeg'}
            alt={generateNewsImageAlt(article.title, article.tag)}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="prose prose-gray max-w-none">
          {article.content.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-gray-600 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/naujienos"
            className="inline-flex items-center gap-2 text-[#1329d4] font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Visos naujienos
          </Link>
        </div>
      </article>
    </div>
  );
}
