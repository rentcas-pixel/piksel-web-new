'use client';

import { useEffect, useRef, useState } from 'react';
import { LEDScreen } from '@/lib/supabase';
import { useLEDScreens } from '@/hooks/useLEDScreens';
import MapMobile from './MapMobile';

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
  // Check if mobile
  const [isMobile, setIsMobile] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const { screens: ledScreens, loading, error } = useLEDScreens();

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
      const map = L.map(mapRef.current).setView([55.1694, 23.8813], 7);
      (window as unknown as { mapInstance: any }).mapInstance = map;
      
      // Global function to show popup by screen ID
      (window as any).showMapPopup = (screenId: string) => {
        const screen = ledScreens.find(s => s.id === screenId);
        if (screen) {
          // Center the map on the screen location first
          map.setView([screen.coordinates[0], screen.coordinates[1]], 15);
          
          // Wait a bit for the map to center, then find and open popup
          setTimeout(() => {
            map.eachLayer((layer: any) => {
              if (layer instanceof (window as any).L.Marker) {
                const latLng = layer.getLatLng();
                if (Math.abs(latLng.lat - screen.coordinates[0]) < 0.0001 && 
                    Math.abs(latLng.lng - screen.coordinates[1]) < 0.0001) {
                  layer.openPopup();
                }
              }
            });
          }, 300);
        }
      };


      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Filter screens by selected city
      const filteredScreens = selectedCity === 'Regionai' 
        ? ledScreens.filter(screen => !['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys'].includes(screen.city))
        : ledScreens.filter(screen => screen.city === selectedCity);

      // Create custom LED screen icon function
      const createLedScreenIcon = (isSelected: boolean, hasLastMinute: boolean, lastMinuteDate?: string, isDoubleSided?: boolean, isViaduct?: boolean) => L.divIcon({
        className: 'led-screen-marker',
        html: `
          <div style="
            width: ${isViaduct ? '50px' : '33px'}; 
            height: ${isViaduct ? '20px' : '33px'}; 
            position: relative;
            display: flex; 
            align-items: center; 
            justify-content: center;
          ">
            <!-- Outer shape - Round for normal, Pill for viaduct -->
            <div style="
              width: ${isViaduct ? '50px' : '33px'}; 
              height: ${isViaduct ? '20px' : '33px'}; 
              background: ${isSelected ? '#10b981' : '#2563eb'}; 
              border: 3px solid white; 
              border-radius: ${isViaduct ? '10px' : '50%'}; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              position: absolute;
            "></div>
            <!-- Inner shape - Round dot for normal, Pill for viaduct -->
            <div style="
              width: ${isViaduct ? '20px' : '9px'}; 
              height: ${isViaduct ? '8px' : '9px'}; 
              background: white; 
              border-radius: ${isViaduct ? '4px' : '50%'}; 
              position: absolute;
              z-index: 1;
            "></div>
            ${hasLastMinute ? `
            <!-- Last Minute Badge -->
            <div style="
              position: absolute;
              top: 50%;
              right: -85px;
              transform: translateY(-50%);
              background: #ef4444;
              color: white;
              font-size: 10px;
              font-weight: bold;
              padding: 3px 5px;
              border-radius: 5px;
              white-space: nowrap;
              box-shadow: 0 1px 3px rgba(0,0,0,0.3);
              z-index: 10;
              animation: pulse 2s infinite;
            ">LAST MINUTE</div>
            <!-- Date Badge -->
            <div style="
              position: absolute;
              top: 50%;
              right: -85px;
              transform: translateY(calc(-50% + 25px));
              background: #1f2937;
              color: white;
              font-size: 10px;
              font-weight: bold;
              padding: 3px 5px;
              border-radius: 5px;
              white-space: nowrap;
              box-shadow: 0 1px 3px rgba(0,0,0,0.3);
              z-index: 10;
            ">iki ${lastMinuteDate || '2025-08-25'}</div>
            ` : ''}
            ${isDoubleSided ? `
            <!-- Double Sided Badge -->
            <div style="
              position: absolute;
              top: 50%;
              left: -85px;
              transform: translateY(-50%);
              background: #8b5cf6;
              color: white;
              font-size: 10px;
              font-weight: bold;
              padding: 3px 5px;
              border-radius: 5px;
              white-space: nowrap;
              box-shadow: 0 1px 3px rgba(0,0,0,0.3);
              z-index: 10;
            ">DVIPUSIS</div>
            ` : ''}
          </div>
        `,
        iconSize: isViaduct ? [50, 20] : [33, 33],
        iconAnchor: isViaduct ? [25, 10] : [16.5, 16.5],
        popupAnchor: [0, isViaduct ? -10 : -16.5]
      });

      // Add markers for filtered screens
      filteredScreens.forEach((screen) => {
        const isSelected = selectedScreens && selectedScreens.includes(screen.name);
        const hasLastMinute = false; // Removed lastMinute property
        
        if (screen.is_double_sided) {
          console.log('Creating double-sided markers for:', screen.name, 'at coordinates:', screen.coordinates);
          
          // Create custom icons with pixel offset for fixed positioning
          const createOffsetIcon = (isSelected: boolean, hasLastMinute: boolean, lastMinuteDate?: string, offsetX: number = 0, isViaduct?: boolean) => L.divIcon({
            className: 'led-screen-marker',
            html: `
              <div style="
                width: ${isViaduct ? '50px' : '33px'}; 
                height: ${isViaduct ? '20px' : '33px'}; 
                position: relative;
                display: flex; 
                align-items: center; 
                justify-content: center;
                transform: translateX(${offsetX}px);
              ">
                <!-- Outer shape - Round for normal, Pill for viaduct -->
                <div style="
                  width: ${isViaduct ? '50px' : '33px'}; 
                  height: ${isViaduct ? '20px' : '33px'}; 
                  background: ${isSelected ? '#10b981' : '#2563eb'}; 
                  border: 3px solid white; 
                  border-radius: ${isViaduct ? '10px' : '50%'}; 
                  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  position: absolute;
                "></div>
                <!-- Inner shape - Round dot for normal, Pill for viaduct -->
                <div style="
                  width: ${isViaduct ? '20px' : '9px'}; 
                  height: ${isViaduct ? '8px' : '9px'}; 
                  background: white; 
                  border-radius: ${isViaduct ? '4px' : '50%'}; 
                  position: absolute;
                  z-index: 1;
                "></div>
                ${hasLastMinute ? `
                <!-- Last Minute Badge -->
                <div style="
                  position: absolute;
                  top: 50%;
                  right: -85px;
                  transform: translateY(-50%);
                  background: #ef4444;
                  color: white;
                  font-size: 10px;
                  font-weight: bold;
                  padding: 3px 5px;
                  border-radius: 5px;
                  white-space: nowrap;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                  z-index: 10;
                  animation: pulse 2s infinite;
                ">LAST MINUTE</div>
                <!-- Date Badge -->
                <div style="
                  position: absolute;
                  top: 50%;
                  right: -85px;
                  transform: translateY(calc(-50% + 25px));
                  background: #1f2937;
                  color: white;
                  font-size: 10px;
                  font-weight: bold;
                  padding: 3px 5px;
                  border-radius: 5px;
                  white-space: nowrap;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                  z-index: 10;
                ">iki ${lastMinuteDate || '2025-08-25'}</div>
                ` : ''}
              </div>
            `,
            iconSize: isViaduct ? [50, 20] : [33, 33],
            iconAnchor: isViaduct ? [25, 10] : [16.5, 16.5],
            popupAnchor: [0, isViaduct ? -10 : -16.5]
          });
          
          // Left marker (North side) - offset 19px left (half marker width + half gap)
          const leftMarker = L.marker([screen.coordinates[0], screen.coordinates[1]], {
            icon: createOffsetIcon(Boolean(isSelected), false, undefined, -19, Boolean(screen.is_viaduct))
          })
            .addTo(map)
            .bindPopup(`
              <div style="font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; width: 780px; height: 468px; border-radius: 0; overflow: visible; background: transparent; display: flex; gap: -8px; position: relative;">
                <!-- Photo -->
                <div style="width: 468px; height: 468px; position: relative; background: #ddd; border-radius: 9px 0 0 9px !important; overflow: hidden;">
                  <img src="${screen.image_url}" alt="${screen.name} - Šiaurė"
                       style="width: 468px; height: 468px; object-fit: cover;"/>
                  
                  
                  <!-- Copy URL Button -->
                  <button class="copy-tooltip" onclick="navigator.clipboard.writeText(window.location.origin + '/ekranas/${screen.id}-siaure'); this.style.background='#10b981'; setTimeout(() => this.style.background='rgba(0,0,0,0.8)', 1000);" 
                          style="position: absolute; top: 20px; right: 20px; width: 32px; height: 32px; background: rgba(0,0,0,0.8); color: white; border: none; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000; transition: all 0.2s ease;"
                          title="Kopijuoti URL">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                  
                  <!-- Copy Coordinates Button -->
                  <button class="copy-coordinates-tooltip" onclick="navigator.clipboard.writeText('${screen.coordinates[0]}, ${screen.coordinates[1]}'); this.style.background='#10b981'; setTimeout(() => this.style.background='rgba(0,0,0,0.8)', 1000);" 
                          style="position: absolute; top: 62px; right: 20px; width: 32px; height: 32px; background: rgba(0,0,0,0.8); color: white; border: none; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000; transition: all 0.2s ease;"
                          title="Kopijuoti koordinates">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </button>
                </div>
                
                <!-- Card -->
                <div style="width: 270px; height: 468px; background: #ffffff; border-radius: 0 13px 13px 0; box-shadow: 0 13px 31px rgba(0,0,0,0.08); padding: 42px 42px 36px; display: flex; flex-direction: column; gap: 23px;">
                  <!-- Header -->
                  <header>
                    <h1 style="font-weight: 800; font-size: 28px; margin: 0; color: #111827;">${screen.name} - Šiaurė</h1>
                    <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 16px;">${screen.address}</p>
                  </header>
                  
                  <!-- Specs -->
                  <div style="margin-top: 4px; border-top: 1px solid #e5e7eb;">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #e5e7eb; font-size: 16px;">
                      <span style="color: #6b7280;">Dydis</span>
                      <span style="font-weight: 500; color: #111827;">${screen.size || '8x4'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #e5e7eb; font-size: 16px;">
                      <span style="color: #6b7280;">Raiška</span>
                      <span style="font-weight: 500; color: #111827;">${screen.resolution || '1152x576'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #e5e7eb; font-size: 16px;">
                      <span style="color: #6b7280;">Srautas</span>
                      <span style="font-weight: 500; color: #111827;">${screen.traffic || '300.258'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; font-size: 16px;">
                      <span style="color: #6b7280;">Kaina</span>
                      <span style="font-weight: 500; color: #111827;">${screen.price ? `${screen.price} EUR` : '70 EUR'}</span>
                    </div>
                  </div>
                  
                  <!-- Button -->
                  <div style="display: flex; justify-content: center; padding-top: 8px;">
                    <button onclick="window.selectScreen('${screen.name} - Šiaurė')"
                                     style="appearance: none; border: 1px solid #d1d5db; background: #f9fafb; padding: 8px 12px; border-radius: 12px; font-weight: 500; cursor: pointer; font-size: 14px; color: #4b5563; transition: background-color 0.2s;">
                      ${selectedScreens && selectedScreens.includes(screen.name + ' - Šiaurė') ? '✓ Pridėtas' : '+ Pridėti'}
                    </button>
                  </div>
                </div>
                
              </div>
            `);

          // Right marker (South side) - offset 19px right (half marker width + half gap)
          const rightMarker = L.marker([screen.coordinates[0], screen.coordinates[1]], {
            icon: createOffsetIcon(Boolean(isSelected), false, undefined, 19, Boolean(screen.is_viaduct))
          })
            .addTo(map)
            .bindPopup(`
              <div style="font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; width: 780px; height: 468px; border-radius: 0; overflow: visible; background: transparent; display: flex; gap: -8px; position: relative;">
                <!-- Photo -->
                <div style="width: 468px; height: 468px; position: relative; background: #ddd; border-radius: 9px 0 0 9px !important; overflow: hidden;">
                  <img src="${screen.image_url}" alt="${screen.name} - Pietūs"
                       style="width: 468px; height: 468px; object-fit: cover;"/>
                  
                  
                  <!-- Copy URL Button -->
                  <button class="copy-tooltip" onclick="navigator.clipboard.writeText(window.location.origin + '/ekranas/${screen.id}-pietus'); this.style.background='#10b981'; setTimeout(() => this.style.background='rgba(0,0,0,0.8)', 1000);" 
                          style="position: absolute; top: 20px; right: 20px; width: 32px; height: 32px; background: rgba(0,0,0,0.8); color: white; border: none; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000; transition: all 0.2s ease;"
                          title="Kopijuoti URL">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                  
                  <!-- Copy Coordinates Button -->
                  <button class="copy-coordinates-tooltip" onclick="navigator.clipboard.writeText('${screen.coordinates[0]}, ${screen.coordinates[1]}'); this.style.background='#10b981'; setTimeout(() => this.style.background='rgba(0,0,0,0.8)', 1000);" 
                          style="position: absolute; top: 62px; right: 20px; width: 32px; height: 32px; background: rgba(0,0,0,0.8); color: white; border: none; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000; transition: all 0.2s ease;"
                          title="Kopijuoti koordinates">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </button>
                </div>
                
                <!-- Card -->
                <div style="width: 270px; height: 468px; background: #ffffff; border-radius: 0 13px 13px 0; box-shadow: 0 13px 31px rgba(0,0,0,0.08); padding: 42px 42px 36px; display: flex; flex-direction: column; gap: 23px;">
                  <!-- Header -->
                  <header>
                    <h1 style="font-weight: 800; font-size: 28px; margin: 0; color: #111827;">${screen.name} - Pietūs</h1>
                    <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 16px;">${screen.address}</p>
                  </header>
                  
                  <!-- Specs -->
                  <div style="margin-top: 4px; border-top: 1px solid #e5e7eb;">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #e5e7eb; font-size: 16px;">
                      <span style="color: #6b7280;">Dydis</span>
                      <span style="font-weight: 500; color: #111827;">${screen.size || '8x4'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #e5e7eb; font-size: 16px;">
                      <span style="color: #6b7280;">Raiška</span>
                      <span style="font-weight: 500; color: #111827;">${screen.resolution || '1152x576'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #e5e7eb; font-size: 16px;">
                      <span style="color: #6b7280;">Srautas</span>
                      <span style="font-weight: 500; color: #111827;">${screen.traffic || '300.258'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; font-size: 16px;">
                      <span style="color: #6b7280;">Kaina</span>
                      <span style="font-weight: 500; color: #111827;">${screen.price ? `${screen.price} EUR` : '70 EUR'}</span>
                    </div>
                  </div>
                  
                  <!-- Button -->
                  <div style="display: flex; justify-content: center; padding-top: 8px;">
                    <button onclick="window.selectScreen('${screen.name} - Pietūs')"
                                     style="appearance: none; border: 1px solid #d1d5db; background: #f9fafb; padding: 8px 12px; border-radius: 12px; font-weight: 500; cursor: pointer; font-size: 14px; color: #4b5563; transition: background-color 0.2s;">
                      ${selectedScreens && selectedScreens.includes(screen.name + ' - Pietūs') ? '✓ Pridėtas' : '+ Pridėti'}
                    </button>
                  </div>
                </div>
                
              </div>
            `);
        } else {
          // Single marker for regular screens
          const marker = L.marker([screen.coordinates[0], screen.coordinates[1]], {
            icon: createLedScreenIcon(Boolean(isSelected), false, undefined, false, Boolean(screen.is_viaduct))
          })
            .addTo(map)
            .bindPopup(`
              <div style="font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; width: 780px; height: 468px; border-radius: 0; overflow: visible; background: transparent; display: flex; gap: -8px; position: relative;">
                <!-- Photo -->
                <div style="width: 468px; height: 468px; position: relative; background: #ddd; border-radius: 9px 0 0 9px !important; overflow: hidden;">
                  <img src="${screen.image_url}" alt="${screen.name}"
                       style="width: 468px; height: 468px; object-fit: cover;"/>
                  
                  
                  <!-- Copy URL Button -->
                  <button class="copy-tooltip" onclick="navigator.clipboard.writeText(window.location.origin + '/ekranas/${screen.id}'); this.style.background='#10b981'; setTimeout(() => this.style.background='rgba(0,0,0,0.8)', 1000);" 
                          style="position: absolute; top: 20px; right: 20px; width: 32px; height: 32px; background: rgba(0,0,0,0.8); color: white; border: none; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000; transition: all 0.2s ease;"
                          title="Kopijuoti URL">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                  
                  <!-- Copy Coordinates Button -->
                  <button class="copy-coordinates-tooltip" onclick="navigator.clipboard.writeText('${screen.coordinates[0]}, ${screen.coordinates[1]}'); this.style.background='#10b981'; setTimeout(() => this.style.background='rgba(0,0,0,0.8)', 1000);" 
                          style="position: absolute; top: 62px; right: 20px; width: 32px; height: 32px; background: rgba(0,0,0,0.8); color: white; border: none; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000; transition: all 0.2s ease;"
                          title="Kopijuoti koordinates">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </button>
                </div>
                
                <!-- Card -->
                <div style="width: 270px; height: 468px; background: #ffffff; border-radius: 0 13px 13px 0; box-shadow: 0 13px 31px rgba(0,0,0,0.08); padding: 42px 42px 36px; display: flex; flex-direction: column; gap: 23px;">
                  <!-- Header -->
                  <header>
                    <h1 style="font-weight: 800; font-size: 28px; margin: 0; color: #111827;">${screen.name}</h1>
                    <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 16px;">${screen.address}</p>
                  </header>
                  
                  <!-- Specs -->
                  <div style="margin-top: 4px; border-top: 1px solid #e5e7eb;">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #e5e7eb; font-size: 16px;">
                      <span style="color: #6b7280;">Dydis</span>
                      <span style="font-weight: 500; color: #111827;">${screen.size || '8x4'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #e5e7eb; font-size: 16px;">
                      <span style="color: #6b7280;">Raiška</span>
                      <span style="font-weight: 500; color: #111827;">${screen.resolution || '1152x576'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #e5e7eb; font-size: 16px;">
                      <span style="color: #6b7280;">Srautas</span>
                      <span style="font-weight: 500; color: #111827;">${screen.traffic || '300.258'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 0; font-size: 16px;">
                      <span style="color: #6b7280;">Kaina</span>
                      <span style="font-weight: 500; color: #111827;">${screen.price ? `${screen.price} EUR` : '70 EUR'}</span>
                    </div>
                  </div>
                  
                  <!-- Button -->
                  <div style="display: flex; justify-content: center; padding-top: 8px;">
                    <button onclick="window.selectScreen('${screen.name}')"
                                     style="appearance: none; border: 1px solid #d1d5db; background: #f9fafb; padding: 8px 12px; border-radius: 12px; font-weight: 500; cursor: pointer; font-size: 14px; color: #4b5563; transition: background-color 0.2s;">
                      ${selectedScreens && selectedScreens.includes(screen.name) ? '✓ Pridėtas' : '+ Pridėti'}
                    </button>
            </div>
                </div>
                
                <!-- Close Button -->
                <button onclick="this.closest('.leaflet-popup').remove()" 
                        class="custom-close-button">×</button>
          </div>
        `);
        }
      });

      // Fit map to show all markers
      if (filteredScreens.length > 0) {
        const markers: any[] = [];
        filteredScreens.forEach(screen => {
          const isSelected = selectedScreens && selectedScreens.includes(screen.name);
          const hasLastMinute = false; // Removed lastMinute property
          
          // Always create single marker for fitBounds (double-sided screens use single marker with combined icon)
          markers.push(L.marker([screen.coordinates[0], screen.coordinates[1]]));
        });
        
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
      }
    };

      // Add window function for screen selection
      if (typeof window !== 'undefined') {
        (window as any).selectScreen = (screenName: string) => {
          if (onSelectScreen) {
            onSelectScreen(screenName);
          }
        };
        
      }

    // Load Leaflet CSS and JS
      if (typeof window !== 'undefined') {
      // Load CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Add custom CSS for LED screen markers and popups
      if (!document.querySelector('#led-marker-styles')) {
        const style = document.createElement('style');
        style.id = 'led-marker-styles';
        style.textContent = `
          .led-screen-marker {
            background: transparent !important;
            border: none !important;
          }
          .led-screen-marker:hover {
            transform: scale(1.1);
            transition: transform 0.2s ease;
          }
          
          /* Uniform popup styling */
          .leaflet-popup-content-wrapper {
            border-radius: 8px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            padding: 0 !important;
            background: white !important;
          }
          
          .leaflet-popup-content {
            margin: 0 !important;
            padding: 0 !important;
            font-family: Inter, sans-serif !important;
            max-width: 780px !important;
            width: 780px !important;
          }
          
          .leaflet-popup-pane {
            background: transparent !important;
          }
          
          .leaflet-popup {
            background: transparent !important;
            box-shadow: none !important;
          }
          
          .leaflet-popup-content-wrapper {
            background: transparent !important;
            box-shadow: none !important;
          }
          
          .leaflet-popup-tip {
            background: transparent !important;
            box-shadow: none !important;
          }
          
          /* Special styling for double-sided popups */
          .leaflet-popup-content:has(div[style*="display: flex; gap: 5px"]) {
            max-width: 587px !important;
            width: 587px !important;
          }
          
          .leaflet-popup-tip {
            background: white !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          }
          
          /* Info popup positioning - to the right of main popup */
          .info-popup .leaflet-popup-content-wrapper {
            margin-left: 296px !important; /* 291px (popup width) + 5px gap */
          }
          
          .info-popup .leaflet-popup-content {
            width: 291px !important;
            max-width: 291px !important;
          }
          
          /* Hide default close button */
          .leaflet-popup-close-button {
            display: none !important;
          }
          
          /* Style custom close button */
          .custom-close-button {
            position: absolute !important;
            right: 28px !important;
            top: -10px !important;
            width: 30px !important;
            height: 30px !important;
            font-size: 18px !important;
            line-height: 30px !important;
            text-align: center !important;
            background: rgba(0, 0, 0, 0.8) !important;
            border-radius: 50% !important;
            border: none !important;
            color: white !important;
            cursor: pointer !important;
            z-index: 1000 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-weight: bold !important;
          }
          
          .custom-close-button:hover {
            background: rgba(0, 0, 0, 1) !important;
            color: white !important;
            transform: scale(1.1) !important;
            transition: all 0.2s ease !important;
          }
          
          .custom-close-button {
            transition: all 0.2s ease !important;
          }
          
          .custom-close-button:active {
            transform: scale(0.95) !important;
            transition: all 0.1s ease !important;
          }
          
          /* Custom tooltip for copy button */
          .copy-tooltip {
            position: relative;
          }
          
          .copy-tooltip::after {
            content: 'Kopijuoti URL';
            position: absolute;
            top: 50%;
            right: 50px;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 6px 11px;
            border-radius: 12px;
            font-size: 15px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s ease;
            z-index: 1001;
            pointer-events: none;
            border: 1px solid rgba(255,255,255,0.2);
          }
          
          .copy-coordinates-tooltip::after {
            content: 'Kopijuoti koordinates';
            position: absolute;
            top: 50%;
            right: 50px;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 6px 11px;
            border-radius: 12px;
            font-size: 15px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s ease;
            z-index: 1001;
            pointer-events: none;
            border: 1px solid rgba(255,255,255,0.2);
          }
          
          /* Allow tooltip to overflow popup */
          .leaflet-popup-content-wrapper {
            overflow: visible !important;
          }
          
          .leaflet-popup-content {
            overflow: visible !important;
          }
          
          .copy-tooltip:hover::after {
            opacity: 1;
            visibility: visible;
          }
          
          .copy-coordinates-tooltip:hover::after {
            opacity: 1;
            visibility: visible;
          }
        `;
        document.head.appendChild(style);
      }

      // Load JS
      if (!(window as any).L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
      } else {
        initMap();
      }
    }

    return () => {
      if ((window as any).mapInstance) {
        (window as any).mapInstance.remove();
        (window as any).mapInstance = undefined;
      }
    };
  }, [loading, error, ledScreens, selectedCity, selectedScreens, isMobile]);

  // Use mobile component for mobile devices
  if (isMobile) {
    return (
      <MapMobile 
        selectedCity={selectedCity}
        selectedScreens={selectedScreens}
        screenCities={screenCities}
        selectedDateRange={selectedDateRange}
        onClearFilter={onClearFilter}
        onSelectScreen={onSelectScreen}
        onDateRangeChange={onDateRangeChange}
        onCityChange={onCityChange}
      />
    );
  }

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
    <div className="w-full h-screen relative">
      {/* Filter Bar */}
      {(selectedCity || (selectedScreens && selectedScreens.length > 0)) && (
        <div className="absolute top-4 left-[66px] z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3 flex flex-col gap-3">
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
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none"
                />
                <span className="text-gray-500 text-sm">iki</span>
                <input
                  type="date"
                  value={selectedDateRange?.to || ''}
                  onChange={(e) => onDateRangeChange && onDateRangeChange(selectedDateRange?.from || '', e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none"
                />
          </div>
          </div>
          )}
        </div>
      )}
      
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{
          background: '#f8f9fa'
        }}
      />
    </div>
  );
}