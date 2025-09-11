export default function Ekranai() {
  const screens = [
    {
      id: 1,
      name: "Vilniaus Centras",
      location: "Gedimino pr. 1, Vilnius",
      size: "4m x 3m",
      resolution: "1920x1440",
      type: "Išorinis",
      description: "Strategiškai išdėstytas Vilniaus centre, puikiai matomas iš visų pusių."
    },
    {
      id: 2,
      name: "Akropolis",
      location: "Ozo g. 25, Vilnius",
      size: "6m x 4m",
      resolution: "2560x1920",
      type: "Išorinis",
      description: "Didžiausias LED ekranas prekybos centre, puikiai tinka didelio masto kampanijoms."
    },
    {
      id: 3,
      name: "Vilniaus Oro Uostas",
      location: "Rodūnios kelias 10a, Vilnius",
      size: "3m x 2m",
      resolution: "1440x960",
      type: "Vidinis",
      description: "Strategiškai išdėstytas oro uoste, puikiai tinka tarptautinėms kampanijoms."
    },
    {
      id: 4,
      name: "Kaunas Centras",
      location: "Laisvės al. 60, Kaunas",
      size: "5m x 3.5m",
      resolution: "2000x1400",
      type: "Išorinis",
      description: "Puikus matomumas Kauno centre, puikiai tinka regioninėms kampanijoms."
    },
    {
      id: 5,
      name: "Klaipėdos Centras",
      location: "Tiltų g. 1, Klaipėda",
      size: "4.5m x 3m",
      resolution: "1800x1200",
      type: "Išorinis",
      description: "Strategiškai išdėstytas Klaipėdos centre, puikiai matomas iš visų pusių."
    },
    {
      id: 6,
      name: "Šiaulių Centras",
      location: "Vilniaus g. 1, Šiauliai",
      size: "3.5m x 2.5m",
      resolution: "1600x1200",
      type: "Išorinis",
      description: "Puikus matomumas Šiaulių centre, puikiai tinka regioninėms kampanijoms."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Mūsų LED Ekranai
            </h1>
            <p className="text-xl md:text-2xl text-blue-100">
              Strategiškai išdėstyti ekranai visoje Lietuvoje
            </p>
          </div>
        </div>
      </section>

      {/* Screens Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ekranų Tinklas
            </h2>
            <p className="text-xl text-gray-600">
              Mūsų ekranai išdėstyti strateginėse vietose visoje Lietuvoje
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {screens.map((screen) => (
              <div key={screen.id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{screen.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      screen.type === 'Išorinis' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {screen.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{screen.location}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dydis:</span>
                    <span className="font-semibold">{screen.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rezoliucija:</span>
                    <span className="font-semibold">{screen.resolution}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{screen.description}</p>

                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Rezervuoti
                  </button>
                  <button className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Detaliau
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ekranų Lokacijos
            </h2>
            <p className="text-xl text-gray-600">
              Visi mūsų ekranai išdėstyti strateginėse vietose
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Statistika</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Išoriniai ekranai:</span>
                    <span className="font-bold text-green-600">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Vidiniai ekranai:</span>
                    <span className="font-bold text-blue-600">1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bendras plotas:</span>
                    <span className="font-bold text-gray-900">95 m²</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dienos apžiūros:</span>
                    <span className="font-bold text-gray-900">50,000+</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Privalumai</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Strateginės lokacijos</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Aukšta rezoliucija</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">24/7 veikimas</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Profesionalus valdymas</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Norite rezervuoti ekraną?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Susisiekite su mumis ir gausite individualų pasiūlymą
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/kontaktai"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Susisiekti
            </a>
            <a
              href="/kainos"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Žiūrėti kainas
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}





