'use client';

import { Download, Image, Video } from 'lucide-react';
import { ledScreens } from '@/data/ledScreens';

export default function Klipai() {
  const requirementsData = [
    { city: 'Vilnius', format: 'Viadukai', width: '3040', height: '240' },
    { city: 'Vilnius', format: 'Horizontalus', width: '1152', height: '576' },
    { city: 'Vilnius', format: 'Vertikalus', width: '448', height: '672' },
    { city: 'Vilnius (Outlet)', format: 'Horizontalus', width: '640', height: '288' },
    { city: 'Kaunas ▲', format: 'Horizontalus', width: '1080', height: '450' },
    { city: 'Kaunas', format: 'Horizontalus', width: '960', height: '576' },
    { city: 'Klaipėda', format: 'Horizontalus', width: '1152', height: '576' },
    { city: 'Klaipėda (Centras)', format: 'Vertikalus', width: '720', height: '864' },
    { city: 'Šiauliai', format: 'Horizontalus', width: '1152', height: '576' },
    { city: 'Panevėžys (RYO/Klaipėdos)', format: 'Horizontalus', width: '1309', height: '576' },
    { city: 'Alytus', format: 'Horizontalus', width: '480', height: '270' },
    { city: 'Marijampolė', format: 'Horizontalus', width: '1152', height: '576' },
    { city: 'Mažeikiai', format: 'Horizontalus', width: '640', height: '288' },
    { city: 'Utena', format: 'Horizontalus', width: '960', height: '576' }
  ];

  // Function to get screen names for a city and format
  const getScreenNames = (city: string, format: string) => {
    const cityName = city.replace(' ▲', '').replace(' (Outlet)', '').replace(' (Centras)', '').replace(' (RYO/Klaipėdos)', '');
    return ledScreens.filter(screen => 
      screen.city === cityName && 
      (format === 'Horizontalus' || format === 'Vertikalus' || format === 'Viadukai')
    ).map(screen => screen.name);
  };

  return (
    <div className="min-h-screen bg-white ml-80">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-4xl font-bold text-gray-900">Reikalavimai klipams</h2>
          <Download className="w-5 h-5 text-gray-600" />
        </div>
            
            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                        MIESTAS
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                        FORMATAS
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                        PLOTIS (PX)
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        AUKŠTIS (PX)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {requirementsData.map((item, index) => {
                      const screenNames = getScreenNames(item.city, item.format);
                      return (
                        <tr key={index} className="hover:bg-gray-50 group relative">
                          <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">
                            {item.city}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">
                            {item.format}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">
                            {item.width}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {item.height}
                          </td>
                          
                          {/* Tooltip */}
                          {screenNames.length > 0 && (
                            <div className="absolute left-0 top-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                              <div className="absolute top-0 left-0 bg-white text-gray-900 px-3 py-2 rounded-lg shadow-lg border border-gray-200 text-sm whitespace-nowrap transform -translate-y-full -translate-x-2">
                                <div className="flex flex-wrap gap-1">
                                  {screenNames.map((name, idx) => (
                                    <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                      {name}
                                    </span>
                                  ))}
                                </div>
                                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                              </div>
                            </div>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Format Information */}
            <div className="mt-12 space-y-8">
              {/* Graphic Formats */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Image className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-medium text-gray-900">GRAFINIAI FORMATAI</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Yra tinkami JPEG, bei PNG formatai. Spalvų koduotė RGB. Netinka - PDF, GIF.
                </p>
              </div>

              {/* Video Formats */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Video className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-medium text-gray-900">VIDEO FORMATAI</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Formatas MPEG-4 (be audio), taip pat ne didesnis nei 50MB dydžio. Tik lėta, neblaškanti ir neagresyvi animacija.
                </p>
              </div>
            </div>
      </div>
    </div>
  );
}
