'use client';

import { useState, useEffect } from 'react';
import { ClipRequirement, defaultClipsData } from '@/data/clipsData';

function loadFromStorage(): ClipRequirement[] {
  if (typeof window === 'undefined') return defaultClipsData;
  try {
    const stored = localStorage.getItem('clipsData');
    if (stored) {
      const parsed = JSON.parse(stored) as ClipRequirement[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return defaultClipsData;
}

/** Klipų reikalavimai iš localStorage (admin redaguoja) arba defaultClipsData */
export function useClipsData() {
  const [clipsData, setClipsData] = useState<ClipRequirement[]>(loadFromStorage);

  useEffect(() => {
    setClipsData(loadFromStorage());
    const onStorage = () => setClipsData(loadFromStorage());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return clipsData;
}
