'use client';

import { Image, Video, Search, Square } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useClipScreens } from '@/hooks/useClipScreens';

export default function Klipai() {
  const [searchQuery, setSearchQuery] = useState('');
  const { screens: clipScreens, loading } = useClipScreens();

  const filteredScreens = useMemo(() => {
    if (!searchQuery.trim()) return clipScreens;
    const q = searchQuery.toLowerCase().trim();
    return clipScreens.filter(
      item =>
        item.screen.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q)
    );
  }, [searchQuery, clipScreens]);
  return (
    <div className="min-h-screen bg-white pt-14 md:pt-0 ml-0 md:ml-80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Reklaminiai ekranai */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">Reikalavimai klipams</h2>
              <p className="text-sm text-gray-500 mt-1">Atnaujinta: 2026-05-08</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Ieškoti"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1329d4] focus:border-transparent w-full"
              />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 border-r border-gray-200">MIESTAS</th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 border-r border-gray-200">EKRANAS</th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 border-r border-gray-200">TIPAS</th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">REZOLIUCIJA (px)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-4 sm:px-6 py-8 sm:py-12 text-center text-sm text-gray-500">
                        Kraunama...
                      </td>
                    </tr>
                  ) : filteredScreens.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 sm:px-6 py-8 sm:py-12 text-center text-sm text-gray-500">
                        Nerasta ekranų pagal „{searchQuery}“
                      </td>
                    </tr>
                  ) : (
                    filteredScreens.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 border-r border-gray-200">{item.city}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-900 border-r border-gray-200">{item.screen}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 border-r border-gray-200">{item.type}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">{item.resolution}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Format Information */}
        <div className="mt-12 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">GRAFINIAI FORMATAI</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              PNG, JPG, spalvų koduotė RGB (netinka PDF, GIF).
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <Video className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">VIDEO FORMATAI</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Formatas MPEG-4 (.mp4), ne ilgesnis nei 50MB/failas. Tik lėta, neblaškanti ir neagresyvi animacija.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <Square className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">STATINIS KLIPAS</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              10s nejudantis klipas, pirma sekundė gali būti animuota.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
