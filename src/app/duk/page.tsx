'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function DUK() {
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default

  const faqData = [
    {
      question: "Ar galiu reklamuotis tik viename viaduke?",
      answer: "Viadukų ekranai parduodami tik kaip bendras reklamos paketas, apimantis 7 viadukų ekranus. Tik taip galime užtikrinti maksimalų reklamos pasiekiamumą."
    },
    {
      question: "Kokia vidutinė reklamos transliacijų trukmė?",
      answer: "Vidutinė transliacijų trukmė - 2 savaitės, dažniausiai rodant reklaminį klipą kas antrą valandą."
    },
    {
      question: "Koks turi būti reklamos klipas?",
      answer: "Nežiūrint į reklamos tikslus, klipas turi atitikti kelis pagrindinius reikalavimus: 1. Naudojamos kontrastuojančios spalvos. 2. Trumpas tekstas (idealiu atveju reikia įtilpti į 7 žodžius). 3. Aiškiai skaitomas teksto šriftas."
    },
    {
      question: "Kiek kartų per valandą pasirodys klipas?",
      answer: "Per valandą 10 sekundžių trukmės klipas rodomas mažiausiai 30 kartų. Parodymai priklauso nuo ekranų užimtumo. Bet kokiu atveju mes garantuojame 30 parodymų."
    },
    {
      question: "Ar galiu naudoti ilgesnį arba trumpesnį klipą?",
      answer: "Viadukų ekranuose galite naudoti ne trumpesnį nei 10 sekundžių reklamos klipą. Kituose mūsų ekranuose galite naudoti ir 5 sekundžių arba 15 sekundžių klipus. Nors labiausiai pasiteisina 10 sekundžių trukmės klipai."
    },
    {
      question: "Ar galite sukurti reklaminį klipą?",
      answer: "Taip, galime. Klipo kaina prasideda nuo 150 EUR, priklausomai nuo jo sudėtingumo."
    },
    {
      question: "Nuo kada iki kada rodoma reklama?",
      answer: "Ekranai veikia nuo 6.00 val. iki 23.00 val.."
    },
    {
      question: "Kas yra statinė reklama?",
      answer: "Dėl Vilniaus miesto savivaldybės keliamų reikalavimų kai kuriuose Vilniaus ekranuose galima transliuoti tik statinius vaizdo klipus, t. y. klipas turi būti pateiktas be judančių vaizdų. Minimali klipo trukmė - 10 sekundžių."
    },
    {
      question: "Kiek klipų galima rotuoti vienu metu?",
      answer: "Vienoje kampanijoje galite rotuoti iki 5 skirtingų video klipų."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-white ml-80">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Dažniausiai užduodami klausimai</h1>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <span className="text-lg font-medium text-gray-900 pr-4">
                  {item.question}
                </span>
                <div className="flex-shrink-0">
                  {openItems.includes(index) ? (
                    <Minus className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>
              
              {openItems.includes(index) && (
                <div className="px-6 pb-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed pt-2">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
