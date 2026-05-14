import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Play, Pyramid, Box, Orbit, Radio } from 'lucide-react';

const BASE = 'https://piksel.lt';

export const metadata: Metadata = {
  title: 'Apie mus | PIKSEL – LED reklamos tinklas Lietuvoje',
  description:
    'PIKSEL – didžiausias lauko LED ekranų reklamos tinklas Lietuvoje. Sužinokite apie mūsų tinklą, stiprybes ir patirtį reklamos lauke.',
  keywords: [
    'PIKSEL',
    'LED reklamos tinklas',
    'apie PIKSEL',
    'lauko reklama Lietuvoje',
    'LED ekranų tinklas',
    'reklama lauke',
  ],
  alternates: {
    canonical: `${BASE}/apie-mus`,
  },
  openGraph: {
    title: 'Apie mus | PIKSEL',
    description:
      'Didžiausias LED ekranų reklamos tinklas Lietuvoje – kas mes esame ir kuo galime padėti jūsų prekės ženklui.',
    url: `${BASE}/apie-mus`,
    siteName: 'PIKSEL',
    locale: 'lt_LT',
    type: 'website',
  },
};

function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -top-1/2 left-1/4 h-[120%] w-[60%] rounded-full bg-[#1329d4]/20 blur-[120px]" />
      <div className="absolute top-1/3 -right-1/4 h-[80%] w-[50%] rounded-full bg-[#bcf715]/10 blur-[100px]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.12]" viewBox="0 0 1200 400" fill="none">
        <path
          d="M0 320 Q300 200 600 280 T1200 240"
          stroke="currentColor"
          className="text-white"
          strokeWidth="1"
        />
        <path
          d="M0 200 Q400 80 800 160 T1200 120"
          stroke="currentColor"
          className="text-[#bcf715]"
          strokeWidth="0.75"
        />
        <path
          d="M0 380 Q500 260 1200 340"
          stroke="currentColor"
          className="text-[#1329d4]"
          strokeWidth="0.5"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

const stats = [
  { label: 'LED taškų', value: '50+' },
  { label: 'Miestų', value: '6+' },
  { label: 'Paros priežiūra', value: '24/7' },
  { label: 'Vienas tinklas', value: 'LT' },
];

const timeline = [
  { year: '2010', title: 'Pradžia ir vizija', desc: 'Fokusas į lauko reklamą ir technologijas.' },
  { year: '2015', title: 'Tinklo augimas', desc: 'Naujos vietos strateginiuose taškuose.' },
  { year: '2020', title: 'Skaitmenizacija', desc: 'LED kokybė, valdymas ir turinys vienoje sistemoje.' },
  { year: 'Šiandien', title: 'Lyderystė', desc: 'Didžiausias LED tinklas Lietuvoje – ir toliau plečiame.' },
];

const strengths = [
  {
    featured: true,
    tag: 'SPRENDIMAI',
    title: 'Vieningas tinklas – viena komanda nuo idėjos iki rodymo.',
    icon: Pyramid,
  },
  {
    featured: false,
    tag: 'PATIKIUMAS',
    title: 'Technika ir palaikymas – skaidri komunikacija kiekviename etape.',
    icon: Box,
  },
  {
    featured: false,
    tag: 'PAGALBA',
    title: 'Konsultacijos dėl vietų, formatų ir kampanijos optimizavimo.',
    icon: Orbit,
  },
  {
    featured: false,
    tag: 'APREPTIS',
    title: 'Nuo didžiųjų miestų iki regionų – matomumas ten, kur reikia.',
    icon: Radio,
  },
];

const team = [
  { n: '01', name: 'Komanda', role: 'Pardavimai ir projektai', highlight: false },
  { n: '02', name: 'Komanda', role: 'Turinys ir technika', highlight: true },
  { n: '03', name: 'Komanda', role: 'Klientų aptarnavimas', highlight: false },
  { n: '04', name: 'Komanda', role: 'Tinklo plėtra', highlight: false },
];

const partnerSlots = ['Jūsų prekės ženklas', 'Partneris', 'Partneris', 'Partneris', 'Partneris', 'Partneris'];

export default function ApieMus() {
  return (
    <div className="min-h-screen bg-[#050505] pt-14 md:pt-0 ml-0 md:ml-80 text-white antialiased">
      {/* Hero */}
      <section className="relative border-b border-white/10 overflow-hidden">
        <HeroBackdrop />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <nav className="text-xs text-white/50 mb-8 tracking-wide">
            <Link href="/" className="hover:text-[#bcf715] transition-colors">
              Pagrindinis
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/80">Apie mus</span>
          </nav>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4">
            Apie mus
          </h1>
          <p className="max-w-xl text-lg text-white/60 leading-relaxed">
            PIKSEL – LED reklamos tinklas Lietuvoje. Strateginės vietos, šiuolaikinė technika ir komanda, kuri
            jungia jūsų prekės ženklą su žmonėmis gatvėje.
          </p>
        </div>
      </section>

      {/* Kas mes – headline + images + copy + stats */}
      <section className="border-b border-white/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-5">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
                Jūsų žinutė.{' '}
                <span className="text-[#bcf715]">Mūsų tinklas.</span>
                <br />
                Matomumas, kuris{' '}
                <span className="text-[#bcf715]">dirba</span> už jus.
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="col-span-2 row-span-2 relative min-h-[220px] sm:min-h-[280px] rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                  <Image
                    src="/sliede-1.jpeg"
                    alt="PIKSEL LED ekranas"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
                <div className="relative min-h-[106px] sm:min-h-[134px] rounded-2xl overflow-hidden border border-white/10">
                  <Image
                    src="/sliede-2.jpeg"
                    alt="Lauko reklama"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="relative min-h-[106px] sm:min-h-[134px] rounded-2xl overflow-hidden border border-white/10">
                  <Image
                    src="/sliede-3.jpeg"
                    alt="LED tinklas"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </div>
              <p className="text-white/65 leading-relaxed text-base md:text-lg max-w-2xl">
                Jungiame strategiškai parinktas vietas visoje šalyje. Planuokite kampanijas keliuose miestuose,
                derinkite biudžetą ir turinį – mes koordinuojame techniką, rodymą ir kokybę taip, kad jūsų
                kampanija būtų nuosekli nuo pirmo kadro iki paskutinės dienos.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-white/10">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl md:text-3xl font-bold text-white tabular-nums">{s.value}</div>
                    <div className="text-xs uppercase tracking-wider text-white/45 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/klipai"
                  className="inline-flex items-center gap-2 rounded-full bg-white text-[#050505] px-5 py-2.5 text-sm font-semibold hover:bg-[#bcf715] transition-colors"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Peržiūrėti klipus
                </Link>
                <div className="flex -space-x-2">
                  {['RP', 'KT', 'VD'].map((initials) => (
                    <div
                      key={initials}
                      className="h-9 w-9 rounded-full border-2 border-[#050505] bg-gradient-to-br from-[#1329d4] to-[#0a1a6e] text-[10px] font-bold flex items-center justify-center text-white"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-white/40">Komanda, kurią susitiksite projekte</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mūsų istorija + timeline */}
      <section id="istorija" className="border-b border-white/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-6">
                Kelias į <span className="text-[#bcf715]">matomą</span> lyderystę
              </h2>
              <p className="text-white/65 leading-relaxed mb-6">
                Užaugome iš poreikio daryti lauko reklamą profesionaliai ir mastelyje – su aiškia struktūra ir
                atsakomybe už rezultatą. Investavome į technologijas, vietų parinkimą ir žmones, kurie supranta
                ir kūrybą, ir techninę pusę.
              </p>
              <Link
                href="/kontaktai"
                className="inline-flex items-center gap-2 rounded-full bg-[#1329d4] text-white px-6 py-3 text-sm font-semibold hover:bg-[#0f20a8] transition-colors"
              >
                Daugiau apie bendradarbiavimą
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative min-h-[240px] sm:min-h-[320px] rounded-2xl overflow-hidden border border-white/10 grayscale contrast-[1.05]">
              <Image
                src="/sliede-2.jpeg"
                alt="PIKSEL komanda ir projektai"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#050505]/90 via-transparent to-transparent" />
            </div>
          </div>
          <div className="mt-16 md:mt-20 overflow-x-auto pb-2">
            <div className="flex min-w-[640px] md:min-w-0 md:grid md:grid-cols-4 gap-8 md:gap-4 relative">
              <div
                className="absolute top-[11px] left-0 right-0 h-px bg-white/10 hidden md:block"
                style={{ marginLeft: '12px', marginRight: '12px' }}
              />
              {timeline.map((item, i) => (
                <div key={item.year} className="relative flex md:block gap-4 md:gap-0">
                  <div className="flex md:flex-col items-center md:items-start">
                    <div className="h-3 w-3 rounded-full bg-[#bcf715] ring-4 ring-[#050505] shrink-0 z-10" />
                    <div className="md:mt-4 md:pl-0 pl-4 md:border-0 border-l border-white/10 md:ml-0 -ml-[5px] pl-6 md:pl-0 md:pt-0 pt-0">
                      <div className="text-[#bcf715] font-bold text-sm tabular-nums">{item.year}</div>
                      <div className="font-semibold text-white mt-1">{item.title}</div>
                      <p className="text-sm text-white/50 mt-2 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="hidden md:block absolute top-[10px] left-[calc(25%*var(--i))]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stiprybės – kapsulės */}
      <section className="border-b border-white/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 max-w-3xl mx-auto">
            Skaitmeninė strategija <span className="text-[#bcf715]">gatvėje</span>
          </h2>
          <p className="text-center text-white/50 max-w-2xl mx-auto mb-14 text-sm md:text-base">
            Keturi principai, kuriais vadovaujamės kurdami vertę jūsų prekės ženklui ir žiūrovams.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {strengths.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.tag}
                  className={`rounded-[2rem] p-6 md:p-8 min-h-[220px] flex flex-col justify-between border transition-colors ${
                    card.featured
                      ? 'bg-[#1329d4] border-[#1329d4] text-white shadow-lg shadow-[#1329d4]/25'
                      : 'bg-white/[0.03] border-white/10 hover:border-[#bcf715]/30'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                      card.featured ? 'bg-white/15 text-[#bcf715]' : 'bg-white/5 text-[#bcf715]'
                    }`}
                  >
                    <Icon className="w-7 h-7" strokeWidth={1.25} />
                  </div>
                  <div>
                    <p
                      className={`text-[10px] font-bold tracking-[0.2em] mb-3 ${
                        card.featured ? 'text-white/70' : 'text-white/40'
                      }`}
                    >
                      {card.tag}
                    </p>
                    <p
                      className={`text-sm md:text-base leading-snug font-medium ${
                        card.featured ? 'text-white' : 'text-white/85'
                      }`}
                    >
                      {card.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Logotipų siena */}
      <section className="border-b border-white/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Prekės ženklai, kurie renkasi <span className="text-[#bcf715]">matomumą</span>
          </h2>
          <p className="text-center text-white/45 text-sm mb-12 max-w-xl mx-auto">
            Čia galite įkelti partnerių logotipus. Dabar – neutralūs langeliai dizainui peržiūrėti.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {partnerSlots.map((label, i) => (
              <div
                key={i}
                className="aspect-[5/3] rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center px-3 text-center"
              >
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/25 font-medium">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Komanda */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-6">
                Idėjos, kurios <span className="text-[#bcf715]">veikia</span> realybėje
              </h2>
              <p className="text-white/65 leading-relaxed mb-8">
                Komanda sujungia pardavimus, turinį ir techninę priežiūrą – kad kampanija nuo sutarties iki
                paskutinės dienos būtų sklandi. Tikrus vardus ir nuotraukas galite įrašyti vėliau.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/kontaktai"
                  className="rounded-full bg-[#bcf715] text-[#050505] px-6 py-3 text-sm font-bold hover:bg-[#d4ff3a] transition-colors"
                >
                  Susisiekti
                </Link>
                <Link
                  href="/kontaktai"
                  className="rounded-full border border-white/30 text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  Karjera
                </Link>
              </div>
              <ul className="mt-12 space-y-4">
                {team.map((m) => (
                  <li
                    key={m.n}
                    className={`flex items-baseline gap-4 border-b border-white/10 pb-4 ${
                      m.highlight ? 'text-[#bcf715]' : 'text-white/80'
                    }`}
                  >
                    <span className="text-xs font-mono text-white/35 w-8">{m.n}</span>
                    <div>
                      <span className="font-semibold">{m.name}</span>
                      <span className="text-white/45"> — {m.role}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <figure className="relative mx-auto w-full max-w-lg">
              <div
                className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-[#bcf715]/25 to-[#1329d4]/30 blur-2xl opacity-70"
                aria-hidden
              />
              <div className="relative rounded-2xl border border-white/15 bg-white/[0.04] p-6 sm:p-8 shadow-2xl ring-1 ring-white/10">
                <div className="relative mx-auto aspect-[3/4] w-full max-h-[min(520px,65vh)] sm:max-h-[560px]">
                  <Image
                    src="/Ekranas-ant-kojos-standartinis.png"
                    alt="Standartinis LED ekranas ant kojų – vizualizacija"
                    fill
                    className="object-contain object-center drop-shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
                    sizes="(max-width: 1024px) 100vw, 512px"
                  />
                </div>
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 bg-[#0a0a0a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/50 text-sm mb-2">VIDEOARCHITEKTAI, UAB · Vilnius</p>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">Pasiruošę rodyti jūsų kampaniją?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kontaktai"
              className="rounded-full bg-[#1329d4] text-white px-8 py-3.5 font-semibold hover:bg-[#0f20a8] transition-colors"
            >
              Gauti pasiūlymą
            </Link>
            <a
              href="tel:+37069066633"
              className="rounded-full border border-white/25 text-white px-8 py-3.5 font-semibold hover:bg-white/10 transition-colors"
            >
              +370 690 666 33
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
