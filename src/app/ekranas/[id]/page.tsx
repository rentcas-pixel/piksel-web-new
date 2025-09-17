
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ledScreens, LEDScreen } from '@/data/ledScreens';
import { ArrowLeft, MapPin, Eye, DollarSign, Monitor, Zap, Share2, Bookmark, Download, Users, Calendar } from 'lucide-react';

export default function ScreenPage() {
  const params = useParams();
  const router = useRouter();
  const [screen, setScreen] = useState<LEDScreen | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      // Redirect to main page with screen popup
      const screenSlug = params.id;
      router.replace(`/?screen=${screenSlug}`);
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!screen) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Ekranas nerastas</h1>
          <button 
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Grįžti atgal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - LED Pro Style */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">ledpro</h1>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-600">Skambinkite +370 690 666 33</span>
              <span className="text-sm text-gray-600">El. paštas: support@ledekranai.pro</span>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Susisiekti
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        {/* Hero Image - Full Width */}
        <div className="mb-8">
          <div className="relative overflow-hidden">
            <Image
              src={screen.image}
              alt={screen.name}
              width={1920}
              height={1080}
              className="w-full h-[70vh] object-contain bg-gray-100 aspect-video"
              priority
            />
            
            {/* Stats Badges */}
            <div className="absolute top-6 left-6">
              <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Srautas per savaitę</p>
                    <p className="text-xl font-bold text-gray-900">364 140</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-6 left-6">
              <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Dienos kaina</p>
                    <p className="text-xl font-bold text-gray-900">nuo 72.00 €</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - LED Pro Style */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                Lauko ekranai {screen.city}. Modelis {screen.name}
              </h1>
              
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Strategiškai išdėstytas {screen.address} vietoje, {screen.city} centre, šis LED ekranas 
                  užtikrina maksimalų jūsų reklamos pranešimo matomumą ir poveikį.
                </p>
              </div>

              {/* Action Button */}
              <div className="mb-8">
                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Pateikti užklausą
                </button>
              </div>
            </div>

            {/* Product Details - Expandable Sections */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Techninės specifikacijos</h2>
                
                {/* Raiška ir ryškumas - Expanded */}
                <div className="mb-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900">Raiška ir ryškumas</h3>
                    <span className="text-gray-400">-</span>
                  </div>
                  <div className="p-4 bg-white border-l-4 border-blue-500 mt-2 rounded-r-lg">
                    <p className="text-sm text-gray-700">
                      Lauko ekranų raiška - {screen.name === 'Compensa' ? '3.040 x 240' : '1152 x 576'} pikselių. 
                      Ekranų ryškumas 10.000-7.500 Nitų. Matymo kampas - 160/70°
                    </p>
                  </div>
                </div>

                {/* LED ekranų dydis - Collapsed */}
                <div className="mb-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <h3 className="font-semibold text-gray-900">LED ekranų dydis</h3>
                    <span className="text-gray-400">+</span>
                  </div>
                </div>

                {/* Technologija - Collapsed */}
                <div className="mb-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <h3 className="font-semibold text-gray-900">Technologija</h3>
                    <span className="text-gray-400">+</span>
                  </div>
                </div>

                {/* Adresas - Collapsed */}
                <div className="mb-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <h3 className="font-semibold text-gray-900">Adresas</h3>
                    <span className="text-gray-400">+</span>
                  </div>
                </div>

                {/* Įrengimo data - Collapsed */}
                <div className="mb-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <h3 className="font-semibold text-gray-900">Įrengimo data</h3>
                    <span className="text-gray-400">+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
