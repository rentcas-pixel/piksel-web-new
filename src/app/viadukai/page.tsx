export default function Viadukai() {
  const viadukai = [
    {
      id: 1,
      name: "Vilniaus Viadukas",
      location: "Vilniaus g. 1, Vilnius",
      size: "8m x 4m",
      description: "Strategiškai išdėstytas pagrindinėje Vilniaus arterijoje",
      dailyViews: "25,000+",
      price: "200€/dieną"
    },
    {
      id: 2,
      name: "Kauno Viadukas",
      location: "Laisvės al. 60, Kaunas",
      size: "6m x 3.5m",
      description: "Puikus matomumas Kauno centre",
      dailyViews: "18,000+",
      price: "150€/dieną"
    },
    {
      id: 3,
      name: "Klaipėdos Viadukas",
      location: "Tiltų g. 1, Klaipėda",
      size: "7m x 3m",
      description: "Strategiškai išdėstytas Klaipėdos centre",
      dailyViews: "15,000+",
      price: "180€/dieną"
    },
    {
      id: 4,
      name: "Šiaulių Viadukas",
      location: "Vilniaus g. 1, Šiauliai",
      size: "5m x 3m",
      description: "Puikus matomumas Šiaulių centre",
      dailyViews: "12,000+",
      price: "120€/dieną"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="samsung-gradient text-white samsung-section relative overflow-hidden">
        <div className="samsung-container">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Viadukų Reklama
            </h1>
            <p className="text-xl md:text-2xl text-gray-200">
              Strategiškai išdėstyti viadukai visoje Lietuvoje
            </p>
          </div>
        </div>
      </section>

      {/* Viadukai Grid */}
      <section className="samsung-section bg-white">
        <div className="samsung-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mūsų Viadukai
            </h2>
            <p className="text-xl text-gray-600">
              Strategiškai išdėstyti viadukai visoje Lietuvoje
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {viadukai.map((viadukas) => (
              <div key={viadukas.id} className="samsung-card p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{viadukas.name}</h3>
                  <p className="text-gray-600 mb-4">{viadukas.location}</p>
                  <p className="text-gray-600">{viadukas.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{viadukas.size}</div>
                    <div className="text-sm text-gray-600">Dydis</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{viadukas.dailyViews}</div>
                    <div className="text-sm text-gray-600">Dienos apžiūros</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{viadukas.price}</div>
                    <div className="text-sm text-gray-600">Kaina</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="samsung-button-primary flex-1">
                    Rezervuoti
                  </button>
                  <button className="samsung-button-secondary flex-1">
                    Detaliau
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="samsung-section bg-gray-50">
        <div className="samsung-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Statistika
            </h2>
            <p className="text-xl text-gray-600">
              Mūsų viadukų efektyvumas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">4</div>
              <div className="text-lg text-gray-600">Viadukai</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">70,000+</div>
              <div className="text-lg text-gray-600">Dienos apžiūros</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">26m²</div>
              <div className="text-lg text-gray-600">Bendras plotas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-lg text-gray-600">Veikimas</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="samsung-gradient text-white py-16">
        <div className="samsung-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Norite rezervuoti viaduką?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Susisiekite su mumis ir gausite individualų pasiūlymą
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/kontaktai"
              className="samsung-button-primary"
            >
              Susisiekti
            </a>
            <a
              href="tel:+37069066633"
              className="samsung-button-secondary"
            >
              Skambinti dabar
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}





