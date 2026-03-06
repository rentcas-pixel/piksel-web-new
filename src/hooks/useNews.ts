'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { NewsItem } from '@/lib/supabase';
import { newsItems as fallbackNews } from '@/data/newsData';

function mapFallbackToNewsItem(item: (typeof fallbackNews)[0]): NewsItem {
  return {
    id: String(item.id),
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    image_url: item.image,
    tag: item.tag,
    created_at: item.date + 'T12:00:00Z',
    updated_at: item.date + 'T12:00:00Z',
  };
}

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error: err } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });

        if (err) throw err;
        setNews(data || []);
      } catch (e) {
        console.warn('News fetch failed, using fallback:', e);
        setNews(fallbackNews.map(mapFallbackToNewsItem));
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return { news, loading, error };
}
