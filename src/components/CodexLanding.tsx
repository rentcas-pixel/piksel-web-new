'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowUpRight,
  Grid3x3,
  Hash,
  Play,
} from 'lucide-react';
import { LEDScreen } from '@/lib/supabase';
import { generateScreenImageAlt } from '@/lib/seoImageUtils';
import { getScreenPath } from '@/lib/screenUtils';

const FEATURED_SLUGS = ['compensa', 'panorama', 'laisves-kelias', 'narbuto-ziedas', 'senukai'];

const VIADUKAI_STOPS = [
  'Konstitucijos pr.',
  'Narbuto g.',
  'Ozo g.',
  'Ukmergės g.',
  'Savanorių pr.',
  'Geležinio vilko g.',
  'Kalvarijų g.',
  'S. Konarskio g.',
];

const CAMPAIGN_TABS = [
  {
    id: 'zinomumas',
    label: 'Žinomumas',
    title: 'Miesto pasiekiamumo planas',
    desc: 'Kai reikia, kad prekės ženklas būtų matomas kuo plačiau – parenkame ekranus su didžiausiu srautu ir optimalia aprėptimi.',
    stats: [
      { label: 'Tinklas', value: '6–12 ekranų' },
      { label: 'Trukmė', value: '2–4 sav.' },
      { label: 'Klipai', value: '1–2 klipai' },
    ],
  },
  {
    id: 'startas',
    label: 'Produkto startas',
    title: 'Koncentruotas starto impulsas',
    desc: 'Naujam produktui ar akcijai – ryškios vietos strateginiuose taškuose, kad žinutė pasiektų tikslinę auditoriją greitai.',
    stats: [
      { label: 'Tinklas', value: '4–8 ekranų' },
      { label: 'Trukmė', value: '1–3 sav.' },
      { label: 'Klipai', value: '1 klipas' },
    ],
  },
  {
    id: 'always',
    label: 'Always On',
    title: 'Nuolatinis matomumas',
    desc: 'Ilgalaikė kampanija su stabiliu dažniu – prekės ženklas lieka matomas ten, kur jūsų auditorija juda kasdien.',
    stats: [
      { label: 'Tinklas', value: '8–16 ekranų' },
      { label: 'Trukmė', value: '3+ mėn.' },
      { label: 'Klipai', value: '2–4 klipai' },
    ],
  },
] as const;

function pickFeatured(screens: LEDScreen[]): LEDScreen[] {
  const active = screens.filter((s) => s.is_active);
  const picked: LEDScreen[] = [];
  const seen = new Set<string>();

  for (const slug of FEATURED_SLUGS) {
    const match = active.find(
      (s) =>
        !seen.has(s.id) &&
        (s.slug?.toLowerCase().includes(slug) ||
          s.name.toLowerCase().includes(slug.replace('-', ' ')))
    );
    if (match) {
      picked.push(match);
      seen.add(match.id);
    }
    if (picked.length >= 3) return picked;
  }

  for (const s of active) {
    if (seen.has(s.id)) continue;
    picked.push(s);
    seen.add(s.id);
    if (picked.length >= 3) break;
  }
  return picked;
}

