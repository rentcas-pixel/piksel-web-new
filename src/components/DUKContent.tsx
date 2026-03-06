'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function DUKContent() {
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default

  const faqData = [
    {
      question: "Ar galiu reklamuotis tik viename viaduke?",
      answer: "Taip, galite pasirinkti tik vieną viaduką arba kombinaciją iš kelių viadukų, priklausomai nuo jūsų kampanijos tikslų ir biudžeto."
    },
    {
      question: "Kokie yra minimalūs kampanijos laikotarpiai?",
      answer: "Minimalus kampanijos laikotarpis yra 1 diena. Rekomenduojame bent 3-7 dienų kampanijas, kad pasiektumėte geriausius rezultatus."
    },
    {
      question: "Ar galiu keisti reklamos turinį kampanijos metu?",
      answer: "Taip, galite keisti reklamos turinį kampanijos metu. Paprastai reikia 24 valandų iš anksto pranešti apie turinio keitimus."
    },
    {
      question: "Kokie yra mokėjimo terminai?",
      answer: "Mokėjimas atliekamas iš anksto kampanijos pradžiai. Priimame banko pavedimus ir kitus mokėjimo būdus."
    },
    {
      question: "Ar pateikiate reklamos turinio kūrimo paslaugas?",
      answer: "Taip, mes galime padėti sukurti profesionalų reklamos turinį, kuris atitiks jūsų viaduko specifikacijas ir tikslus."
    },
    {
      question: "Kokie yra techniniai reikalavimai reklamos turiniui?",
      answer: "Reklamos turinys turi atitikti mūsų nurodytus techninius reikalavimus: tikslų dydį, skiriamąją gebą ir formatą. Detalūs reikalavimai pateikiami pasirašius sutartį."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">DUK - Dažniausiai užduodami klausimai</h1>
        <p className="text-gray-600">
          Čia rasite atsakymus į dažniausiai užduodamus klausimus apie LED reklamos ekranus.
        </p>
      </div>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-bold text-gray-900 pr-4">
                {item.question}
              </h3>
              {openItems.includes(index) ? (
                <Minus size={20} className="text-gray-500 flex-shrink-0" />
              ) : (
                <Plus size={20} className="text-gray-500 flex-shrink-0" />
              )}
            </button>
            
            {openItems.includes(index) && (
              <div className="px-6 pb-4 border-t border-gray-100">
                <p className="text-gray-600 leading-relaxed pt-4">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Neradote atsakymo?</h3>
        <p className="text-gray-600 mb-4">
          Susisiekite su mumis ir mes atsakysime į jūsų klausimus.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a 
            href="tel:+37012345678" 
            className="inline-flex items-center justify-center px-4 py-2 bg-[#1329d4] text-white rounded-md hover:bg-[#0f20a8] transition-colors"
          >
            📞 Skambinti
          </a>
          <a 
            href="mailto:info@piksel.lt" 
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            ✉️ Rašyti
          </a>
        </div>
      </div>
    </div>
  );
}
