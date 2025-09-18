'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { LEDScreen } from '@/lib/supabase';
import { useLEDScreens } from '@/hooks/useLEDScreens';
import ResponsiveImage from './ResponsiveImage';

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

export default function Map({ selectedCity, selectedScreens: propSelectedScreens, screenCities: propScreenCities, selectedDateRange: propSelectedDateRange, onClearFilter, onSelectScreen, onDateRangeChange, onCityChange }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { screens: ledScreens, loading, error } = useLEDScreens();
  
  // Local state for mobile
  const [selectedScreens, setSelectedScreens] = useState<string[]>(propSelectedScreens || []);
  const [screenCities, setScreenCities] = useState<{[screenName: string]: string}>(propScreenCities || {});
  const [fromDate, setFromDate] = useState<string>(propSelectedDateRange?.from || '');
  const [toDate, setToDate] = useState<string>(propSelectedDateRange?.to || '');
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  
  // Check if mobile
  const [isMobile, setIsMobile] = useState(false);
  
  // Handle screen selection
  const handleSelectScreen = (screenName: string) => {
    if (selectedScreens.includes(screenName)) {
      // Remove screen
      setSelectedScreens(prev => prev.filter(s => s !== screenName));
      setScreenCities(prev => {
        const newScreenCities = { ...prev };
        delete newScreenCities[screenName];
        return newScreenCities;
      });
    } else {
      // Add screen
      setSelectedScreens(prev => [...prev, screenName]);
      setScreenCities(prev => ({
        ...prev,
        [screenName]: selectedCity
      }));
    }
  };

  // Handle date range change
  const handleDateRangeChange = (from: string, to: string) => {
    const newRange = { 
      from: from || propSelectedDateRange?.from || '', 
      to: to || propSelectedDateRange?.to || '' 
    };
    setFromDate(newRange.from);
    setToDate(newRange.to);
    if (onDateRangeChange) {
      onDateRangeChange(newRange.from, newRange.to);
    }
    
    // Show inquiry form when end date is selected
    if (newRange.to) {
      setShowInquiryForm(true);
    }
  };

  // Clear all filters
  const handleClearFilter = () => {
    setSelectedScreens([]);
    setScreenCities({});
    setFromDate('');
    setToDate('');
    setShowInquiryForm(false);
    if (onCityChange) {
      onCityChange('Vilnius');
    }
    if (onClearFilter) {
      onClearFilter();
    }
  };
  
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        const mediaQuery = window.matchMedia('(max-width: 767px)');
        setIsMobile(mediaQuery.matches);
      }
    };
    
    checkMobile();
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(max-width: 767px)');
      mediaQuery.addEventListener('change', checkMobile);
      return () => mediaQuery.removeEventListener('change', checkMobile);
    }
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
          
          ${screen.is_viaduct ? `
          <!-- Package Badge -->
          <div style="
            position: absolute;
            top: 10px;
            left: 10px;
            background: #f59e0b;
            color: white;
            font-size: 11px;
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 6px;
            white-space: nowrap;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            z-index: 100;
          ">Parduodamas tik paketas</div>
          ` : ''}
          
          <!-- Copy URL Button -->
          <button onclick="navigator.clipboard.writeText(window.location.origin + '/' + '${screen.city}'.toLowerCase().replace(/[ąčęėįšųūž]/g, (m) => ({'ą':'a','č':'c','ę':'e','ė':'e','į':'i','š':'s','ų':'u','ū':'u','ž':'z'}[m] || m)) + '/' + '${screen.slug}'.trim().replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() + '${sideName ? '-' + sideName.toLowerCase() : ''}''); this.style.background='#10b981'; setTimeout(() => this.style.background='rgba(0,0,0,0.8)', 1000);" 
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
          
          ${screen.is_viaduct ? `
          <!-- Package Badge -->
          <div style="
            position: absolute;
            top: 15px;
            left: 15px;
            background: #f59e0b;
            color: white;
            font-size: 12px;
            font-weight: bold;
            padding: 6px 12px;
            border-radius: 8px;
            white-space: nowrap;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            z-index: 100;
          ">Parduodamas tik paketas</div>
          ` : ''}
          
          <!-- Copy URL Button -->
          <button onclick="navigator.clipboard.writeText(window.location.origin + '/' + '${screen.city}'.toLowerCase().replace(/[ąčęėįšųūž]/g, (m) => ({'ą':'a','č':'c','ę':'e','ė':'e','į':'i','š':'s','ų':'u','ū':'u','ž':'z'}[m] || m)) + '/' + '${screen.slug}'.trim().replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() + '${sideName ? '-' + sideName.toLowerCase() : ''}''); this.style.background='#10b981'; setTimeout(() => this.style.background='rgba(0,0,0,0.8)', 1000);" 
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

      // Add window function for screen selection
      (window as any).selectScreen = (screenName: string) => {
        if (onSelectScreen) {
          onSelectScreen(screenName);
        }
      };

      // Add function to hide cards and show popup
      (window as any).scrollToMapAndShowPopup = (screenId: string) => {
        // Find the screen first
        const screen = ledScreens?.find(s => s.id === screenId);
        if (screen && map) {
          // Hide the screen cards section
          const cardsSection = document.querySelector('[data-screen-cards]');
          if (cardsSection) {
            (cardsSection as HTMLElement).style.display = 'none';
          }
          
          // Show popup immediately
          const popupContent = `
            <div style="text-align: center; min-width: 200px;">
              <div style="margin-bottom: 12px;">
                <img src="${screen.image_url}" alt="${screen.name}" 
                     style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;">
              </div>
              <h3 style="font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 8px;">
                ${screen.name}
              </h3>
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
                ${screen.address}
              </p>
              <div style="display: flex; justify-content: center; padding-top: 8px;">
                <button onclick="window.selectScreen('${screen.name}')"
                         style="appearance: none; border: 1px solid #d1d5db; background: #f9fafb; padding: 8px 16px; border-radius: 8px; font-weight: 500; cursor: pointer; font-size: 14px; color: #4b5563; transition: background-color 0.2s;">
                  ${selectedScreens && selectedScreens.includes(screen.name) ? '✓ Pridėtas' : '+ Pridėti'}
                </button>
              </div>
            </div>
          `;
          
          // Center map on the screen with higher zoom to show marker in center
          map.setView([screen.coordinates[0], screen.coordinates[1]], 15);
          
          // Find and open popup on existing marker
          map.eachLayer((layer: any) => {
            if (layer instanceof L.Marker) {
              const markerLatLng = layer.getLatLng();
              const screenLatLng = L.latLng(screen.coordinates[0], screen.coordinates[1]);
              
              // Check if this marker is close to our screen coordinates
              if (markerLatLng.distanceTo(screenLatLng) < 10) { // 10 meters tolerance
                layer.bindPopup(popupContent).openPopup();
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
        if (selectedCity === 'Lietuva') {
          return true; // Show all screens for Lithuania
        }
        if (selectedCity === 'Regionai') {
          return !['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys'].includes(screen.city);
        }
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
                    background: ${isSelected ? '#10b981' : (screen.is_viaduct ? '#8b5cf6' : '#2563eb')}; 
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
                    background: ${isSelected ? '#10b981' : (screen.is_viaduct ? '#8b5cf6' : '#2563eb')}; 
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
                    background: ${isSelected ? '#10b981' : (screen.is_viaduct ? '#8b5cf6' : '#2563eb')}; 
                    border: 3px solid white; 
                    border-radius: ${screen.is_viaduct ? '10px' : '50%'}; 
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    position: absolute;
                  "></div>
                  <div style="
                    width: ${screen.is_viaduct ? '6px' : '9px'}; 
                    height: ${screen.is_viaduct ? '6px' : '9px'}; 
                    background: white; 
                    border-radius: 50%; 
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
    <div style={{ 
      width: '100vw', 
      maxWidth: '100vw',
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#f0f0f0',
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden',
      zIndex: 1000
    }}>
      
      {/* Main Sidebar - Horizontal */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb', 
        padding: '24px 32px',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src="/Piksel-logo-black-2023.png" 
              alt="Piksel Logo" 
              style={{ height: '22px', width: 'auto' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={() => setShowHamburgerMenu(true)}
              style={{ 
                padding: '8px', 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                borderRadius: '11px', 
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px'
              }}
            >
              ☰
            </button>
            <button 
              onClick={() => setShowContactPopup(true)}
              style={{ 
                padding: '8px', 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                borderRadius: '11px', 
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px'
              }}
            >
              i
            </button>
          </div>
        </div>
      </div>

      {/* Contact Popup */}
      {showContactPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '20px',
            maxWidth: '280px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e5e7eb',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <img 
                src="/Piksel-logo-black-2023.png" 
                alt="Piksel Logo" 
                style={{ height: '22px', width: 'auto' }}
              />
              <button
                onClick={() => setShowContactPopup(false)}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  fontSize: '18px',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '0',
                  borderRadius: '8px',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#e5e7eb';
                  e.currentTarget.style.color = '#374151';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#f3f4f6';
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Phone */}
              <a 
                href="tel:+37069066633"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: 'white',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  📞
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>Telefonas</div>
                  <div style={{ fontSize: '16px', fontWeight: '500' }}>+370 690 666 33</div>
                </div>
              </a>
              
              {/* Email */}
              <a 
                href="mailto:info@piksel.lt"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: '#10b981',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: 'white',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#10b981';
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  ✉️
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>El. paštas</div>
                  <div style={{ fontSize: '16px', fontWeight: '500' }}>info@piksel.lt</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Additional Sidebar - Horizontal */}
      <div style={{ 
        backgroundColor: '#f9fafb', 
        borderBottom: '1px solid #e5e7eb', 
        padding: '18px 16px',
        flexShrink: 0
      }}>
        <div className="city-buttons-container" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          overflowX: 'auto',
          paddingBottom: '4px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}>
          {['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys', 'Regionai', 'Reikalavimai klipams', 'DUK'].map(city => (
            <button
              key={city}
              onClick={() => {
                if (city === 'Reikalavimai klipams') {
                  window.location.href = '/klipai-mobile';
                } else if (city === 'DUK') {
                  window.location.href = '/duk-mobile';
                } else {
                  if (onCityChange) {
                    onCityChange(city);
                  }
                }
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: '500',
                backgroundColor: selectedCity === city ? '#3b82f6' : 'white',
                color: selectedCity === city ? 'white' : '#374151',
                border: selectedCity === city ? 'none' : '1px solid #d1d5db',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {city}
            </button>
          ))}
        </div>
        </div>
        
        {/* Filter Bar - Show when screens are selected */}
        {selectedScreens && selectedScreens.length > 0 && (
          <div style={{
            backgroundColor: '#ebe7e2',
            borderBottom: '1px solid #e5e7eb',
            padding: '16px 16px',
            flexShrink: 0,
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '100vw'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              overflowX: 'auto', 
              overflowY: 'hidden',
              paddingBottom: '4px', 
              marginBottom: '8px',
              width: '100%',
              maxWidth: '100%',
              minHeight: '40px',
              maxHeight: '40px',
              flexWrap: 'nowrap'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', flexShrink: 0 }}>Pasirinkta:</div>
              {screenCities && Object.keys(screenCities).length > 0 && (
                <>
                  {(() => {
                    const allBadges: JSX.Element[] = [];
                    const cityGroups = Object.entries(screenCities).reduce((acc, [screenName, city]) => {
                      if (!acc.find(([_, c]) => c === city)) {
                        acc.push([city, city]);
                      }
                      return acc;
                    }, [] as [string, string][]);
                    
                    const maxBadges = 3; // Max 3 badge'ai
                    
                    for (const [city, _] of cityGroups) {
                      if (allBadges.length >= maxBadges) break;
                      
                      const cityScreens = selectedScreens?.filter(screen => screenCities[screen] === city) || [];
                      
                      // Miesto badge'as
                      if (allBadges.length < maxBadges) {
                        allBadges.push(
                          <div key={`city-${city}`} style={{
                            backgroundColor: '#bfdbfe',
                            color: '#1e3a8a',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '500',
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                          }}>
                            {city}
                          </div>
                        );
                      }
                      
                      // Ekranų badge'ai
                      for (let i = 0; i < cityScreens.length && allBadges.length < maxBadges; i++) {
                        const screen = cityScreens[i];
                        allBadges.push(
                          <div key={`screen-${screen}`} style={{
                            backgroundColor: '#dcfce7',
                            color: '#166534',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                          }}>
                            {screen}
                            <button
                              onClick={() => handleSelectScreen(screen)}
                              style={{
                                color: '#16a34a',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0',
                                marginLeft: '4px'
                              }}
                              title="Išimti ekraną"
                            >
                              ×
                            </button>
                          </div>
                        );
                      }
                    }
                    
                    // Pridėti "+X" badge'ą, jei yra daugiau ekranų
                    const totalScreens = selectedScreens?.length || 0;
                    if (totalScreens > maxBadges) {
                      allBadges.push(
                        <div key="more-badge" style={{
                          backgroundColor: '#f3f4f6',
                          color: '#6b7280',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500',
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}>
                          +{totalScreens - maxBadges}
                        </div>
                      );
                    }
                    
                    return allBadges;
                  })()}
                </>
              )}
              <button
                onClick={handleClearFilter}
                style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  background: 'black',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  padding: '0',
                  marginLeft: 'auto',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                ×
              </button>
            </div>

            {/* Date Range - Only show when screens are selected */}
            {selectedScreens && selectedScreens.length > 0 && (
              <div style={{ paddingTop: '8px', borderTop: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Periodas:</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    key="mobile-from-date"
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      const newFromDate = e.target.value;
                      console.log('Mobile From date changed:', newFromDate);
                      setFromDate(newFromDate);
                      if (onDateRangeChange) {
                        onDateRangeChange(newFromDate, toDate);
                      }
                    }}
                    style={{
                      flex: 1,
                      minWidth: '120px',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      color: '#111827',
                      backgroundColor: '#f7f4f0'
                    }}
                  />
                  <span style={{ color: '#6b7280', fontSize: '12px', flexShrink: 0 }}>iki</span>
                  <input
                    key="mobile-to-date"
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      const newToDate = e.target.value;
                      console.log('Mobile To date changed:', newToDate);
                      setToDate(newToDate);
                      if (onDateRangeChange) {
                        onDateRangeChange(fromDate, newToDate);
                      }
                      if (newToDate) {
                        setShowInquiryForm(true);
                      }
                    }}
                    min={fromDate || undefined}
                    style={{
                      flex: 1,
                      minWidth: '120px',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      color: '#111827',
                      backgroundColor: '#f7f4f0'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Inquiry Form - Show when end date is selected */}
        {showInquiryForm && toDate && (
          <div style={{
            backgroundColor: 'white',
            borderBottom: '1px solid #e5e7eb',
            padding: '16px',
            flexShrink: 0
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
              Užklausos forma
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="Jūsų vardas"
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <input
                type="email"
                placeholder="El. paštas"
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <input
                type="tel"
                placeholder="Telefono numeris"
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <textarea
                placeholder="Papildoma informacija"
                rows={3}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
              <button
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Siųsti užklausą
              </button>
            </div>
          </div>
        )}
        
        {/* Screen Cards - Show when city is selected */}
        {selectedCity && (
        <div data-screen-cards style={{ 
          backgroundColor: 'white', 
          padding: '12px 16px',
          flex: 1,
          position: 'relative',
          zIndex: 10,
          minHeight: '200px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: 'calc(100vh - 200px)', paddingBottom: '8px' }}>
            {ledScreens && ledScreens
              .filter(screen => screen.city === selectedCity)
              .map(screen => (
                <div key={screen.slug} style={{ 
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  padding: '16px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  width: '100%'
                }}>
                  {/* Screen Image */}
                  <div style={{ marginBottom: '12px' }}>
                    <ResponsiveImage
                      desktopSrc={screen.image_url}
                      mobileSrc={screen.mobile_image_url}
                      alt={screen.name}
                      width={300}
                      height={176}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Screen Info */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                      {screen.name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>📍</span>
                        <span style={{ fontWeight: '500' }}>Adresas:</span>
                      </div>
                      <p style={{ color: '#374151', marginLeft: '16px' }}>{screen.address}</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleSelectScreen(screen.name)}
                      style={{
                        backgroundColor: selectedScreens.includes(screen.name) ? '#f0fdf4' : '#f9fafb',
                        color: selectedScreens.includes(screen.name) ? '#16a34a' : '#6b7280',
                        border: selectedScreens.includes(screen.name) ? '1px solid #16a34a' : '1px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>
                        {selectedScreens.includes(screen.name) ? '✓' : '+'}
                      </span>
                      {selectedScreens.includes(screen.name) ? 'Pridėtas' : 'Skaičiuoti'}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Hamburger Menu */}
      {showHamburgerMenu && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '320px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <img 
                src="/Piksel-logo-black-2023.png" 
                alt="Piksel Logo" 
                style={{ height: '22px', width: 'auto' }}
              />
              <button
                onClick={() => setShowHamburgerMenu(false)}
                style={{
                  background: 'rgba(107, 114, 128, 0.1)',
                  border: 'none',
                  fontSize: '20px',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                ×
              </button>
            </div>

            {/* Menu Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link 
                href="/klipai-mobile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#374151',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onClick={() => setShowHamburgerMenu(false)}
              >
                <span>📋</span>
                <span>Reikalavimai klipams</span>
              </Link>
              <Link 
                href="/duk-mobile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#374151',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onClick={() => setShowHamburgerMenu(false)}
              >
                <span>❓</span>
                <span>DUK</span>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
