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
  
  
  // Detect Chrome browser
  const isChrome = typeof window !== 'undefined' && /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  
  // Local state for date inputs (like in mobile)
  const [fromDate, setFromDate] = useState(selectedDateRange?.from || '');
  const [toDate, setToDate] = useState(selectedDateRange?.to || '');

  // Sync local state with prop
  useEffect(() => {
    setFromDate(selectedDateRange?.from || '');
    setToDate(selectedDateRange?.to || '');
  }, [selectedDateRange]);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        const mediaQuery = window.matchMedia('(max-width: 767px)');
        const isMobileDevice = mediaQuery.matches || window.innerWidth <= 767;
        setIsMobile(isMobileDevice);
        console.log('Mobile detection:', isMobileDevice, 'Window width:', window.innerWidth);
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
      


      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Filter screens by selected city
      const filteredScreens = selectedCity === 'Lietuva'
        ? ledScreens // Show all screens for Lithuania
        : selectedCity === 'Regionai' 
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
              background: ${isSelected ? '#10b981' : (isViaduct ? '#8b5cf6' : '#2563eb')}; 
              border: 3px solid white; 
              border-radius: ${isViaduct ? '10px' : '50%'}; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              position: absolute;
            "></div>
            <!-- Inner shape - White dot -->
            <div style="
              width: ${isViaduct ? '6px' : '9px'}; 
              height: ${isViaduct ? '6px' : '9px'}; 
              background: white; 
              border-radius: 50%; 
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
        const hasLastMinute = screen.is_last_minute || false;
        const lastMinuteDate = screen.last_minute_date;
        
        
        if (screen.is_double_sided) {
          
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
                  background: ${isSelected ? '#10b981' : (isViaduct ? '#8b5cf6' : '#2563eb')}; 
                  border: 3px solid white; 
                  border-radius: ${isViaduct ? '10px' : '50%'}; 
                  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  position: absolute;
                "></div>
                <!-- Inner shape - White dot -->
                <div style="
                  width: ${isViaduct ? '6px' : '9px'}; 
                  height: ${isViaduct ? '6px' : '9px'}; 
                  background: white; 
                  border-radius: 50%; 
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
            icon: createOffsetIcon(Boolean(isSelected), hasLastMinute, lastMinuteDate, -19, Boolean(screen.is_viaduct)),
            screenId: screen.id
          })
            .addTo(map)
            .bindPopup(`
              <div style="font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; width: 780px; height: 468px; border-radius: 0; overflow: visible; background: transparent; display: flex; gap: -8px; position: relative;">
                <!-- Photo -->
                <div style="width: 468px; height: 468px; position: relative; background: #ddd; border-radius: 9px 0 0 9px !important; overflow: hidden;">
                  <img src="${screen.image_url}" alt="${screen.name} - Šiaurė"
                       style="width: 468px; height: 468px; object-fit: cover;"/>
                  
                  <!-- Expand Photo Button -->
                  <button onclick="window.openPhotoModal('${screen.image_url}', '${screen.name} - Šiaurė')" 
                          style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 999; font-size: 28px; font-weight: bold; transition: all 0.3s ease; opacity: 0.8;"
                          onmouseover="this.style.opacity='1'; this.style.background='rgba(0,0,0,0.9)'; this.style.transform='translate(-50%, -50%) scale(1.1)';"
                          onmouseout="this.style.opacity='0.8'; this.style.background='rgba(0,0,0,0.7)'; this.style.transform='translate(-50%, -50%) scale(1)';"
                          title="Išdidinti nuotrauką">
                    +
                  </button>
                  
                  <!-- Copy URL Button -->
                  ${screen.custom_url ? `
                  <button class="copy-url-tooltip" onclick="navigator.clipboard.writeText('${window.location.origin}/#${screen.custom_url}'); this.style.background='#10b981'; setTimeout(() => this.style.background='rgba(0,0,0,0.8)', 1000);" 
                          style="position: absolute; top: 20px; right: 20px; width: 32px; height: 32px; background: rgba(0,0,0,0.8); color: white; border: none; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000; transition: all 0.2s ease;"
                          title="Kopijuoti URL">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                  ` : ''}
                  
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
                      <span style="font-weight: 500; color: #111827;">-</span>
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
            icon: createOffsetIcon(Boolean(isSelected), hasLastMinute, lastMinuteDate, 19, Boolean(screen.is_viaduct)),
            screenId: screen.id
          })
            .addTo(map)
            .bindPopup(`
              <div style="font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; width: 780px; height: 468px; border-radius: 0; overflow: visible; background: transparent; display: flex; gap: -8px; position: relative;">
                <!-- Photo -->
                <div style="width: 468px; height: 468px; position: relative; background: #ddd; border-radius: 9px 0 0 9px !important; overflow: hidden;">
                  <img src="${screen.image_url}" alt="${screen.name} - Pietūs"
                       style="width: 468px; height: 468px; object-fit: cover;"/>
                  
                  <!-- Expand Photo Button -->
                  <button onclick="window.openPhotoModal('${screen.image_url}', '${screen.name} - Pietūs')" 
                          style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 999; font-size: 28px; font-weight: bold; transition: all 0.3s ease; opacity: 0.8;"
                          onmouseover="this.style.opacity='1'; this.style.background='rgba(0,0,0,0.9)'; this.style.transform='translate(-50%, -50%) scale(1.1)';"
                          onmouseout="this.style.opacity='0.8'; this.style.background='rgba(0,0,0,0.7)'; this.style.transform='translate(-50%, -50%) scale(1)';"
                          title="Išdidinti nuotrauką">
                    +
                  </button>
                  
                  <!-- Copy URL Button -->
                  ${screen.custom_url ? `
                  <button class="copy-url-tooltip" onclick="navigator.clipboard.writeText('${window.location.origin}/#${screen.custom_url}'); this.style.background='#10b981'; setTimeout(() => this.style.background='rgba(0,0,0,0.8)', 1000);" 
                          style="position: absolute; top: 20px; right: 20px; width: 32px; height: 32px; background: rgba(0,0,0,0.8); color: white; border: none; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000; transition: all 0.2s ease;"
                          title="Kopijuoti URL">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                  ` : ''}
                  
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
                      <span style="font-weight: 500; color: #111827;">-</span>
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
            icon: createLedScreenIcon(Boolean(isSelected), hasLastMinute, lastMinuteDate, false, Boolean(screen.is_viaduct)),
            screenId: screen.id
          })
            .addTo(map);

          // Add Last Minute badge if applicable
          if (hasLastMinute && lastMinuteDate) {
            L.marker([screen.coordinates[0], screen.coordinates[1]], {
              icon: L.divIcon({
                className: 'last-minute-badge',
                html: `
                  <div style="
                    position: absolute;
                    top: -15px;
                    left: 40px;
                    background: #dc2626;
                    color: white;
                    padding: 3px 6px;
                    border-radius: 3px;
                    font-size: 9px;
                    font-weight: 700;
                    text-transform: uppercase;
                    white-space: nowrap;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    z-index: 1000;
                  ">
                    LAST MINUTE
                  </div>
                `,
                iconSize: [70, 15],
                iconAnchor: [0, 0]
              })
            }).addTo(map);
          }

          marker.bindPopup(`
              <div style="font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; width: 780px; height: 468px; border-radius: 0; overflow: visible; background: transparent; display: flex; gap: -8px; position: relative;">
                <!-- Photo -->
                <div style="width: 468px; height: 468px; position: relative; background: #ddd; border-radius: 9px 0 0 9px !important; overflow: hidden;">
                  <img src="${screen.image_url}" alt="${screen.name}"
                       style="width: 468px; height: 468px; object-fit: cover;"/>
                  
                  <!-- Expand Photo Button -->
                  <button onclick="window.openPhotoModal('${screen.image_url}', '${screen.name}')" 
                          style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 999; font-size: 28px; font-weight: bold; transition: all 0.3s ease; opacity: 0.8;"
                          onmouseover="this.style.opacity='1'; this.style.background='rgba(0,0,0,0.9)'; this.style.transform='translate(-50%, -50%) scale(1.1)';"
                          onmouseout="this.style.opacity='0.8'; this.style.background='rgba(0,0,0,0.7)'; this.style.transform='translate(-50%, -50%) scale(1)';"
                          title="Išdidinti nuotrauką">
                    +
                  </button>
                  
                  <!-- Copy URL Button -->
                  ${screen.custom_url ? `
                  <button class="copy-url-tooltip" onclick="navigator.clipboard.writeText('${window.location.origin}/#${screen.custom_url}'); this.style.background='#10b981'; setTimeout(() => this.style.background='rgba(0,0,0,0.8)', 1000);" 
                          style="position: absolute; top: 20px; right: 20px; width: 32px; height: 32px; background: rgba(0,0,0,0.8); color: white; border: none; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000; transition: all 0.2s ease;"
                          title="Kopijuoti URL">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                  ` : ''}
                  
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
                      <span style="font-weight: 500; color: #111827;">-</span>
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
                <button onclick="this.closest('.leaflet-popup').remove();" 
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
          const hasLastMinute = screen.is_last_minute || false;
          
          // Always create single marker for fitBounds (double-sided screens use single marker with combined icon)
          markers.push(L.marker([screen.coordinates[0], screen.coordinates[1]]));
        });
        
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
      }
      
    };

      // Add window functions for screen selection and photo modal
      if (typeof window !== 'undefined') {
        (window as any).selectScreen = (screenName: string) => {
          if (onSelectScreen) {
            onSelectScreen(screenName);
          }
        };
        
        // Photo modal functions
        (window as any).openPhotoModal = (imageUrl: string, title: string) => {
          // Create modal if it doesn't exist
          let modal = document.getElementById('photo-modal');
          if (!modal) {
            modal = document.createElement('div');
            modal.id = 'photo-modal';
            modal.className = 'photo-modal';
            modal.innerHTML = `
              <div class="photo-modal-content">
                <div class="photo-modal-badge" id="photo-modal-badge"></div>
                <div class="photo-modal-add-badge" id="photo-modal-add-badge" onclick="window.toggleScreenFromModal()"></div>
                <img class="photo-modal-image" id="photo-modal-image" src="" alt="" />
                <button class="photo-modal-close" onclick="window.closePhotoModal()">×</button>
              </div>
            `;
            document.body.appendChild(modal);
            
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
              if (e.target === modal) {
                (window as any).closePhotoModal();
              }
            });
            
            // Close modal with Escape key
            document.addEventListener('keydown', (e) => {
              if (e.key === 'Escape') {
                (window as any).closePhotoModal();
              }
            });
          }
          
          // Set image and title
          const img = document.getElementById('photo-modal-image') as HTMLImageElement;
          const badgeEl = document.getElementById('photo-modal-badge') as HTMLDivElement;
          const addBadgeEl = document.getElementById('photo-modal-add-badge') as HTMLDivElement;
          
          if (img && badgeEl && addBadgeEl) {
            img.src = imageUrl;
            img.alt = title;
            badgeEl.textContent = title;
            
            // Store current screen name for toggle function
            (window as any).currentModalScreen = title;
            
            // Update add badge text based on selection status
            const isSelected = selectedScreens && selectedScreens.includes(title);
            addBadgeEl.textContent = isSelected ? '✓ Pridėtas' : '+ Pridėti';
            addBadgeEl.style.background = isSelected ? 'rgba(34, 197, 94, 0.95)' : 'rgba(59, 130, 246, 0.95)';
            
            // Show modal
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
          }
        };
        
        (window as any).closePhotoModal = () => {
          const modal = document.getElementById('photo-modal');
          if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
          }
        };
        
        (window as any).toggleScreenFromModal = () => {
          const screenName = (window as any).currentModalScreen;
          if (screenName && onSelectScreen) {
            onSelectScreen(screenName);
            // Close modal after adding/removing screen
            (window as any).closePhotoModal();
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

          .copy-url-tooltip::after {
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

          .copy-url-tooltip:hover::after {
            opacity: 1;
            visibility: visible;
          }
          
          /* Photo Modal Styles */
          .photo-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
          }
          
          .photo-modal.show {
            opacity: 1;
            visibility: visible;
          }
          
          .photo-modal-content {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            transform: scale(0.8);
            transition: transform 0.3s ease;
          }
          
          .photo-modal.show .photo-modal-content {
            transform: scale(1);
          }
          
          .photo-modal-image {
            width: 100%;
            height: auto;
            max-width: 90vw;
            max-height: 80vh;
            object-fit: contain;
            display: block;
          }
          
          .photo-modal-badge {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            z-index: 10001;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            width: 200px;
            text-align: center;
            white-space: nowrap;
          }
          
          .photo-modal-add-badge {
            position: absolute;
            top: 83px;
            left: 20px;
            background: rgba(59, 130, 246, 0.95);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            z-index: 10001;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            transition: all 0.2s ease;
            user-select: none;
            width: 200px;
            text-align: center;
            white-space: nowrap;
          }
          
          .photo-modal-add-badge:hover {
            background: rgba(37, 99, 235, 0.95);
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
          }
          
          .photo-modal-add-badge:active {
            transform: translateY(0);
            transition: all 0.1s ease;
          }
          
          .photo-modal-close {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 20px;
            font-weight: bold;
            z-index: 10002;
            transition: all 0.2s ease;
          }
          
          .photo-modal-close:hover {
            background: rgba(0, 0, 0, 1);
            transform: scale(1.1);
          }
          
          .photo-modal-close:active {
            transform: scale(0.95);
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
  }, [loading, error, ledScreens, selectedCity, selectedScreens, isMobile]); // Restore selectedCity for showMapPopup function

  // Use mobile component for mobile devices
  if (isMobile) {
    console.log('Using MapMobile component');
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
        <div className="absolute top-4 left-[66px] z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3 flex flex-col gap-3" style={{ maxWidth: '560px' }}>
          <div className="flex items-center gap-3 overflow-x-auto overflow-y-hidden max-h-12">
            <div className="text-sm font-medium text-gray-700">Filtruoti:</div>
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
                  
                  for (const [city, _] of cityGroups) {
                    const cityScreens = selectedScreens?.filter(screen => screenCities[screen] === city) || [];
                    
                    // Miesto badge'as
                    allBadges.push(
                      <div key={`city-${city}`} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                        {city}
                      </div>
                    );
                    
                    // Visi ekranų badge'ai
                    for (const screen of cityScreens) {
                      allBadges.push(
                        <div key={`screen-${screen}`} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 whitespace-nowrap">
                          {screen}
                          <button 
                            onClick={() => onSelectScreen && onSelectScreen(screen)}
                            className="text-green-600 hover:text-green-800 text-sm font-bold ml-1"
                            title="Išimti ekraną"
                          >
                            ×
                          </button>
                        </div>
                      );
                    }
                  }
                  
                  return allBadges;
                })()}
              </>
            )}
          </div>
          
          {/* Date Range Mockup - Only show when screens are selected */}
          {selectedScreens && selectedScreens.length > 0 && (
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <div className="text-sm font-medium text-gray-700">Reklamos periodas:</div>
          <div className="flex items-center gap-2">
                <input
                  key="desktop-from-date"
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    const newFromDate = e.target.value;
                    console.log('Desktop From date changed:', newFromDate);
                    setFromDate(newFromDate);
                    if (onDateRangeChange) {
                      onDateRangeChange(newFromDate, toDate);
                    }
                  }}
                  onClick={(e) => {
                    // Prevent event bubbling in Chrome
                    e.stopPropagation();
                  }}
                  onFocus={(e) => {
                    // Chrome-specific: prevent focus from bubbling
                    if (isChrome) {
                      e.stopPropagation();
                    }
                  }}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    pointerEvents: 'auto', 
                    userSelect: 'none',
                    // Chrome-specific styles
                    ...(isChrome && {
                      position: 'relative',
                      zIndex: 1000,
                      isolation: 'isolate'
                    })
                  }}
                  placeholder="Nuo"
                />
                <span className="text-gray-500 text-sm">iki</span>
                <input
                  key="desktop-to-date"
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    const newToDate = e.target.value;
                    console.log('Desktop To date changed:', newToDate);
                    setToDate(newToDate);
                    if (onDateRangeChange) {
                      onDateRangeChange(fromDate, newToDate);
                    }
                  }}
                  onClick={(e) => {
                    // Prevent event bubbling in Chrome
                    e.stopPropagation();
                  }}
                  onFocus={(e) => {
                    // Chrome-specific: prevent focus from bubbling
                    if (isChrome) {
                      e.stopPropagation();
                    }
                  }}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    pointerEvents: 'auto', 
                    userSelect: 'none',
                    // Chrome-specific styles
                    ...(isChrome && {
                      position: 'relative',
                      zIndex: 1000,
                      isolation: 'isolate'
                    })
                  }}
                  placeholder="Iki"
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