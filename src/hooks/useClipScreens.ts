'use client';

import { useEffect, useState } from 'react';
import { clipScreensFromExcel, ClipScreen } from '@/data/clipsData';
import { supabase } from '@/lib/supabase';

interface DbClipScreen {
  id: string;
  city: string;
  screen: string;
  type: string;
  resolution: string;
  spec_diagram_url?: string | null;
  display_order?: number;
}

/** Vietiniam testui: `.env.local` → `NEXT_PUBLIC_CLIP_SPEC_PREVIEW=1` (tik `next dev`). */
const CLIP_SPEC_PREVIEW_ROW: ClipScreen = {
  id: 999999,
  city: 'Vilnius',
  screen: 'Akropolis (vietinis testas)',
  type: 'Statinis',
  resolution: '4032x576',
  spec_diagram_url:
    'https://placehold.co/960x320/e8eef9/1e3a8a/png?text=Schema+mock+%28Info+ikona%29',
};

function appendClipSpecPreviewRowIfEnabled(list: ClipScreen[]): ClipScreen[] {
  if (process.env.NODE_ENV !== 'development') return list;
  if (process.env.NEXT_PUBLIC_CLIP_SPEC_PREVIEW !== '1') return list;
  if (list.some((row) => row.id === CLIP_SPEC_PREVIEW_ROW.id)) return list;
  return [...list, CLIP_SPEC_PREVIEW_ROW];
}

export function useClipScreens() {
  const [screens, setScreens] = useState<ClipScreen[]>(clipScreensFromExcel);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchClipScreens = async () => {
      try {
        const { data, error } = await supabase
          .from('clip_screens')
          .select('id, city, screen, type, resolution, spec_diagram_url, display_order')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (!mounted) return;
        if (!data || data.length === 0) {
          setScreens(appendClipSpecPreviewRowIfEnabled(clipScreensFromExcel));
          return;
        }

        const mapped: ClipScreen[] = (data as DbClipScreen[]).map((item, idx) => ({
          id: Number(item.id) || idx + 1,
          city: item.city,
          screen: item.screen,
          type: item.type,
          resolution: item.resolution,
          spec_diagram_url: item.spec_diagram_url ?? null,
        }));

        setScreens(appendClipSpecPreviewRowIfEnabled(mapped));
      } catch (error) {
        console.warn('Falling back to static clip screens:', error);
        if (mounted) setScreens(appendClipSpecPreviewRowIfEnabled(clipScreensFromExcel));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchClipScreens();

    return () => {
      mounted = false;
    };
  }, []);

  return { screens, loading };
}
