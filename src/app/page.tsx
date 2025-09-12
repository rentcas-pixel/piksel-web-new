'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Map from '@/components/Map';
import ScreenList from '@/components/ScreenList';
import { useLEDScreens } from '@/hooks/useLEDScreens';
import { Building2, User, Mail, MessageSquare, Send, Calendar, MapPin, X } from 'lucide-react';

// Global declarations
declare global {
  interface Window {
    showMapPopup: (screenId: string) => void;
  }
}

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<string>('Vilnius');
  const [selectedScreens, setSelectedScreens] = useState<string[]>([]);
  const [screenCities, setScreenCities] = useState<{[screenName: string]: string}>({});
  const [dateRange, setDateRange] = useState<{from: string; to: string} | null>(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get LED screens from Supabase
  const { screens: ledScreens, loading, error } = useLEDScreens();

  // Hash routing functionality
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1); // Remove #
      console.log('Hash changed to:', hash);
      
      if (hash) {
        // Parse hash: city-screen or just city
        const parts = hash.split('-');
        console.log('Hash parts:', parts);
        
        if (parts.length >= 2) {
          const city = parts[0];
          const screenName = parts.slice(1).join('-'); // Handle multi-word screen names
          console.log('Looking for city:', city, 'screen:', screenName);
          
          // Set city filter - capitalize first letter
          const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);
          setSelectedCity(capitalizedCity);
          
          // Find screen in data
          const screen = ledScreens.find(s => 
            s.city.toLowerCase() === city.toLowerCase() && 
            s.name.toLowerCase().replace(/\s+/g, '-') === screenName.toLowerCase()
          );
          
          console.log('Found screen:', screen);
          
          if (screen) {
            // Add screen to selected
            setSelectedScreens(prev => {
              if (!prev.includes(screen.name)) {
                return [...prev, screen.name];
              }
              return prev;
            });
            
            // Open popup after a delay to ensure map is ready
            setTimeout(() => {
              const mapInstance = (window as unknown as { mapInstance: any }).mapInstance;
              if (mapInstance) {
                // Find the marker and open its popup
                mapInstance.eachLayer((layer: unknown) => {
                  if (layer instanceof (window as unknown as { L: { Marker: any } }).L.Marker) {
                    const latLng = (layer as any).getLatLng();
                    if (Math.abs(latLng.lat - screen.coordinates[0]) < 0.0001 && 
                        Math.abs(latLng.lng - screen.coordinates[1]) < 0.0001) {
                      (layer as any).openPopup();
                    }
                  }
                });
              }
            }, 2000);
          }
        } else if (parts.length === 1) {
          // Just city
          console.log('Setting city to:', parts[0]);
          const capitalizedCity = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
          setSelectedCity(capitalizedCity);
        }
      }
    };

    // Handle initial hash immediately
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []); // Remove selectedScreens dependency

  const handleCityFilter = (city: string) => {
    setSelectedCity(city);
    console.log('Selected city:', city);
  };

  // Get the selected city for map display
  const mapCity = selectedCity;

  const handleClearFilter = () => {
    setSelectedCity('Vilnius');
    setSelectedScreens([]);
    setScreenCities({});
    setDateRange(null);
  };

  const handleSelectScreen = (screenName: string) => {
    setSelectedScreens(prev => {
      if (prev.includes(screenName)) {
        // Remove screen and its city
        setScreenCities(prevCities => {
          const newCities = { ...prevCities };
          delete newCities[screenName];
          return newCities;
        });
        return prev.filter(name => name !== screenName);
      } else {
        // Add screen and its city
        const screen = ledScreens.find(s => s.name === screenName);
        if (screen) {
          setScreenCities(prevCities => ({
            ...prevCities,
            [screenName]: screen.city
          }));
          // Update URL hash when selecting screen
          const citySlug = screen.city.toLowerCase();
          const screenSlug = screenName.toLowerCase().replace(/\s+/g, '-');
          window.location.hash = `${citySlug}-${screenSlug}`;
        }
        return [...prev, screenName];
      }
    });
  };

  const handleShowPopup = (screenId: string) => {
    // Find the screen by ID and trigger popup
    const screen = ledScreens.find(s => s.id === screenId);
    if (screen && window.showMapPopup) {
      window.showMapPopup(screenId);
    }
  };

  const handleDateRangeChange = (from: string, to: string) => {
    setDateRange({ from, to });
    // Show inquiry form when both dates are selected
    if (from && to) {
    setShowInquiryForm(true);
    }
  };

  const handleCloseInquiryForm = () => {
    setShowInquiryForm(false);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Kraunama...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Klaida: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Bandyti vėl
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        onCityFilter={handleCityFilter}
        selectedCity={selectedCity}
      />
      
      {/* Screen List */}
      <ScreenList 
        selectedCity={selectedCity}
        selectedScreens={selectedScreens}
        onSelectScreen={handleSelectScreen}
        onShowPopup={handleShowPopup}
        isLoading={isLoading}
      />
      
      {/* Map - Full Width with margin for sidebar */}
      <div className={`ml-[640px] ${showInquiryForm ? 'mr-96' : 'mr-0'}`}>
        <Map 
          selectedCity={mapCity} 
          selectedScreens={selectedScreens} 
          screenCities={screenCities}
          selectedDateRange={dateRange}
          onSelectScreen={handleSelectScreen}
          onDateRangeChange={handleDateRangeChange}
          onClearFilter={handleClearFilter}
          onCityChange={setSelectedCity}
        />
      </div>

      {/* Inquiry Form Sidebar */}
      {showInquiryForm && (
        <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-xl border-l border-gray-200 z-50 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <img 
                      src="/Piksel-logo-black-2023.png" 
                      alt="Piksel" 
                      className="h-6"
                    />
                  </div>
                  <p className="text-sm text-gray-600">Užklausa</p>
                </div>
              </div>
              <button
                onClick={handleCloseInquiryForm}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Cities */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Pasirinkti miestai</h3>
              <div className="space-y-2">
                {selectedCity && (
                  <div className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium inline-block mr-2">
                    {selectedCity}
                  </div>
                )}
              </div>
                  </div>

            {/* Selected Screens */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Pasirinkti ekranai ({selectedScreens.length})</h3>
              <div className="flex flex-wrap gap-2">
                {selectedScreens.map((screen, index) => (
                  <div key={index} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium border border-gray-300">
                    {screen}
                  </div>
                ))}
                </div>
              </div>

            {/* Advertising Period */}
            {dateRange && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Reklamos periodas</h3>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium border border-gray-300">
                    {dateRange.from}
                    </div>
                  <span className="text-gray-500 text-sm">iki</span>
                  <div className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium border border-gray-300">
                    {dateRange.to}
                    </div>
                  </div>
                </div>
              )}

              {/* Company */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Įmonė</h3>
                    <input
                      type="text"
                placeholder="Įmonės pavadinimas"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
              </div>

              {/* Name */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Vardas</h3>
                    <input
                      type="text"
                placeholder="Jūsų vardas"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
              </div>

              {/* Email */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">El. paštas</h3>
                    <input
                      type="email"
                placeholder="el@paštas.lt"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
              </div>

              {/* Comment */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Komentaras</h3>
                    <textarea
                placeholder="Jūsų komentaras ar papildoma informacija..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
            </div>

            {/* Send Button */}
              <button
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 3000);
              }}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Siunčiama...</span>
                </>
              ) : (
                'Siųsti'
              )}
              </button>
          </div>
        </div>
      )}
    </div>
  );
}