function cityBreakdown(screens: LEDScreen[]): [string, number][] {
  const counts: Record<string, number> = {};
  screens.filter((s) => s.is_active).forEach((s) => {
    counts[s.city] = (counts[s.city] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
}

interface CodexLandingProps {
  screenCount: number;
  cityCount: number;
  ledScreens: LEDScreen[];
  loading?: boolean;
  onScrollToMap: () => void;
}

export default function CodexLanding({
  screenCount,
  cityCount,
  ledScreens,
  loading,
  onScrollToMap,
}: CodexLandingProps) {
  const [activeTab, setActiveTab] = useState<(typeof CAMPAIGN_TABS)[number]['id']>('zinomumas');
  const [viadukStep, setViadukStep] = useState(0);
  const featured = pickFeatured(ledScreens);
  const cities = cityBreakdown(ledScreens);
  const tab = CAMPAIGN_TABS.find((t) => t.id === activeTab) ?? CAMPAIGN_TABS[0];

  const heroStats = [
    { value: loading ? '…' : String(screenCount), label: 'Ekranų skaičius' },
    { value: loading ? '…' : String(cityCount), label: 'Didieji miestai' },
    { value: '06–23', label: 'Darbo laikas' },
    { value: '1', label: 'Interaktyvus žemėlapis' },
  ];

  return (
    <div className="bg-[#141414] text-white">
      {/* ── HERO ── */}
      <section className="relative min-h-[88vh] flex flex-col justify-end overflow-hidden">
        <Image
          src="/sliede-1.jpeg"
          alt="PIKSEL LED ekranas Vilniuje"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-[#141414]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/70 via-transparent to-transparent" />

        <div className="relative z-10 max-w-[1600px] mx-auto w-full px-6 lg:px-10 pb-12 pt-32">
          <div className="flex items-center gap-2 mb-8">
            <span className="w-2 h-2 bg-[#bcf715]" />
            <span className="text-xs font-semibold tracking-[0.22em] text-[#bcf715] uppercase">
              Ryškių ekranų tinklas
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.02] tracking-tight max-w-4xl mb-6">
            Vilnius juda.
            <br />
            <span className="text-[#bcf715]">Jūsų ženklas – kartu.</span>
          </h1>

          <p className="text-lg text-white/60 max-w-xl leading-relaxed mb-10">
            {loading ? 'Kraunama…' : `${screenCount} ekranų`} tinklas didžiuosiuose Lietuvos
            miestuose. Pasirinkite vietas, datas ir gaukite konkretų kampanijos planą.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={onScrollToMap}
              className="inline-flex items-center gap-2 bg-[#bcf715] text-[#141414] font-bold text-sm tracking-[0.1em] uppercase px-8 py-4 hover:bg-[#d4ff4d] transition-colors"
            >
              Žiūrėti ekranus
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onScrollToMap}
              className="inline-flex items-center gap-2 border border-white/25 text-white font-semibold text-sm tracking-[0.1em] uppercase px-8 py-4 hover:bg-white/5 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              Tikrinti tinklą
            </button>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 bg-[#141414]/95 backdrop-blur-sm">
          <div className="max-w-[1600px] mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {heroStats.map((s) => (
              <div key={s.label} className="px-8 lg:px-10 py-6">
                <div className="text-3xl lg:text-4xl font-extrabold tracking-tight">{s.value}</div>
                <div className="text-[10px] font-semibold tracking-[0.18em] text-white/40 uppercase mt-1.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="bg-[#bcf715] text-[#141414]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-3.5 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold">
          <span>Ne dideli ekranai – didelės vietos.</span>
          <span className="text-[#141414]/65 font-medium hidden md:inline">
            Pasirinkite tinkamą vietą ir laiką – mes padėsime suplanuoti kampaniją.
          </span>
        </div>
      </div>

      {/* ── STIPRIOS VIETOS (light) ── */}
      <section className="bg-[#f0f0ee] text-[#141414] py-16 lg:py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-12">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-[#bcf715]" />
                <span className="text-xs font-semibold tracking-[0.2em] text-[#141414]/45 uppercase">
                  Ekranai kampanijos planui
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">
                Stiprios vietos.
                <br />
                <span className="text-[#1329d4]">Viename plane.</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-[#141414]/60 leading-relaxed">
                Pasirinkite lokacijas pagal miestą, srautą ir formatą. Vienas aiškus planas – nuo
                vieno ekrano iki viso tinklo.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-1">
            {featured.map((screen) => (
              <Link
                key={screen.id}
                href={getScreenPath(screen)}
                className="group relative aspect-[4/3] overflow-hidden bg-[#141414]"
              >
                <Image
                  src={screen.image_url}
                  alt={generateScreenImageAlt(screen.name, screen.city)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/70 bg-black/40 px-2 py-1 backdrop-blur-sm">
                    {screen.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 56 EKRANAI + DASHBOARD (light) ── */}
      <section className="bg-[#f0f0ee] text-[#141414] pb-16 lg:pb-24 border-t border-[#141414]/8">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-12">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-[#bcf715]" />
                <span className="text-xs font-semibold tracking-[0.2em] text-[#141414]/45 uppercase">
                  Interaktyvus ekranų katalogas
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
                {loading ? '…' : screenCount} ekranai.{' '}
                <span className="text-[#1329d4]">Vienas aiškus planas.</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-[#141414]/60 leading-relaxed">
                Peržiūrėkite miestus, formatus ir vietas – galutinį planą sudarysime pagal jūsų
                auditoriją ir kampanijos tikslą.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-1">
            {/* Left card */}
            <div className="bg-white p-10 lg:p-14 flex flex-col justify-between min-h-[320px]">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-[#bcf715]" />
                  <span className="text-xs font-semibold tracking-[0.2em] text-[#141414]/45 uppercase">
                    Gyvas tinklas
                  </span>
                </div>
                <h3 className="text-3xl font-extrabold tracking-tight mb-4 leading-tight">
                  Matykite visą tinklą.
                  <br />
                  Pasirinkite tiksliai.
                </h3>
                <p className="text-[#141414]/55 leading-relaxed max-w-sm">
                  Atidarykite interaktyvų žemėlapį, filtruokite pagal miestą ir datas – viskas
                  realiu laiku.
                </p>
              </div>
              <button
                type="button"
                onClick={onScrollToMap}
                className="mt-8 self-start inline-flex items-center gap-2 bg-[#141414] text-white font-bold text-xs tracking-[0.12em] uppercase px-6 py-3.5 hover:bg-[#1329d4] transition-colors"
              >
                Atverti {loading ? '…' : screenCount} ekranų žemėlapį
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Dark dashboard */}
            <div className="bg-[#141414] text-white p-10 lg:p-14 flex gap-8 min-h-[320px] relative overflow-hidden">
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[#bcf715]/20 blur-[60px]" />
              <div className="absolute right-10 top-0 w-32 h-32 rounded-full bg-[#1329d4]/30 blur-[50px]" />

              <div className="relative z-10 flex flex-col justify-center shrink-0">
                <div className="text-6xl lg:text-7xl font-extrabold tracking-tight">
                  {loading ? '…' : screenCount}
                </div>
                <div className="text-xs font-semibold tracking-[0.18em] text-white/40 uppercase mt-1">
                  Ekranai
                </div>
              </div>

              <div className="relative z-10 flex-1 grid grid-cols-2 gap-x-6 gap-y-4 content-center">
                {cities.map(([city, count]) => (
                  <div key={city} className="border-b border-white/10 pb-3">
                    <div className="text-2xl font-extrabold">{count}</div>
                    <div className="text-xs text-white/45 mt-0.5">{city}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VIADUKAI MARŠRUTAS (dark) ── */}
      <section className="bg-[#f0f0ee] text-[#141414] py-16 lg:py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-6 mb-8">
            <div className="lg:col-span-4">
              <span className="text-xs font-semibold tracking-[0.2em] text-[#141414]/40 uppercase">
                Piksel flagmanas
              </span>
            </div>
            <div className="lg:col-span-8">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
                Aštuoni viadukai.{' '}
                <span className="text-[#1329d4]">Vienas miesto maršrutas.</span>
              </h2>
            </div>
          </div>

          <div className="bg-[#0a1628] relative overflow-hidden min-h-[360px] lg:min-h-[420px]">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <span className="text-[12vw] font-extrabold text-white/[0.04] tracking-tight uppercase">
                Vilnius
              </span>
            </div>

            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 800 200"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                d="M 40 120 Q 200 60 320 100 T 560 80 T 760 110"
                fill="none"
                stroke="#bcf715"
                strokeWidth="2"
                strokeDasharray="8 6"
                opacity="0.7"
              />
              {[80, 200, 320, 440, 560, 680, 760].map((x, i) => (
                <circle key={i} cx={x} cy={i % 2 === 0 ? 120 : 90} r="5" fill="#bcf715" opacity="0.9" />
              ))}
            </svg>

            <div className="absolute bottom-0 left-0 right-0 bg-[#141414] px-6 lg:px-10 py-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <span className="text-sm font-bold text-[#bcf715]">
                  {String(viadukStep + 1).padStart(2, '0')}/08
                </span>
                <span className="text-white font-semibold">{VIADUKAI_STOPS[viadukStep]}</span>
              </div>
              <p className="text-white/50 text-sm max-w-md hidden md:block">
                Vilniaus centre – aštuoni strateginiai viadukai, vienas nuoseklus maršrutas jūsų
                kampanijai.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setViadukStep((s) => Math.max(0, s - 1))}
                  className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
                  aria-label="Ankstesnis"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => setViadukStep((s) => Math.min(7, s + 1))}
                  className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
                  aria-label="Kitas"
                >
                  →
                </button>
                <Link
                  href="/viadukai"
                  className="inline-flex items-center gap-2 border border-[#bcf715] text-[#bcf715] font-bold text-xs tracking-[0.1em] uppercase px-5 h-10 hover:bg-[#bcf715] hover:text-[#141414] transition-colors"
                >
                  Maršrutas
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TINKLAS PAGAL TIKSLĄ (dark split) ── */}
      <section className="bg-[#141414] text-white py-16 lg:py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-1">
            <div className="relative min-h-[280px] overflow-hidden flex items-end p-10">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1329d4] via-[#1329d4]/60 to-[#bcf715]/40" />
              <div className="absolute inset-0 blur-3xl opacity-60 bg-gradient-to-br from-[#1329d4] to-[#bcf715]" />
              <div className="relative z-10">
                <p className="text-2xl font-extrabold">Miesto + regionų</p>
                <p className="text-white/60 text-sm mt-1">Vienas planas visai Lietuvai</p>
              </div>
            </div>
            <div className="p-10 lg:p-14 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-[#bcf715]" />
                <span className="text-xs font-semibold tracking-[0.2em] text-[#bcf715] uppercase">
                  Tinklas pagal kampanijos tikslą
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
                Skirtingi ekranai.
                <br />
                <span className="text-[#bcf715]">Viena kampanijos logika.</span>
              </h2>
              <p className="text-white/55 leading-relaxed mb-8 max-w-md">
                Deriname ekranus pagal jūsų tikslą – žinomumui, startui ar ilgalaikei aprėpties
                strategijai.
              </p>
              <ul className="space-y-3">
                {[
                  'Realus laikotarpio planavimas',
                  'Miesto ir regionų kombinacija',
                  'Dažnis, aprėptis ir užtikrintas rodymas',
                ].map((item, i) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/70">
                    <span className="w-6 h-6 rounded-full bg-[#1329d4]/30 text-[#1329d4] text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── KAMPANIJŲ LOGIKA (light) ── */}
      <section className="bg-[#f0f0ee] text-[#141414] py-16 lg:py-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-[#bcf715]" />
            <span className="text-xs font-semibold tracking-[0.2em] text-[#141414]/45 uppercase">
              Kampanijų logika
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-10 leading-[1.05]">
            Ne vienas ekranas.{' '}
            <span className="text-[#1329d4]">Veikianti kombinacija.</span>
          </h2>

          <div className="flex gap-0 border-b border-[#141414]/10 overflow-x-auto">
            {CAMPAIGN_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-6 py-4 text-sm font-bold tracking-wide uppercase whitespace-nowrap border-b-2 -mb-px transition-colors ${
                  activeTab === t.id
                    ? 'border-[#1329d4] text-[#1329d4]'
                    : 'border-transparent text-[#141414]/35 hover:text-[#141414]/60'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="bg-white p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="flex-1">
              <h3 className="text-xl font-extrabold mb-2">{tab.title}</h3>
              <p className="text-[#141414]/60 leading-relaxed">{tab.desc}</p>
            </div>
            <div className="flex gap-8 lg:gap-12">
              {tab.stats.map((s) => (
                <div key={s.label}>
                  <div className="text-[10px] font-bold tracking-[0.15em] text-[#141414]/35 uppercase mb-1">
                    {s.label}
                  </div>
                  <div className="text-lg font-extrabold">{s.value}</div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={onScrollToMap}
              className="shrink-0 inline-flex items-center gap-2 bg-[#141414] text-white font-bold text-xs tracking-[0.12em] uppercase px-6 py-3.5 hover:bg-[#1329d4] transition-colors"
            >
              Gauti konkretų planą
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ── EKOSISTEMA + LEAD FORM ── */}
      <section className="bg-[#141414] text-white">
        <div className="max-w-[1600px] mx-auto grid lg:grid-cols-3 gap-1">
          <div className="bg-[#141414] p-10 lg:p-12 flex flex-col justify-between min-h-[280px] border-r border-white/5">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 bg-[#bcf715]" />
              <span className="text-xs font-semibold tracking-[0.2em] text-[#bcf715] uppercase">
                Piksel ekosistema
              </span>
            </div>
            <h3 className="text-3xl font-extrabold leading-tight">
              Medija ir technologija.{' '}
              <span className="text-[#bcf715]">Vienose rankose.</span>
            </h3>
            <p className="text-white/50 text-sm mt-4 leading-relaxed">
              Neparduodame tik reklamos laiko – projektuojame, montuojame ir prižiūrime LED
              ekranus.
            </p>
          </div>

          <div className="bg-[#1329d4] p-10 lg:p-12 flex flex-col justify-between min-h-[280px]">
            <Grid3x3 className="w-8 h-8 text-white/60 mb-6" />
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] text-white/60 uppercase">
                Piksel Media
              </span>
              <h3 className="text-2xl font-extrabold mt-2 mb-4">Reklama ekranuose</h3>
              <ul className="text-sm text-white/70 space-y-1.5 mb-6">
                <li>• {loading ? '…' : screenCount} ekranų miestuose</li>
                <li>• Planavimas pagal segmentą</li>
                <li>• Ilgalaikė prenumerata</li>
              </ul>
              <button
                type="button"
                onClick={onScrollToMap}
                className="inline-flex items-center gap-2 text-sm font-bold tracking-wide uppercase hover:text-[#bcf715] transition-colors"
              >
                Planuoti kampaniją
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-[#bcf715] text-[#141414] p-10 lg:p-12 flex flex-col justify-between min-h-[280px]">
            <Hash className="w-8 h-8 text-[#141414]/40 mb-6" />
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] text-[#141414]/50 uppercase">
                Piksel LED Solutions
              </span>
              <h3 className="text-2xl font-extrabold mt-2 mb-4">Profesionalūs LED projektai</h3>
              <ul className="text-sm text-[#141414]/70 space-y-1.5 mb-6">
                <li>• Dvipusiai ekranų sprendimai</li>
                <li>• Projektavimas ir montavimas</li>
                <li>• Garantinis aptarnavimas</li>
              </ul>
              <Link
                href="/paslaugos"
                className="inline-flex items-center gap-2 text-sm font-bold tracking-wide uppercase hover:opacity-70 transition-opacity"
              >
                Atrasti LED sprendimus
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Lead form row */}
        <div className="max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-1 border-t border-white/10">
          <div className="relative min-h-[320px] overflow-hidden flex items-end p-10 lg:p-14">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1329d4]/40 to-[#bcf715]/20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#bcf715]/30 blur-[80px]" />
            <div className="relative z-10">
              <span className="text-xs font-semibold tracking-[0.2em] text-[#bcf715] uppercase">
                Pradėkime nuo jūsų tikslo
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold mt-3 leading-tight">
                Kada norite būti matomi?
              </h3>
              <p className="text-white/55 mt-3 max-w-sm text-sm leading-relaxed">
                Papasakokite apie kampaniją – paruošime konkretų pasiūlymą.
              </p>
            </div>
          </div>

          <div className="bg-white text-[#141414] p-10 lg:p-14">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onScrollToMap();
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#141414]/40">
                  Vardas, pavardė
                </label>
                <input
                  type="text"
                  className="w-full border-b border-[#141414]/20 py-2 mt-1 text-sm focus:outline-none focus:border-[#1329d4] bg-transparent"
                  placeholder="Jūsų vardas"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#141414]/40">
                  El. paštas
                </label>
                <input
                  type="email"
                  className="w-full border-b border-[#141414]/20 py-2 mt-1 text-sm focus:outline-none focus:border-[#1329d4] bg-transparent"
                  placeholder="el@paštas.lt"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#141414]/40">
                  Kampanijos tikslas
                </label>
                <select className="w-full border-b border-[#141414]/20 py-2 mt-1 text-sm focus:outline-none focus:border-[#1329d4] bg-transparent">
                  <option>Didinti žinomumą</option>
                  <option>Produkto startas</option>
                  <option>Always On</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full mt-4 inline-flex items-center justify-center gap-2 bg-[#bcf715] text-[#141414] font-bold text-sm tracking-[0.1em] uppercase py-4 hover:bg-[#d4ff4d] transition-colors"
              >
                Gauti pasiūlymą
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── TRANSITION TO MAP ── */}
      <div className="bg-[#141414] border-t border-white/10 py-8 text-center">
        <button
          type="button"
          onClick={onScrollToMap}
          className="inline-flex flex-col items-center gap-2 text-white/40 hover:text-[#bcf715] transition-colors group"
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase">Interaktyvus žemėlapis</span>
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>
    </div>
  );
}
