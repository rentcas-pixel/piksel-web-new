'use client';

import { useEffect, useRef, useState } from 'react';
import { LEDScreen } from '@/lib/supabase';
import { useLEDScreens } from '@/hooks/useLEDScreens';

interface MapProps {
  selectedCity: string;
  selectedScreens?: string[];
  screenCities?: {[screenName: string]: string};
  selectedDateRange?: {from: string; to: string} | null;
  onClearFilter?: () => void;
  onSelectScreen?: (screenName: string) => void;
  onDateRangeChange?: (from: string, to: string) => void;
  onCityChange?: (city: string) => void;
}

export default function Map({ selectedCity, selectedScreens, screenCities, selectedDateRange, onClearFilter, onSelectScreen, onDateRangeChange, onCityChange }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { screens: ledScreens, loading, error } = useLEDScreens();
  
  // Check if mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile popup template
  const getMobilePopupHTML = (screen: LEDScreen, sideName: string = '') => {
    const fullName = sideName ? `${screen.name} - ${sideName}` : screen.name;
    return `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; width: 320px; max-width: 90vw; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">
        <!-- Photo -->
        <div style="width: 100%; height: 200px; position: relative; background: #ddd; overflow: hidden;">
          <img src="${screen.image_url}" alt="${fullName}"
               style="width: 100%; height: 100%; object-fit: cover;"/>
          
          <!-- Copy URL Button -->
          <button onclick="navigator.clipboard.writeText(window.location.origin + '/ekranas/${screen.id}${sideName ? '-' + sideName.toLowerCase() : ''}'); this.style.background='#10b981'; setTimeout(() => this.style.background='rgba(0,0,0,0.8)', 1000);" 
                  style="position: absolute; top: 10px; right: 10px; width: 28px; height: 28px; background: rgba(0,0,0,0.8); color: white; border: none; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000; transition: all 0.2s ease;"
                  title="Kopijuoti URL">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
        
        <!-- Card -->
        <div style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
          <!-- Header -->
          <header>
            <h1 style="font-weight: 700; font-size: 18px; margin: 0; color: #111827;">${fullName}</h1>
            <p style="color: #6b7280; margin: 4px 0 0 0; font-size: 14px;">${screen.address}</p>
          </header>
          
          <!-- Specs -->
          <div style="border-top: 1px solid #e5e7eb; padding-top: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px;">
              <span style="color: #6b7280;">Dydis</span>
              <span style="font-weight: 500; color: #111827;">${screen.size || '8x4'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px;">
              <span style="color: #6b7280;">Raiška</span>
              <span style="font-weight: 500; color: #111827;">${screen.resolution || '1152x576'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px;">
              <span style="color: #6b7280;">Srautas</span>
              <span style="font-weight: 500; color: #111827;">${screen.traffic || '300.258'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 14px;">
              <span style="color: #6b7280;">Kaina</span>
              <span style="font-weight: 500; color: #111827;">${screen.price ? `${screen.price} EUR` : '70 EUR'}</span>
            </div>
          </div>
          
          <!-- Button -->
          <div style="display: flex; justify-content: center; padding-top: 8px;">
            <button onclick="window.selectScreen('${fullName}')"
                     style="appearance: none; border: 1px solid #d1d5db; background: #f9fafb; padding: 8px 16px; border-radius: 8px; font-weight: 500; cursor: pointer; font-size: 14px; color: #4b5563; transition: background-color 0.2s;">
              ${selectedScreens && selectedScreens.includes(fullName) ? '✓ Pridėtas' : '+ Pridėti'}
            </button>
          </div>
        </div>
      </div>
    `;
  };

  // Desktop popup template (simplified)
  const getDesktopPopupHTML = (screen: LEDScreen, sideName: string = '') => {
    const fullName = sideName ? `${screen.name} - ${sideName}` : screen.name;
    return `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; width: 400px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">
        <!-- Photo -->
        <div style="width: 100%; height: 250px; position: relative; background: #ddd; overflow: hidden;">
          <img src="${screen.image_url}" alt="${fullName}"
               style="width: 100%; height: 100%; object-fit: cover;"/>
          
          <!-- Copy URL Button -->
          <button onclick="navigator.clipboard.writeText(window.location.origin + '/ekranas/${screen.id}${sideName ? '-' + sideName.toLowerCase() : ''}'); this.style.background='#10b981'; setTimeout(() => this.style.background='rgba(0,0,0,0.8)', 1000);" 
                  style="position: absolute; top: 15px; right: 15px; width: 32px; height: 32px; background: rgba(0,0,0,0.8); color: white; border: none; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000; transition: all 0.2s ease;"
                  title="Kopijuoti URL">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
        
        <!-- Card -->
        <div style="padding: 20px; display: flex; flex-direction: column; gap: 16px;">
          <!-- Header -->
          <header>
            <h1 style="font-weight: 700; font-size: 20px; margin: 0; color: #111827;">${fullName}</h1>
            <p style="color: #6b7280; margin: 4px 0 0 0; font-size: 16px;">${screen.address}</p>
          </header>
          
          <!-- Specs -->
          <div style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 16px;">
              <span style="color: #6b7280;">Dydis</span>
              <span style="font-weight: 500; color: #111827;">${screen.size || '8x4'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 16px;">
              <span style="color: #6b7280;">Raiška</span>
              <span style="font-weight: 500; color: #111827;">${screen.resolution || '1152x576'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 16px;">
              <span style="color: #6b7280;">Srautas</span>
              <span style="font-weight: 500; color: #111827;">${screen.traffic || '300.258'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; font-size: 16px;">
              <span style="color: #6b7280;">Kaina</span>
              <span style="font-weight: 500; color: #111827;">${screen.price ? `${screen.price} EUR` : '70 EUR'}</span>
            </div>
          </div>
          
          <!-- Button -->
          <div style="display: flex; justify-content: center; padding-top: 8px;">
            <button onclick="window.selectScreen('${fullName}')"
                     style="appearance: none; border: 1px solid #d1d5db; background: #f9fafb; padding: 10px 20px; border-radius: 8px; font-weight: 500; cursor: pointer; font-size: 16px; color: #4b5563; transition: background-color 0.2s;">
              ${selectedScreens && selectedScreens.includes(fullName) ? '✓ Pridėtas' : '+ Pridėti'}
            </button>
          </div>
        </div>
      </div>
    `;
  };

  useEffect(() => {
    if (loading || error) return;
    
    const initMap = () => {
      if (!mapRef.current || typeof window === 'undefined') return;

      const L = (window as unknown as { L: any }).L;
      if (!L) return;

      // Remove existing map if any
      if ((window as unknown as { mapInstance: any }).mapInstance) {
        (window as unknown as { mapInstance: any }).mapInstance.remove();
      }

      // Initialize map centered on Lithuania
      const map = L.map(mapRef.current).setView([55.1694, 23.8813], isMobile ? 6 : 7);
      (window as unknown as { mapInstance: any }).mapInstance = map;
      
      // Global function to show popup by screen ID
      (window as any).showMapPopup = (screenId: string) => {
        const screen = ledScreens.find(s => s.id === screenId);
        if (screen) {
          // Find the marker for this screen and open its popup
          map.eachLayer((layer: any) => {
            if (layer instanceof (window as any).L.Marker) {
              const latLng = layer.getLatLng();
              if (Math.abs(latLng.lat - screen.coordinates[0]) < 0.0001 && 
                  Math.abs(latLng.lng - screen.coordinates[1]) < 0.0001) {
                layer.openPopup();
              }
            }
          });
        }
      };

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Filter screens based on selected city
      const filteredScreens = ledScreens.filter(screen => {
        if (selectedCity && selectedCity !== 'Visi') {
          return screen.city === selectedCity;
        }
        return true;
      });

      // Add markers for filtered screens
      filteredScreens.forEach((screen) => {
        const isSelected = selectedScreens && selectedScreens.includes(screen.name);
        
        if (screen.is_double_sided) {
          // Create two markers for double-sided screens
          const leftMarker = L.marker([screen.coordinates[0], screen.coordinates[1]], {
            icon: L.divIcon({
              className: 'led-screen-marker',
              html: `
                <div style="
                  width: 33px; 
                  height: 33px; 
                  position: relative;
                  display: flex; 
                  align-items: center; 
                  justify-content: center;
                  transform: translateX(-19px);
                ">
                  <div style="
                    width: 33px; 
                    height: 33px; 
                    background: ${isSelected ? '#10b981' : '#2563eb'}; 
                    border: 3px solid white; 
                    border-radius: 50%; 
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    position: absolute;
                  "></div>
                  <div style="
                    width: 9px; 
                    height: 9px; 
                    background: white; 
                    border-radius: 50%; 
                    position: absolute;
                    z-index: 1;
                  "></div>
                </div>
              `,
              iconSize: [33, 33],
              iconAnchor: [16.5, 16.5],
              popupAnchor: [0, -16.5]
            })
          })
            .addTo(map)
            .bindPopup(isMobile ? getMobilePopupHTML(screen, 'Šiaurė') : getDesktopPopupHTML(screen, 'Šiaurė'));

          const rightMarker = L.marker([screen.coordinates[0], screen.coordinates[1]], {
            icon: L.divIcon({
              className: 'led-screen-marker',
              html: `
                <div style="
                  width: 33px; 
                  height: 33px; 
                  position: relative;
                  display: flex; 
                  align-items: center; 
                  justify-content: center;
                  transform: translateX(19px);
                ">
                  <div style="
                    width: 33px; 
                    height: 33px; 
                    background: ${isSelected ? '#10b981' : '#2563eb'}; 
                    border: 3px solid white; 
                    border-radius: 50%; 
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    position: absolute;
                  "></div>
                  <div style="
                    width: 9px; 
                    height: 9px; 
                    background: white; 
                    border-radius: 50%; 
                    position: absolute;
                    z-index: 1;
                  "></div>
                </div>
              `,
              iconSize: [33, 33],
              iconAnchor: [16.5, 16.5],
              popupAnchor: [0, -16.5]
            })
          })
            .addTo(map)
            .bindPopup(isMobile ? getMobilePopupHTML(screen, 'Pietūs') : getDesktopPopupHTML(screen, 'Pietūs'));
        } else {
          // Single marker for regular screens
          const marker = L.marker([screen.coordinates[0], screen.coordinates[1]], {
            icon: L.divIcon({
              className: 'led-screen-marker',
              html: `
                <div style="
                  width: ${screen.is_viaduct ? '50px' : '33px'}; 
                  height: ${screen.is_viaduct ? '20px' : '33px'}; 
                  position: relative;
                  display: flex; 
                  align-items: center; 
                  justify-content: center;
                ">
                  <div style="
                    width: ${screen.is_viaduct ? '50px' : '33px'}; 
                    height: ${screen.is_viaduct ? '20px' : '33px'}; 
                    background: ${isSelected ? '#10b981' : '#2563eb'}; 
                    border: 3px solid white; 
                    border-radius: ${screen.is_viaduct ? '10px' : '50%'}; 
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    position: absolute;
                  "></div>
                  <div style="
                    width: ${screen.is_viaduct ? '20px' : '9px'}; 
                    height: ${screen.is_viaduct ? '8px' : '9px'}; 
                    background: white; 
                    border-radius: ${screen.is_viaduct ? '4px' : '50%'}; 
                    position: absolute;
                    z-index: 1;
                  "></div>
                </div>
              `,
              iconSize: screen.is_viaduct ? [50, 20] : [33, 33],
              iconAnchor: screen.is_viaduct ? [25, 10] : [16.5, 16.5],
              popupAnchor: [0, screen.is_viaduct ? -10 : -16.5]
            })
          })
            .addTo(map)
            .bindPopup(isMobile ? getMobilePopupHTML(screen) : getDesktopPopupHTML(screen));
        }
      });

      // Fit map to show all markers
      if (filteredScreens.length > 0) {
        const group = new L.featureGroup();
        filteredScreens.forEach(screen => {
          if (screen.is_double_sided) {
            group.addLayer(L.marker([screen.coordinates[0], screen.coordinates[1]]));
          } else {
            group.addLayer(L.marker([screen.coordinates[0], screen.coordinates[1]]));
          }
        });
        map.fitBounds(group.getBounds().pad(0.1));
      }
    };

    // Load Leaflet CSS and JS
    const loadLeaflet = () => {
      // Load CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      cssLink.crossOrigin = '';
      document.head.appendChild(cssLink);

      // Load JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = initMap;
      document.head.appendChild(script);
    };

    if (!(window as any).L) {
      loadLeaflet();
    } else {
      initMap();
    }

    return () => {
      if ((window as any).mapInstance) {
        (window as any).mapInstance.remove();
        (window as any).mapInstance = undefined;
      }
    };
  }, [loading, error, ledScreens, selectedCity, selectedScreens, isMobile]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Kraunama...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
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
    <div className="w-full h-screen flex flex-col">
      {/* Main Sidebar - Horizontal */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-lg font-bold text-gray-900">Piksel</div>
            <div className="text-sm text-gray-500">LED ekranai</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
              Paslaugos
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
              Kontaktai
            </button>
          </div>
        </div>
      </div>

      {/* Additional Sidebar - Horizontal */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-sm font-medium text-gray-700">Miestai:</div>
          {ledScreens && Object.keys(ledScreens.reduce((acc, screen) => {
            if (!acc[screen.city]) acc[screen.city] = true;
            return acc;
          }, {} as {[key: string]: boolean})).map(city => (
            <button
              key={city}
              onClick={() => onCityChange && onCityChange(city)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedCity === city 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container - Takes remaining space */}
      <div ref={mapRef} className="flex-1 relative">
        {/* Filter Bar - Only show when screens are selected */}
        {(selectedScreens && selectedScreens.length > 0) && (
          <div className="absolute top-4 left-4 right-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-sm font-medium text-gray-700">Pasirinkite:</div>
              {screenCities && Object.keys(screenCities).length > 0 && (
                <>
                  {Object.entries(screenCities).reduce((acc, [screenName, city]) => {
                    if (!acc.find(([_, c]) => c === city)) {
                      acc.push([city, city]);
                    }
                    return acc;
                  }, [] as [string, string][]).map(([city, _]) => (
                    <div key={city} className="flex items-center gap-2">
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {city}
                      </div>
                      {selectedScreens && selectedScreens
                        .filter(screen => screenCities[screen] === city)
                        .map((screen, index) => (
                          <div key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                            {screen}
                            <button 
                              onClick={() => onSelectScreen && onSelectScreen(screen)}
                              className="text-green-600 hover:text-green-800 text-sm font-bold ml-1"
                              title="Išimti ekraną"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                    </div>
                  ))}
                </>
              )}
              <button 
                onClick={onClearFilter}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ×
              </button>
            </div>
            
            {/* Date Range Mockup - Only show when screens are selected */}
            {selectedScreens && selectedScreens.length > 0 && (
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <div className="text-sm font-medium text-gray-700">Reklamos periodas:</div>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={selectedDateRange?.from || ''}
                    onChange={(e) => onDateRangeChange && onDateRangeChange(e.target.value, selectedDateRange?.to || '')}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nuo"
                  />
                  <span className="text-gray-500 text-sm">iki</span>
                  <input
                    type="date"
                    value={selectedDateRange?.to || ''}
                    onChange={(e) => onDateRangeChange && onDateRangeChange(selectedDateRange?.from || '', e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Iki"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
