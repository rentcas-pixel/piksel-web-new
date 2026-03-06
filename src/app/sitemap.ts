import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { newsItems } from '@/data/newsData';

const BASE_URL = 'https://piksel.lt';

const staticRoutes: { path: string; changefreq: 'weekly' | 'monthly'; priority: number }[] = [
  { path: '', changefreq: 'weekly', priority: 1.0 },
  { path: 'ekranai', changefreq: 'weekly', priority: 0.9 },
  { path: 'viadukai', changefreq: 'weekly', priority: 0.9 },
  { path: 'planuoti-reklama', changefreq: 'weekly', priority: 0.9 },
  { path: 'kainos', changefreq: 'monthly', priority: 0.8 },
  { path: 'naujienos', changefreq: 'weekly', priority: 0.8 },
  { path: 'klipai', changefreq: 'monthly', priority: 0.8 },
  { path: 'kontaktai', changefreq: 'monthly', priority: 0.8 },
  { path: 'paslaugos', changefreq: 'monthly', priority: 0.8 },
  { path: 'duk', changefreq: 'monthly', priority: 0.7 },
  { path: 'skaiciuokle', changefreq: 'monthly', priority: 0.7 },
  { path: 'klipai-mobile', changefreq: 'monthly', priority: 0.6 },
  { path: 'duk-mobile', changefreq: 'monthly', priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  const now = new Date();
  for (const route of staticRoutes) {
    entries.push({
      url: route.path ? `${BASE_URL}/${route.path}` : BASE_URL + '/',
      lastModified: now,
      changeFrequency: route.changefreq,
      priority: route.priority,
    });
  }

  // Dynamic screen pages from Supabase
  try {
    const { data: screens, error } = await supabase
      .from('led_screens')
      .select('slug, custom_url, updated_at')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (!error && screens?.length) {
      for (const screen of screens) {
        const path = screen.custom_url || `ekranas/${screen.slug}`;
        const url = path.startsWith('http') ? path : `${BASE_URL}/${path}`;
        entries.push({
          url,
          lastModified: screen.updated_at ? new Date(screen.updated_at) : now,
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    }
  } catch (e) {
    console.error('Sitemap: failed to fetch screens', e);
  }

  // News from Supabase (fallback to static)
  try {
    const { data: news, error } = await supabase
      .from('news')
      .select('slug, updated_at')
      .order('created_at', { ascending: false });

    const newsSlugs = !error && news?.length ? news : newsItems.map((n) => ({ slug: n.slug, updated_at: null }));
    for (const item of newsSlugs) {
      entries.push({
        url: `${BASE_URL}/naujienos/${item.slug}`,
        lastModified: item.updated_at ? new Date(item.updated_at) : now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  } catch (e) {
    console.error('Sitemap: failed to fetch news', e);
    for (const item of newsItems) {
      entries.push({
        url: `${BASE_URL}/naujienos/${item.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
