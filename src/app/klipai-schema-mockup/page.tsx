'use client';

/**
 * Dizaino mockupas: kaip rodyti neįprastų ekranų (pvz. Akropolis) schemas.
 * Atidarykite: /klipai-schema-mockup (dev / peržiūrai; neįtraukta į meniu).
 */
import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, ChevronDown, ChevronUp, Info } from 'lucide-react';

const sampleNormal = { city: 'Vilnius', screen: 'Compensa', type: 'Video', resolution: '1152 x 576' };
const sampleSpecial = {
  city: 'Vilnius',
  screen: 'Akropolis',
  type: 'Statinis',
  resolution: '4032 x 576',
  note: 'Trys 1344×576 panelės (trikampė schema)',
};

function FakeDiagram({ compact }: { compact?: boolean }) {
  return (
    <div
      className={`rounded border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500 text-center px-2 ${
        compact ? 'h-14 text-xs' : 'h-40 text-sm'
      }`}
    >
      <div>
        <div className="font-medium text-gray-700">Schema (mock)</div>
        <div>4032 × 576 · 3 pusės</div>
      </div>
    </div>
  );
}

export default function KlipaiSchemaMockupPage() {
  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 pt-14 md:pt-8 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-10 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <strong>Mockupas</strong> — palyginkite variantus ir pasirinkite, ką diegti.{' '}
          <Link href="/klipai" className="text-[#1329d4] underline">
            Grįžti į tikrą puslapį
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Schemos rodymas: variantai</h1>
        <p className="text-gray-600 text-sm mb-10 max-w-2xl">
          Daugumai ekranų užtenka rezoliucijos. Neįprastiems (pvz. kelių panelių) verta parodyti diagramą —
          žemiau keli būdai, kaip tai galėtų atrodyti tame pačiame stiliuje kaip „Reikalavimai klipams“.
        </p>

        <div className="space-y-14">
          {/* A */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">A. Papildomas stulpelis „Schema“</h2>
            <p className="text-sm text-gray-600 mb-4">
              Nuoroda į pilno dydžio PNG/PDF. Lengviausia implementuoti, lentelė lieka aiški, mobilus horizontalus
              slinkimas prideda vieną stulpelį.
            </p>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[520px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 border-r border-gray-200">MIESTAS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 border-r border-gray-200">EKRANAS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 border-r border-gray-200">TIPAS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 border-r border-gray-200">REZOLIUCIJA</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">SCHEMA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm border-r border-gray-200">{sampleNormal.city}</td>
                    <td className="px-4 py-3 text-sm font-semibold border-r border-gray-200">{sampleNormal.screen}</td>
                    <td className="px-4 py-3 text-sm border-r border-gray-200">{sampleNormal.type}</td>
                    <td className="px-4 py-3 text-sm border-r border-gray-200">{sampleNormal.resolution}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">—</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm border-r border-gray-200">{sampleSpecial.city}</td>
                    <td className="px-4 py-3 text-sm font-semibold border-r border-gray-200">{sampleSpecial.screen}</td>
                    <td className="px-4 py-3 text-sm border-r border-gray-200">{sampleSpecial.type}</td>
                    <td className="px-4 py-3 text-sm border-r border-gray-200">{sampleSpecial.resolution}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center gap-1 text-[#1329d4] font-medium">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Atidaryti
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* B */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">B. Miniatiūra langelyje</h2>
            <p className="text-sm text-gray-600 mb-4">
              Peržiūra be paspaudimo; paspaudus — lightbox su didele schema. Geriau vizualiai, bet eilutė aukštesnė
              ir lentelė „sunkesnė“.
            </p>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 border-r border-gray-200">MIESTAS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 border-r border-gray-200">EKRANAS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 border-r border-gray-200">TIPAS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 border-r border-gray-200">REZOLIUCIJA</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">SCHEMA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm border-r border-gray-200 align-middle">{sampleNormal.city}</td>
                    <td className="px-4 py-3 text-sm font-semibold border-r border-gray-200 align-middle">{sampleNormal.screen}</td>
                    <td className="px-4 py-3 text-sm border-r border-gray-200 align-middle">{sampleNormal.type}</td>
                    <td className="px-4 py-3 text-sm border-r border-gray-200 align-middle">{sampleNormal.resolution}</td>
                    <td className="px-4 py-3 text-gray-400 align-middle">—</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm border-r border-gray-200 align-middle">{sampleSpecial.city}</td>
                    <td className="px-4 py-3 text-sm font-semibold border-r border-gray-200 align-middle">{sampleSpecial.screen}</td>
                    <td className="px-4 py-3 text-sm border-r border-gray-200 align-middle">{sampleSpecial.type}</td>
                    <td className="px-4 py-3 text-sm border-r border-gray-200 align-middle">{sampleSpecial.resolution}</td>
                    <td className="px-4 py-2 align-middle">
                      <button
                        type="button"
                        onClick={() => setLightbox(true)}
                        className="block w-28 rounded border border-gray-200 overflow-hidden hover:ring-2 hover:ring-[#1329d4] focus:outline-none focus:ring-2 focus:ring-[#1329d4]"
                      >
                        <FakeDiagram compact />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* C */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">C. Išskleidžiama eilutė</h2>
            <p className="text-sm text-gray-600 mb-4">
              Lentelė lieka kompaktiška; papildoma informacija tik ten, kur reikia. Reikia papildomos sąveikos
              (paspaudimas).
            </p>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 border-r border-gray-200 w-10" />
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 border-r border-gray-200">MIESTAS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 border-r border-gray-200">EKRANAS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 border-r border-gray-200">TIPAS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">REZOLIUCIJA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-2 py-3 border-r border-gray-200" />
                    <td className="px-4 py-3 text-sm border-r border-gray-200">{sampleNormal.city}</td>
                    <td className="px-4 py-3 text-sm font-semibold border-r border-gray-200">{sampleNormal.screen}</td>
                    <td className="px-4 py-3 text-sm border-r border-gray-200">{sampleNormal.type}</td>
                    <td className="px-4 py-3 text-sm">{sampleNormal.resolution}</td>
                  </tr>
                  <>
                    <tr className="hover:bg-gray-50 bg-gray-50/50">
                      <td className="px-2 py-3 border-r border-gray-200">
                        <button
                          type="button"
                          onClick={() => setExpanded((e) => !e)}
                          className="p-1 rounded text-gray-600 hover:bg-gray-200"
                          aria-expanded={expanded}
                        >
                          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm border-r border-gray-200">{sampleSpecial.city}</td>
                      <td className="px-4 py-3 text-sm font-semibold border-r border-gray-200">{sampleSpecial.screen}</td>
                      <td className="px-4 py-3 text-sm border-r border-gray-200">{sampleSpecial.type}</td>
                      <td className="px-4 py-3 text-sm">{sampleSpecial.resolution}</td>
                    </tr>
                    {expanded && (
                      <tr className="bg-gray-50">
                        <td colSpan={5} className="px-4 py-4 border-t border-gray-200">
                          <p className="text-sm text-gray-700 mb-3">{sampleSpecial.note}</p>
                          <FakeDiagram />
                        </td>
                      </tr>
                    )}
                  </>
                </tbody>
              </table>
            </div>
          </section>

          {/* D */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">D. Ženkliukas prie pavadinimo</h2>
            <p className="text-sm text-gray-600 mb-4">
              Papildomas stulpelis nereikalingas: ikona šalia ekrano vardo, hover arba paspaudimas atidaro tooltip /
              modalą su schema. Sunkiau pastebėti be paaiškinimo.
            </p>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[480px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 border-r border-gray-200">MIESTAS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 border-r border-gray-200">EKRANAS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 border-r border-gray-200">TIPAS</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">REZOLIUCIJA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm border-r border-gray-200">{sampleNormal.city}</td>
                    <td className="px-4 py-3 text-sm font-semibold border-r border-gray-200">{sampleNormal.screen}</td>
                    <td className="px-4 py-3 text-sm border-r border-gray-200">{sampleNormal.type}</td>
                    <td className="px-4 py-3 text-sm">{sampleNormal.resolution}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm border-r border-gray-200">{sampleSpecial.city}</td>
                    <td className="px-4 py-3 text-sm font-semibold border-r border-gray-200">
                      <span className="inline-flex items-center gap-2">
                        {sampleSpecial.screen}
                        <button
                          type="button"
                          title="Techninė schema"
                          onClick={() => setLightbox(true)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-[#1329d4] hover:bg-gray-100"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm border-r border-gray-200">{sampleSpecial.type}</td>
                    <td className="px-4 py-3 text-sm">{sampleSpecial.resolution}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
            <h3 className="font-semibold text-gray-900 mb-2">Rekomendacija (santrauka)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Jei schemų bus nedaug ir norite greičiausiai: <strong>A</strong> (stulpelis + nuoroda) arba jau pradėtas
                diegimas su URL lauku.
              </li>
              <li>Jei norite „matyti iš karto“: <strong>B</strong> (miniatiūra) arba <strong>C</strong> (išskleidimas).</li>
              <li>
                Jei norite laikyti lentelę 4 stulpelių: <strong>D</strong> arba <strong>C</strong>.
              </li>
            </ul>
          </section>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg max-w-lg w-full p-4 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-900">Akropolis — schema (mock)</span>
              <button
                type="button"
                onClick={() => setLightbox(false)}
                className="text-sm text-gray-600 hover:text-gray-900 px-2 py-1"
              >
                Uždaryti
              </button>
            </div>
            <FakeDiagram />
            <p className="text-xs text-gray-500 mt-3">Tikrame puslapyje čia būtų jūsų įkeltas PNG ar PDF peržiūra / nuoroda.</p>
          </div>
        </div>
      )}
    </div>
  );
}
