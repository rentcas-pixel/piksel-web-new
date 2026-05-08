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
  display_order?: number;
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
          .select('id, city, screen, type, resolution, display_order')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (!mounted) return;
        if (!data || data.length === 0) {
          setScreens(clipScreensFromExcel);
          return;
        }

        const mapped: ClipScreen[] = (data as DbClipScreen[]).map((item, idx) => ({
          id: Number(item.id) || idx + 1,
          city: item.city,
          screen: item.screen,
          type: item.type,
          resolution: item.resolution,
        }));

        setScreens(mapped);
      } catch (error) {
        console.warn('Falling back to static clip screens:', error);
        if (mounted) setScreens(clipScreensFromExcel);
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
