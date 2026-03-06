'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useNews } from '@/hooks/useNews';
import { generateNewsImageAlt } from '@/lib/seoImageUtils';

export default function Naujienos() {
  const { news: newsItems, loading } = useNews();

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-14 md:pt-0 ml-0 md:ml-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1329d4]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-14 md:pt-0 ml-0 md:ml-80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Naujienos
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="group border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all duration-300 bg-white"
            >
              <div className="aspect-[16/10] relative bg-gray-100 overflow-hidden">
                <Image
                  src={item.image_url || '/sliede-1.jpeg'}
                  alt={generateNewsImageAlt(item.title, item.tag)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <time
                    dateTime={item.created_at}
                    className="text-sm text-gray-500"
                  >
                    {new Date(item.created_at).toLocaleDateString('lt-LT', {
                      year: '2-digit',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </time>
                  <span className="px-2.5 py-0.5 text-xs font-semibold text-white bg-[#141414] rounded">
                    {item.tag}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 leading-snug mb-3 line-clamp-2 group-hover:text-[#1329d4] transition-colors">
                  {item.title}
                </h2>
                <Link
                  href={`/naujienos/${item.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#1329d4] hover:underline"
                >
                  Skaityti daugiau
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Norite gauti naujienas el. paštu?{' '}
            <a href="mailto:info@piksel.lt" className="text-[#1329d4] font-medium hover:underline">
              Susisiekite su mumis
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
