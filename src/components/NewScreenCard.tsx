'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LEDScreen } from '@/lib/supabase';
import { generateScreenImageAlt } from '@/lib/seoImageUtils';
import { X, MapPin, ChevronRight } from 'lucide-react';

const NEW_DAYS = 30; // Ekranai pridėti per paskutines N dienų

/** Išimtis: šis ekranas rodomas „Naujas“ kortelėje N dienų nuo kampanijos pradžios (ne nuo created_at). */
const FEATURED_SCREEN_SLUGS = new Set(['narbuto-ziedas']);

function isFeaturedScreen(s: LEDScreen): boolean {
  const slug = (s.slug || '').toLowerCase();
  if (FEATURED_SCREEN_SLUGS.has(slug)) return true;
  const name = (s.name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
  return name.includes('narbuto') && name.includes('zied');
}

/** Kampanijos pradžia. Po 30 d. nuo šios datos išimtis nebetaikoma. */
const FEATURED_SCREEN_PROMO_START = new Date('2026-03-26T00:00:00+02:00');
const FEATURED_SCREEN_PROMO_DAYS = 30;

function isWithinFeaturedPromoWindow(now: Date = new Date()): boolean {
  const end = new Date(FEATURED_SCREEN_PROMO_START);
  end.setDate(end.getDate() + FEATURED_SCREEN_PROMO_DAYS);
  end.setHours(23, 59, 59, 999);
  return now >= FEATURED_SCREEN_PROMO_START && now <= end;
}

export function getNewScreens(screens: LEDScreen[]): LEDScreen[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - NEW_DAYS);
  cutoff.setHours(0, 0, 0, 0);

  const seen = new Set<string>();
  const out: LEDScreen[] = [];

  for (const s of screens) {
    if (!isFeaturedScreen(s) || !isWithinFeaturedPromoWindow()) continue;
    if (seen.has(s.id)) continue;
    seen.add(s.id);
    out.push(s);
  }

  for (const s of screens) {
    if (seen.has(s.id)) continue;
    if (!s.created_at) continue;
    const created = new Date(s.created_at);
    if (!isNaN(created.getTime()) && created >= cutoff) {
      seen.add(s.id);
      out.push(s);
    }
  }

  return out;
}

interface NewScreenCardProps {
  screens: LEDScreen[];
  onClose: () => void;
  onShowPopup?: (screenId: string) => void;
  /** variant: 1 = minimal toast, 2 = card su nuotrauka, 3 = apatinis dešinės kampo pill */
  variant?: 1 | 2 | 3;
}

export default function NewScreenCard({
  screens,
  onClose,
  onShowPopup,
  variant = 2,
}: NewScreenCardProps) {
  const v = variant ?? 2;
  const [dismissed, setDismissed] = useState(false);

  const displayScreen = screens[0];
  if (!displayScreen || dismissed) return null;

  const handleClose = () => {
    setDismissed(true);
    onClose();
  };

  const handleShowOnMap = () => {
    if (onShowPopup) {
      onShowPopup(displayScreen.id);
    }
    handleClose();
  };

  // Variant 1: Kompaktiškas toast – horizontalus, šviesus fonas, minimalus
  if (v === 1) {
    return (
      <div
        className="absolute top-4 right-4 z-[1000] flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 px-4 py-3 max-w-sm"
      >
        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          <Image
            src={displayScreen.image_url || '/sliede-1.jpeg'}
            alt={generateScreenImageAlt(displayScreen.name, displayScreen.city, { isViaduct: displayScreen.is_viaduct })}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[#1329d4] mb-0.5">Naujas ekranas</p>
          <p className="font-semibold text-gray-900 truncate">{displayScreen.name}</p>
          <p className="text-xs text-gray-500 truncate">{displayScreen.city}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={handleShowOnMap}
            className="p-2 rounded-lg bg-[#1329d4] text-white hover:bg-[#0f20a8] transition-colors"
            title="Rodyti žemėlapyje"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Uždaryti"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Variant 3: Dešinėje viršuje – juodas, visa kortelė aktyvi
  if (v === 3) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleShowOnMap}
        onKeyDown={(e) => e.key === 'Enter' && handleShowOnMap()}
        className="absolute top-4 right-4 z-[1000] flex items-center gap-2 bg-[#141414] text-white rounded-lg pl-2 pr-2 py-2 shadow-2xl max-w-md cursor-pointer hover:bg-[#1a1a1a] transition-colors"
      >
        <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0 ring-2 ring-white/30">
          <Image
            src={displayScreen.image_url || '/sliede-1.jpeg'}
            alt={generateScreenImageAlt(displayScreen.name, displayScreen.city, { isViaduct: displayScreen.is_viaduct })}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div className="flex-1 min-w-0 py-1">
          <p className="text-[10px] uppercase tracking-wider text-[#bcf715] font-semibold">Naujas ekranas</p>
          <p className="font-semibold text-sm truncate">{displayScreen.name}</p>
          <p className="text-xs text-white/70 truncate">{displayScreen.city}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); handleClose(); }}
          className="flex-shrink-0 p-1 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Uždaryti"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Variant 2: Kortelė su nuotrauka (originalus stilius, šiek tiek pakeistas)
  return (
    <div
      className="absolute top-4 right-4 z-[1000] w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      style={{ maxWidth: 'calc(100vw - 680px)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}
    >
      <div className="relative h-32">
        <Image
          src={displayScreen.image_url || '/sliede-1.jpeg'}
          alt={generateScreenImageAlt(displayScreen.name, displayScreen.city, { isViaduct: displayScreen.is_viaduct })}
          fill
          className="object-cover"
          sizes="288px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur text-[#1329d4] text-xs font-semibold rounded-full">
            Naujas
          </span>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full bg-white/80 backdrop-blur text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Uždaryti"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-bold text-white text-lg drop-shadow-md">{displayScreen.name}</h3>
          <p className="text-white/90 text-sm flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {displayScreen.city}
          </p>
        </div>
      </div>
      <div className="p-3">
        <button
          onClick={handleShowOnMap}
          className="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
        >
          Rodyti žemėlapyje
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
