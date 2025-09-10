export default function Kainos() {
  const pricingPlans = [
    {
      name: "Pradžia",
      price: "150",
      period: "per dieną",
      description: "Puikus pasirinkimas mažoms kampanijoms",
      features: [
        "1 ekranas",
        "Standartinis turinys",
        "8 valandos per dieną",
        "Email palaikymas",
        "Pagrindinė analitika"
      ],
      popular: false
    },
    {
      name: "Profesionalus",
      price: "400",
      period: "per dieną",
      description: "Populiariausias pasirinkimas vidutinėms kampanijoms",
      features: [
        "2-3 ekranai",
        "Kustomizuotas turinys",
        "12 valandų per dieną",
        "Telefoninis palaikymas",
        "Išsami analitika",
        "Turinio kūrimas"
      ],
      popular: true
    },
    {
      name: "Premium",
      price: "800",
      period: "per dieną",
      description: "Pilnas paketas didelėms kampanijoms",
      features: [
        "Visas ekranų tinklas",
        "Premium turinys",
        "24/7 rodymas",
        "Prioritetinis palaikymas",
        "Detali analitika",
        "Turinio kūrimas",
        "Kampanijos optimizavimas"
      ],
      popular: false
    }
  ];

  const additionalServices = [
    {
      name: "Turinio kūrimas",
      price: "50-200",
      description: "Profesionalus grafinis dizainas ir animacijos"
    },
    {
      name: "Video turinys",
      price: "100-500",
      description: "Video kūrimas ir redagavimas"
    },
    {
      name: "Kampanijos planavimas",
      price: "200",
      description: "Strateginis kampanijos planavimas ir optimizavimas"
    },
    {
      name: "Analitikos ataskaita",
      price: "100",
      description: "Detali kampanijos efektyvumo analizė"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Kainos
            </h1>
            <p className="text-xl md:text-2xl text-blue-100">
              Skirtingi paketai skirtingoms kampanijoms
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pasirinkite savo paketą
            </h2>
            <p className="text-xl text-gray-600">
              Visi paketai apima pagrindines paslaugas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white p-8 rounded-lg shadow-lg border-2 ${
                  plan.popular ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Populiariausias
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}€</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Pasirinkti planą
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Papildomos Paslaugos
            </h2>
            <p className="text-xl text-gray-600">
              Galite užsisakyti papildomas paslaugas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-3">{service.price}€</p>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dažniai užduodami klausimai
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Ar kainos apima visus mokesčius?
              </h3>
              <p className="text-gray-600">
                Taip, visos kainos nurodytos su PVM. Jokių papildomų mokesčių nėra.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Ar galiu keisti planą kampanijos metu?
              </h3>
              <p className="text-gray-600">
                Taip, galite keisti planą bet kuriuo metu. Skirtumas bus perskaičiuotas proporcingai.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Koks minimalus kampanijos laikotarpis?
              </h3>
              <p className="text-gray-600">
                Minimalus kampanijos laikotarpis yra 1 diena. Rekomenduojame bent 3-7 dienas geresniam rezultatui.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Ar teikiate nuolaidas ilgalaikėms kampanijoms?
              </h3>
              <p className="text-gray-600">
                Taip, kampanijoms ilgesnėms nei 30 dienų teikiame iki 20% nuolaidą. Susisiekite su mumis dėl detalių.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Norite pradėti kampaniją?
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
              href="tel:+37069066633"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Skambinti dabar
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}


