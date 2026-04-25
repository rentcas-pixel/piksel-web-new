import type { Metadata } from 'next';
import Image from 'next/image';

const BASE = 'https://piksel.lt';

export const metadata: Metadata = {
  title: 'Ieškome plotų | PIKSEL',
  description:
    'Ieškome naujų plotų LED ekranams. Jeigu turite tinkamą sieną, fasadą ar kitą matomą vietą, susisiekite su PIKSEL komanda.',
  alternates: {
    canonical: `${BASE}/ieskome-plotu`,
  },
  openGraph: {
    title: 'Ieškome plotų | PIKSEL',
    description:
      'Turite matomą vietą reklamai? Susisiekite su PIKSEL - ieškome naujų plotų LED ekranams visoje Lietuvoje.',
    url: `${BASE}/ieskome-plotu`,
    siteName: 'PIKSEL',
    locale: 'lt_LT',
    type: 'website',
    images: [
      {
        url: `${BASE}/sliede-1.jpeg`,
        width: 1200,
        height: 630,
        alt: 'PIKSEL LED ekranas mieste',
      },
    ],
  },
};

export default function IeskomePlotuPage() {
  return (
    <div className="min-h-screen bg-white pt-14 md:pt-0 ml-0 md:ml-80 pb-8">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2.5 py-0.5 text-xs font-semibold text-white bg-[#141414] rounded">Ieškome plotų</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-5">Kiek uždirba jūsų pastatas ar sklypas?</h1>
        <div className="aspect-video relative rounded-xl overflow-hidden bg-gray-100 mb-8">
          <Image
            src="/ieskome-plotu.jpg"
            alt="Vieta LED ekranui mieste"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 768px"
          />
        </div>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4 font-semibold">Jei atsakymas "nieko" - mes galime tai pakeisti.</p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Ieškome strategiškai matomų vietų LED ekranams Vilniuje ir kituose miestuose. Įrengiame ekraną,
            pasirūpiname visais leidimais ir techniniais sprendimais.
          </p>
          <ul className="text-gray-600 leading-relaxed mb-8 list-disc pl-5 space-y-2">
            <li>Jums nereikia investuoti - tik pasiūlyti vietą.</li>
            <li>Jūs gaunate papildomas, nuolatines pajamas.</li>
            <li>Dirbame su aukščiausio lygio LED sprendimais ir realiais reklamos klientais.</li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <a
            href="mailto:info@piksel.lt?subject=U%C5%BEklausa%20d%C4%97l%20vietos%20LED%20ekranui"
            className="inline-flex items-center justify-center rounded-lg bg-[#1329d4] hover:bg-[#0f20a8] text-white px-6 py-3 text-sm font-semibold transition-colors"
          >
            Sužinokite kiek galite uždirbti
          </a>
        </div>
        <p className="text-gray-600 leading-relaxed mb-8">Atsakome greitai. Vietą įvertiname per 1-2 dienas.</p>

      </article>
    </div>
  );
}
