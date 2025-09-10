'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

export default function Kontaktai() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    service: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white ml-80">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Ačiū už užklausą!</h1>
            <p className="text-gray-700 leading-relaxed mb-8">
              Gavome jūsų žinutę ir susisieksime su jumis per 24 valandas.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  company: '',
                  message: '',
                  service: ''
                });
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Siųsti naują užklausą
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 ml-80">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Kontaktai</h1>
        </div>

        {/* Contact Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* Left Side - Contact Information */}
            <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 p-12 flex flex-col justify-center">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
              </div>
              
              <div className="relative z-10 text-white">
                <h2 className="text-3xl font-bold mb-8">Susisiekite su mumis</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Adresas</h3>
                      <p className="text-blue-100">Ramybės g. 4-70</p>
                      <p className="text-blue-100">LT-02103, Vilnius</p>
                      <p className="text-sm text-blue-200">Lietuva</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Susisiekime</h3>
                      <p className="text-blue-100">+370 (690) 66633</p>
                      <p className="text-sm text-blue-200">Darbo laikas: Pn-Pt 8:00-18:00</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Bendras palaikymas</h3>
                      <p className="text-blue-100">info@piksel.lt</p>
                      <p className="text-sm text-blue-200">Atsakysime per 24 valandas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Siųskite mums žinutę</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Pasakykite savo vardą *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      placeholder="Vardas"
                    />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      placeholder="Pavardė"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Įveskite savo el. paštą *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder="Pvz. vardas@elpaštas.lt"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Įveskite telefono numerį
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder="Pvz. +370 6XX XXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Žinutė *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg resize-none"
                    placeholder="Parašykite mums žinutę..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? 'Siunčiama...' : 'SIŲSTI ŽINUTĘ'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 leading-relaxed max-w-4xl mx-auto">
            Tinkamas kontaktų puslapis išvardija visas galimas kontaktavimo galimybes vienoje vietoje. 
            Suteikdami kelias kontaktavimo galimybes, parodysite, kiek esate įsipareigoję savo vartotojams. 
            Ši didelė kontaktų forma suteikia pakankamai vietos kontaktinei informacijai vienoje pusėje ir formai kitoje pusėje.
          </p>
        </div>
      </div>
    </div>
  );
}


