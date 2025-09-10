'use client';

import { useLEDScreens } from '@/hooks/useLEDScreens';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, FileText, Calendar, Mail, ChevronRight, Play, HelpCircle, Phone, Monitor, Users, Clock, MapPin as LocationIcon } from 'lucide-react';

interface SidebarProps {
  onCityFilter: (city: string) => void;
  selectedCity: string;
}

export default function Sidebar({ onCityFilter, selectedCity }: SidebarProps) {
  // Get LED screens from Supabase
  const { screens: ledScreens, loading, error } = useLEDScreens();
  
  // Calculate screen counts for each city
  const getCityCounts = () => {
    if (!ledScreens) return [];
    
    const cityCounts: { [key: string]: number } = {};
    
    ledScreens.forEach(screen => {
      if (screen.is_active) {
        cityCounts[screen.city] = (cityCounts[screen.city] || 0) + 1;
      }
    });
    
    // Calculate regional count (cities not in main list)
    const mainCities = ['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys'];
    const regionalCount = Object.entries(cityCounts)
      .filter(([city]) => !mainCities.includes(city))
      .reduce((sum, [, count]) => sum + count, 0);
    
    return [
      { name: 'Vilnius', count: cityCounts['Vilnius'] || 0 },
      { name: 'Kaunas', count: cityCounts['Kaunas'] || 0 },
      { name: 'Klaipėda', count: cityCounts['Klaipėda'] || 0 },
      { name: 'Šiauliai', count: cityCounts['Šiauliai'] || 0 },
      { name: 'Panevėžys', count: cityCounts['Panevėžys'] || 0 },
      { name: 'Regionai', count: regionalCount }
    ];
  };
  
  const cities = getCityCounts();

  const navigationItems = [
    { name: 'Klipai', icon: Play, href: '/klipai' },
    { name: 'DUK', icon: HelpCircle, href: '/duk' }
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-80 bg-gray-50 border-r border-gray-200 flex flex-col z-30">
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <Image
              src="/Piksel-logo-black-2023.png"
              alt="Piksel Logo"
              width={120}
              height={40}
              className="h-[22px] w-auto"
            />
            <p className="text-sm text-gray-500">ryškių ekranų tinklas</p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg border border-gray-200">
          <div className="flex-shrink-0">
            <Monitor className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Users className="w-3 h-3" />
              Rodome reklamą
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <Clock className="w-3 h-3" />
              Renkame kontaktus...
            </div>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Cities */}
      <nav className="flex-1 p-4 bg-gray-50">
        <div className="space-y-1">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 px-3">Miestai</h3>
            {loading ? (
              <div className="space-y-1">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="w-full flex items-center gap-3 p-3 rounded-lg">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-8 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              cities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => onCityFilter(city.name)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:text-gray-900 transition-colors group mb-1 ${
                    selectedCity === city.name ? 'bg-blue-100 text-blue-700' : ''
                  }`}
                >
                  <MapPin className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  <span className="flex-1 text-left font-medium">{city.name}</span>
                  <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                    {city.count}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>
              ))
            )}
          </div>

          {/* Navigation */}
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <item.icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              <span className="flex-1 text-left font-medium">{item.name}</span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </Link>
          ))}

          {/* Contact Info */}
          <div className="mt-6">
            <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg border border-gray-200">
              <div className="flex-shrink-0">
                <Phone className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Kontaktai
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <div className="flex items-center gap-2">
                    <LocationIcon className="w-3 h-3" />
                    J. Balčikonio g. 9, Vilnius
                  </div>
                  <a href="mailto:info@piksel.lt" className="flex items-center gap-2 hover:text-gray-700 transition-colors">
                    <Mail className="w-3 h-3" />
                    info@piksel.lt
                  </a>
                  <a href="tel:+37069066633" className="flex items-center gap-2 hover:text-gray-700 transition-colors">
                    <Phone className="w-3 h-3" />
                    +370 (690) 66633
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

    </div>
  );
}
