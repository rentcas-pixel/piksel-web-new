'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, FileText, Calendar, Mail, ChevronRight, Play, HelpCircle, Phone, Monitor, Users, Clock, MapPin as LocationIcon, Search, X, Flag, Newspaper, Menu } from 'lucide-react';
import { useLEDScreens } from '@/hooks/useLEDScreens';
import { useNews } from '@/hooks/useNews';

export default function GlobalSidebar() {
  const pathname = usePathname();
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Get LED screens from Supabase
  const { screens: ledScreens, loading, error } = useLEDScreens();
  const { news: newsItems } = useNews();

  const navigationItems = [
    { name: 'Naujienos', icon: Newspaper, href: '/naujienos' },
    { name: 'Klipai', icon: Play, href: '/klipai' },
    { name: 'DUK', icon: HelpCircle, href: '/duk' }
  ];

  const handleCityFilter = (city: string) => {
    setSelectedCity(city);
    // Navigate to main page with city filter
    window.location.href = `/?city=${city}`;
  };

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results = ledScreens.filter(screen => 
      screen.name.toLowerCase().includes(query.toLowerCase()) ||
      screen.address.toLowerCase().includes(query.toLowerCase()) ||
      screen.city.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
    setShowSearchResults(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };
  
  // Calculate screen counts for each city
  const getCityCounts = () => {
    if (!ledScreens) return [];
    
    const cityCounts: { [key: string]: number } = {};
    
    ledScreens.forEach(screen => {
      if (screen.is_active) {
        cityCounts[screen.city] = (cityCounts[screen.city] || 0) + 1;
      }
    });
    
    // Calculate total count for Lithuania
    const totalCount = Object.values(cityCounts).reduce((sum, count) => sum + count, 0);
    
    // Calculate regional count (cities not in main list)
    const mainCities = ['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys'];
    const regionalCount = Object.entries(cityCounts)
      .filter(([city]) => !mainCities.includes(city))
      .reduce((sum, [, count]) => sum + count, 0);
    
    return [
      { name: 'Lietuva', count: totalCount, isSpecial: true },
      { name: 'Vilnius', count: cityCounts['Vilnius'] || 0 },
      { name: 'Kaunas', count: cityCounts['Kaunas'] || 0 },
      { name: 'Klaipėda', count: cityCounts['Klaipėda'] || 0 },
      { name: 'Šiauliai', count: cityCounts['Šiauliai'] || 0 },
      { name: 'Panevėžys', count: cityCounts['Panevėžys'] || 0 },
      { name: 'Regionai', count: regionalCount }
    ];
  };
  
  const cities = getCityCounts();


  // Don't show sidebar on main page (page.tsx) as it has its own sidebar
  if (pathname === '/') {
    return null;
  }

  return (
    <>
      {/* Mobile: top bar with hamburger menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-black z-30 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center flex-shrink-0" onClick={() => setMobileMenuOpen(false)}>
          <Image src="/Piksel-logo-black-2023.png" alt="Piksel" width={100} height={32} className="h-7 w-auto brightness-0 invert" />
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-white rounded-lg hover:bg-white/10"
          aria-label="Meniu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <>
          <div className="md:hidden fixed inset-0 top-14 bg-black/30 z-40" onClick={() => setMobileMenuOpen(false)} aria-hidden />
          <div className="md:hidden fixed top-14 left-0 right-0 bg-black/95 z-50 py-4 px-4 shadow-lg">
            <nav className="flex flex-col gap-1">
            <Link href="/" className="px-4 py-3 text-white text-base font-medium rounded-lg hover:bg-white/10" onClick={() => setMobileMenuOpen(false)}>Žemėlapis</Link>
            <Link href="/naujienos" className={`px-4 py-3 text-base font-medium rounded-lg hover:bg-white/10 flex items-center gap-2 ${pathname === '/naujienos' ? 'bg-white/20 text-white' : 'text-white'}`} onClick={() => setMobileMenuOpen(false)}>
              Naujienos
              {newsItems.length > 0 && (
                <span className="bg-white/30 text-white text-xs font-semibold px-2 py-0.5 rounded-full">{newsItems.length}</span>
              )}
            </Link>
            <Link href="/klipai" className={`px-4 py-3 text-base font-medium rounded-lg hover:bg-white/10 ${pathname === '/klipai' ? 'bg-white/20 text-white' : 'text-white'}`} onClick={() => setMobileMenuOpen(false)}>Klipai</Link>
            <Link href="/duk" className={`px-4 py-3 text-base font-medium rounded-lg hover:bg-white/10 ${pathname === '/duk' ? 'bg-white/20 text-white' : 'text-white'}`} onClick={() => setMobileMenuOpen(false)}>DUK</Link>
          </nav>
          </div>
        </>
      )}
      {/* Desktop: full sidebar */}
    <div className="hidden md:flex fixed left-0 top-0 h-screen w-80 bg-gray-50 border-r border-gray-200 flex-col z-30">
      {/* Header */}
      <div className="p-6 bg-black border-b border-gray-200 flex justify-center">
        <button 
          onClick={() => handleCityFilter('Vilnius')}
          className="flex flex-col items-center gap-1 w-full hover:bg-gray-900 rounded-lg p-2 -m-2 transition-colors"
        >
          <div className="flex flex-col items-center text-center">
            <Image
              src="/Piksel-logo-black-2023.png"
              alt="Piksel Logo"
              width={120}
              height={40}
              className="h-[31px] w-auto brightness-0 invert"
            />
          </div>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Ieškoti ekranų pagal pavadinimą, adresą, miestą..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1329d4] focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        {searchResults.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            Rasta {searchResults.length} ekranų
          </div>
        )}
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
                  onClick={() => handleCityFilter(city.name)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:text-gray-900 transition-colors group mb-1 ${
                    selectedCity === city.name ? 'bg-[#1329d4]/10 text-[#1329d4]' : ''
                  } ${city.isSpecial ? 'bg-gradient-to-r from-[#1329d4]/5 to-[#1329d4]/10 border border-[#1329d4]/20' : ''}`}
                >
                  {city.isSpecial ? (
                    <span className="text-lg">🇱🇹</span>
                  ) : (
                    <MapPin className={`w-4 h-4 group-hover:text-gray-600 ${
                      city.isSpecial ? 'text-[#1329d4]' : 'text-gray-400'
                    }`} />
                  )}
                  <span className="flex-1 text-left font-bold">{city.name}</span>
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
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:text-gray-900 transition-colors group ${
                pathname === item.href ? 'bg-blue-100 text-blue-700' : ''
              }`}
            >
              <item.icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              <span className="flex-1 text-left font-medium">{item.name}</span>
              {item.href === '/naujienos' && newsItems.length > 0 && (
                <span className="bg-[#1329d4] text-white text-xs font-semibold px-2 py-0.5 rounded-full">{newsItems.length}</span>
              )}
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
    </>
  );
}
