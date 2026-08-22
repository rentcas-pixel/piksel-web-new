'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const NAV = [
  { label: 'Aktualu dabar', href: '/naujienos' },
  { label: 'Tinklas', action: 'map' as const },
  { label: 'Kampanijos', href: '/klipai' },
  { label: 'LED sprendimai', href: '/paslaugos' },
  { label: 'Kontaktai', href: '/kontaktai' },
];

interface LandingHeaderProps {
  onScrollToMap: () => void;
  onGetOffer: () => void;
}

export default function LandingHeader({ onScrollToMap, onGetOffer }: LandingHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#141414] border-b border-white/10">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-white shrink-0">
          Piksel
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((item) =>
            item.action === 'map' ? (
              <button
                key={item.label}
                type="button"
                onClick={onScrollToMap}
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.label}
                href={item.href!}
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            )
          )}
          <span className="text-xs font-semibold tracking-wider text-white/30 uppercase border border-white/15 px-2 py-1">
            Versija A
          </span>
        </nav>

        <button
          type="button"
          onClick={onGetOffer}
          className="inline-flex items-center gap-2 bg-[#bcf715] text-[#141414] font-bold text-xs tracking-[0.12em] uppercase px-5 py-2.5 hover:bg-[#d4ff4d] transition-colors shrink-0"
        >
          Gauti pasiūlymą
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
