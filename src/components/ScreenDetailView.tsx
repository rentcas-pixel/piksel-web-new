'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  ChevronDown,
  Eye,
  MapPin,
  Maximize2,
  Monitor,
  Users,
} from 'lucide-react';
import { LEDScreen } from '@/lib/supabase';
import { generateScreenImageAlt } from '@/lib/seoImageUtils';
import {
  formatPrice,
  formatTraffic,
  getMapLink,
  getScreenFeatures,
  getScreenPath,
} from '@/lib/screenUtils';

interface ScreenDetailViewProps {
  screen: LEDScreen;
  relatedScreens: LEDScreen[];
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: 'green' | 'blue';
}) {
  return (
    <div className="px-6 lg:px-8 py-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon
          className={`w-4 h-4 ${accent === 'green' ? 'text-[#bcf715]' : accent === 'blue' ? 'text-[#1329d4]' : 'text-white/50'}`}
        />
        <span className="text-[10px] sm:text-xs font-semibold tracking-[0.15em] text-white/45 uppercase">
          {label}
        </span>
      </div>
      <div className="text-xl sm:text-2xl font-extrabold tracking-tight">{value}</div>
    </div>
  );
}

export default function ScreenDetailView({ screen, relatedScreens }: ScreenDetailViewProps) {
  const [openSpec, setOpenSpec] = useState<string | null>('specs');

  const features = getScreenFeatures(screen);
  const traffic = formatTraffic(screen.traffic);
  const price = formatPrice(screen.price);
  const mapLink = getMapLink(screen);

  const stats = [
    screen.size
      ? { icon: Maximize2, label: 'Dydis', value: `${screen.size} m`, accent: 'green' as const }
      : null,
    screen.resolution
      ? { icon: Monitor, label: 'Rezoliucija', value: screen.resolution, accent: 'blue' as const }
      : null,
    traffic
      ? { icon: Eye, label: 'Srautas / sav.', value: traffic, accent: undefined }
      : null,
    price
      ? { icon: Calendar, label: 'Dienos kaina', value: price, accent: 'green' as const }
      : null,
  ].filter(Boolean) as {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    accent?: 'green' | 'blue';
  }[];

  const description =
    screen.description ||
    `Strategiškai išdėstytas ${screen.address} vietoje, ${screen.city}${screen.district ? ` (${screen.district})` : ''} – šis LED ekranas užtikrina maksimalų jūsų reklamos pranešimo matomumą ir poveikį.`;

  const specSections = [
    {
      id: 'specs',
      title: 'Raiška ir technologija',
      content: [
        screen.resolution && `Rezoliucija: ${screen.resolution} px`,
        screen.size && `Fizinis dydis: ${screen.size} m`,
        'Ryškumas: 7 500–10 000 nitų (lauko standartas)',
        'Matymo kampas: 160° / 70°',
        screen.is_video ? 'Video turinys – dinaminė reklama' : 'Statinis arba video turinys',
      ].filter(Boolean) as string[],
    },
    {
      id: 'location',
      title: 'Vieta ir adresas',
      content: [
        `${screen.city}${screen.district ? `, ${screen.district}` : ''}`,
        screen.address,
        screen.coordinates[0] !== 0
          ? `Koordinatės: ${screen.coordinates[0].toFixed(5)}, ${screen.coordinates[1].toFixed(5)}`
          : null,
      ].filter(Boolean) as string[],
    },
    ...(screen.is_double_sided
      ? [
          {
            id: 'sides',
            title: 'Dvipusis ekranas',
            content: [
              screen.side_a_name ? `A pusė: ${screen.side_a_name}` : 'A pusė',
              screen.side_b_name ? `B pusė: ${screen.side_b_name}` : 'B pusė',
              'Galima reklama abiejose pusėse',
            ],
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-14 md:pt-0 ml-0 md:ml-80">
      {/* Hero */}
      <section className="relative min-h-[55vh] sm:min-h-[65vh] flex flex-col justify-end overflow-hidden">
        <Image
          src={screen.image_url}
          alt={generateScreenImageAlt(screen.name, screen.city, { isViaduct: screen.is_viaduct })}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1280px) 100vw, calc(100vw - 320px)"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-[#050505]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/60 via-transparent to-transparent" />

        <div className="relative z-10 px-6 sm:px-8 lg:px-12 pb-8 pt-20 max-w-4xl">
          <nav className="text-xs text-white/50 mb-6 tracking-wide flex flex-wrap items-center gap-1">
            <Link href="/" className="hover:text-[#bcf715] transition-colors">
              Pagrindinis
            </Link>
            <span className="mx-1">/</span>
            <Link href={`/?city=${encodeURIComponent(screen.city)}`} className="hover:text-[#bcf715] transition-colors">
              {screen.city}
            </Link>
            <span className="mx-1">/</span>
            <span className="text-white/80">{screen.name}</span>
          </nav>

          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-[#bcf715] shrink-0" />
            <span className="text-xs font-semibold tracking-[0.2em] text-[#bcf715] uppercase">
              LED ekranas · {screen.city}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.08] tracking-tight mb-3">
            {screen.name}
          </h1>

          <div className="flex items-start gap-2 text-white/65 mb-5">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#bcf715]" />
            <p className="text-sm sm:text-base leading-relaxed">
              {screen.address}
              {screen.district ? ` · ${screen.district}` : ''}
            </p>
          </div>

          {features.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {features.map((f) => (
                <span
                  key={f}
                  className="text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1 bg-white/10 border border-white/15 text-white/80"
                >
                  {f}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Link
              href={mapLink}
              className="inline-flex items-center gap-2 bg-[#bcf715] text-[#141414] font-bold text-sm tracking-wide uppercase px-6 py-3.5 hover:bg-[#d4ff4d] transition-colors"
            >
              Tikrinti prieinamumą
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/kontaktai"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold text-sm tracking-wide uppercase px-6 py-3.5 hover:border-white/60 hover:bg-white/5 transition-colors"
            >
              Planuoti kampaniją
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      {stats.length > 0 && (
        <div className="border-t border-white/10 bg-[#050505]/95 backdrop-blur-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/10">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      )}

      {/* Ticker */}
      <div className="bg-[#bcf715] text-[#141414] px-6 sm:px-8 lg:px-12 py-3 flex flex-wrap items-center justify-between gap-2 text-sm font-medium">
        <span>Ryški vieta. Matomas rezultatas.</span>
        <span className="text-[#141414]/70 hidden sm:inline">
          {screen.city} · PIKSEL reklamos tinklas
        </span>
      </div>

      {/* Description + specs – light section */}
      <section className="bg-[#f4f4f2] text-[#141414] px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10 lg:gap-14">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-[#bcf715] shrink-0" />
              <span className="text-xs font-semibold tracking-[0.2em] text-[#141414]/50 uppercase">
                Apie vietą
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Kodėl{' '}
              <span className="text-[#1329d4]">{screen.name}</span>?
            </h2>
            <p className="text-[#141414]/70 leading-relaxed text-base sm:text-lg mb-8">{description}</p>

            <div className="flex flex-wrap gap-3">
              <Link
                href={mapLink}
                className="inline-flex items-center gap-2 bg-[#1329d4] text-white font-bold text-xs tracking-[0.12em] uppercase px-5 py-3.5 hover:bg-[#0f20a8] transition-colors"
              >
                <Users className="w-4 h-4" />
                Rodyti žemėlapyje
              </Link>
              <Link
                href="/kontaktai"
                className="inline-flex items-center gap-2 border-2 border-[#141414] text-[#141414] font-bold text-xs tracking-[0.12em] uppercase px-5 py-3.5 hover:bg-[#141414] hover:text-white transition-colors"
              >
                Pateikti užklausą
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-[#1329d4] shrink-0" />
              <span className="text-xs font-semibold tracking-[0.2em] text-[#141414]/50 uppercase">
                Specifikacijos
              </span>
            </div>

            <div className="bg-white border border-[#141414]/10 divide-y divide-[#141414]/10">
              {specSections.map((section) => {
                const isOpen = openSpec === section.id;
                return (
                  <div key={section.id}>
                    <button
                      type="button"
                      onClick={() => setOpenSpec(isOpen ? null : section.id)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#f4f4f2]/80 transition-colors"
                    >
                      <span className="font-semibold text-sm">{section.title}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#141414]/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 border-l-4 border-[#1329d4] ml-5 mb-2">
                        <ul className="space-y-1.5">
                          {section.content.map((line) => (
                            <li key={line} className="text-sm text-[#141414]/70">
                              {line}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="px-6 sm:px-8 lg:px-12 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-[#1329d4]/10 border border-[#1329d4]/25 p-6 sm:p-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              Pasiruošę reklamai <span className="text-[#bcf715]">{screen.city}</span>?
            </h3>
            <p className="text-white/60 text-sm sm:text-base max-w-lg leading-relaxed">
              Atidarykite interaktyvų žemėlapį, pasirinkite datas ir suformuokite kampaniją su šiuo
              ekranu – arba susisiekite, padėsime suplanuoti.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href={mapLink}
              className="inline-flex items-center justify-center gap-2 bg-[#bcf715] text-[#141414] font-bold text-sm tracking-wide uppercase px-6 py-3.5 hover:bg-[#d4ff4d] transition-colors"
            >
              Atverti žemėlapį
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/kontaktai"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold text-sm tracking-wide uppercase px-6 py-3.5 hover:border-white/60 transition-colors"
            >
              Susisiekti
            </Link>
          </div>
        </div>
      </section>

      {/* Related screens */}
      {relatedScreens.length > 0 && (
        <section className="px-6 sm:px-8 lg:px-12 py-14 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-[#bcf715] shrink-0" />
                  <span className="text-xs font-semibold tracking-[0.2em] text-[#bcf715] uppercase">
                    {screen.city}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Kitos vietos{' '}
                  <span className="text-[#1329d4]">mieste</span>
                </h2>
              </div>
              <Link
                href={`/?city=${encodeURIComponent(screen.city)}`}
                className="text-xs font-bold tracking-[0.15em] uppercase text-white/60 hover:text-[#bcf715] transition-colors flex items-center gap-1"
              >
                Visi {screen.city} ekranai
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {relatedScreens.map((related) => (
                <Link
                  key={related.id}
                  href={getScreenPath(related)}
                  className="group text-left bg-white/5 border border-white/10 overflow-hidden hover:border-[#bcf715]/40 transition-colors"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={related.image_url}
                      alt={generateScreenImageAlt(related.name, related.city)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-[10px] font-semibold tracking-wider text-white/60 uppercase mb-0.5">
                        {related.district || related.address}
                      </div>
                      <div className="text-base font-bold">{related.name}</div>
                    </div>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between text-xs font-bold tracking-[0.12em] uppercase text-white/50 group-hover:text-[#bcf715] transition-colors">
                    Peržiūrėti
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="px-6 sm:px-8 lg:px-12 py-8 border-t border-white/10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-[#bcf715] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Grįžti į žemėlapį
        </Link>
      </div>
    </div>
  );
}
