'use client';

import { useState } from 'react';

export default function Skaiciuokle() {
  const [formData, setFormData] = useState({
    location: '',
    duration: '',
    size: '',
    budget: ''
  });

  const [result, setResult] = useState<{
    basePrice: number;
    duration: number;
    sizeMultiplier: number;
    totalPrice: number;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculatePrice = () => {
    // Simple calculation logic
    let basePrice = 0;
    
    if (formData.location === 'vilnius') basePrice = 200;
    else if (formData.location === 'kaunas') basePrice = 150;
    else if (formData.location === 'klaipeda') basePrice = 180;
    else if (formData.location === 'siauliai') basePrice = 120;
    
    const duration = parseInt(formData.duration) || 1;
    const sizeMultiplier = formData.size === 'large' ? 1.5 : formData.size === 'medium' ? 1.2 : 1;
    
    const totalPrice = basePrice * duration * sizeMultiplier;
    
    setResult({
      basePrice,
      duration,
      sizeMultiplier,
      totalPrice
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="samsung-gradient text-white samsung-section relative overflow-hidden">
        <div className="samsung-container">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Reklamos Skaičiuoklė
            </h1>
            <p className="text-xl md:text-2xl text-gray-200">
              Apskaičiuokite savo reklamos kampanijos kainą
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="samsung-section bg-white">
        <div className="samsung-container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Calculator Form */}
              <div className="samsung-card p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Kampanijos Parametrai</h2>
                
                <form className="space-y-6">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Lokacija
                    </label>
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="">Pasirinkite lokaciją</option>
                      <option value="vilnius">Vilnius - 200€/dieną</option>
                      <option value="kaunas">Kaunas - 150€/dieną</option>
                      <option value="klaipeda">Klaipėda - 180€/dieną</option>
                      <option value="siauliai">Šiauliai - 120€/dieną</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                      Trukmė (dienos)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      min="1"
                      max="365"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Įveskite dienų skaičių"
                    />
                  </div>

                  <div>
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                      Ekrano Dydis
                    </label>
                    <select
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="">Pasirinkite dydį</option>
                      <option value="small">Mažas (3m x 2m) - Standartinis</option>
                      <option value="medium">Vidutinis (5m x 3m) - +20%</option>
                      <option value="large">Didelis (8m x 4m) - +50%</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                      Biudžetas (€)
                    </label>
                    <input
                      type="number"
                      id="budget"
                      name="budget"
                      min="0"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Jūsų biudžetas"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={calculatePrice}
                    className="samsung-button-primary w-full"
                  >
                    Apskaičiuoti kainą
                  </button>
                </form>
              </div>

              {/* Results */}
              <div className="samsung-card p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Rezultatai</h2>
                
                {result ? (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                          {result.totalPrice}€
                        </div>
                        <div className="text-lg text-gray-600">Bendra kaina</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pagrindinė kaina:</span>
                        <span className="font-semibold">{result.basePrice}€/dieną</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trukmė:</span>
                        <span className="font-semibold">{result.duration} dienos</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dydžio koeficientas:</span>
                        <span className="font-semibold">x{result.sizeMultiplier}</span>
                      </div>
                      <hr className="border-gray-200" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Iš viso:</span>
                        <span>{result.totalPrice}€</span>
                      </div>
                    </div>

                    {formData.budget && parseInt(formData.budget) > 0 && (
                      <div className={`p-4 rounded-xl ${
                        parseInt(formData.budget) >= result.totalPrice 
                          ? 'bg-green-50 text-green-800' 
                          : 'bg-red-50 text-red-800'
                      }`}>
                        {parseInt(formData.budget) >= result.totalPrice 
                          ? '✅ Jūsų biudžetas pakankamas!' 
                          : '❌ Biudžetas per mažas. Reikia papildomai ' + (result.totalPrice - parseInt(formData.budget)) + '€'
                        }
                      </div>
                    )}

                    <div className="space-y-3">
                      <button className="samsung-button-primary w-full">
                        Rezervuoti kampaniją
                      </button>
                      <button className="samsung-button-secondary w-full">
                        Susisiekti su mumis
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg">Užpildykite formą ir apskaičiuokite kainą</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="samsung-section bg-gray-50">
        <div className="samsung-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kaip veikia skaičiuoklė?
            </h2>
            <p className="text-xl text-gray-600">
              Paprastas ir aiškus kainų skaičiavimas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Pasirinkite lokaciją</h3>
              <p className="text-gray-600">Kiekviena lokacija turi savo bazinę kainą</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Nurodykite parametrus</h3>
              <p className="text-gray-600">Trukmė ir ekrano dydis įtakoja galutinę kainą</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Gaukite rezultatą</h3>
              <p className="text-gray-600">Momentinis kainų skaičiavimas</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


