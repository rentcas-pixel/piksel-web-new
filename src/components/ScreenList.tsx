'use client';

import { LEDScreen } from '@/lib/supabase';
import { generateScreenImageAlt } from '@/lib/seoImageUtils';
import { useLEDScreens } from '@/hooks/useLEDScreens';
import Image from 'next/image';
import { MapPin, Clock, Info, Plus, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ScreenListProps {
  selectedCity: string;
  selectedScreens: string[];
  onSelectScreen: (screenName: string) => void;
  onShowPopup?: (screenId: string) => void;
  isLoading?: boolean;
  searchResults?: any[];
  /** From page – single fetch when provided */
  ledScreens?: LEDScreen[];
  loading?: boolean;
  error?: string | null;
}

export default function ScreenList({ selectedCity, selectedScreens, onSelectScreen, onShowPopup, isLoading = false, searchResults = [], ledScreens: propScreens, loading: propLoading, error: propError }: ScreenListProps) {
  const fromHook = useLEDScreens();
  const ledScreens = propScreens ?? fromHook.screens;
  const loading = propLoading ?? fromHook.loading;
  const error = propError ?? fromHook.error;
  
  // Filter screens by selected city
  const filteredScreens = selectedCity === 'Lietuva'
    ? ledScreens // Show all screens for Lithuania
    : selectedCity === 'Regionai' 
    ? ledScreens.filter(screen => !['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys'].includes(screen.city))
    : ledScreens.filter(screen => screen.city === selectedCity);
  
  // Use search results if available, otherwise use filtered screens
  const displayScreens = searchResults.length > 0 ? searchResults : filteredScreens;

  if (loading) {
    return (
      <div className="fixed left-80 top-0 w-80 h-screen bg-gray-50 border-r border-gray-200 z-30 overflow-y-auto">
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="relative mb-3">
                <Skeleton className="w-full h-32 rounded-md" />
              </div>
              <div className="mb-3 space-y-2">
                <Skeleton className="h-5 w-[75%] rounded" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-12 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="flex-1 h-9 rounded-md" />
                <Skeleton className="flex-1 h-9 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed left-80 top-0 w-80 h-screen bg-gray-50 border-r border-gray-200 z-30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-sm mb-2">Klaida: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-3 py-1 bg-[#1329d4] text-white rounded text-sm hover:bg-[#0f20a8]"
          >
            Bandyti vėl
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-80 top-0 w-80 h-screen bg-gray-50 border-r border-gray-200 z-30 overflow-y-auto">
      <div className="p-4">
        {searchResults.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-1">
              🔍 Paieškos rezultatai
            </div>
            <div className="text-xs text-blue-700">
              Rasta {searchResults.length} ekranų
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {displayScreens.map((screen) => {
            const isSelected = selectedScreens.includes(screen.name);
            const hasLastMinute = screen.is_last_minute || false;
            const lastMinuteDate = screen.last_minute_date;
            const isLastMinuteExpired = hasLastMinute && lastMinuteDate && new Date(lastMinuteDate) < new Date();
            const showLastMinute = hasLastMinute && !isLastMinuteExpired;
            return (
              <div
                key={screen.id}
                className={`bg-white rounded-lg shadow-sm border transition-all duration-200 ${
                  isSelected 
                    ? 'border-green-500 ring-2 ring-green-200' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="p-4">
                  {/* Screen Image */}
                  <div className="relative mb-3">
                    <Image
                      src={screen.image_url}
                      alt={generateScreenImageAlt(screen.name, screen.city)}
                      width={300}
                      height={150}
                      className="w-full h-32 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => onShowPopup ? onShowPopup(screen.id) : null}
                      title="Paspausti, kad pamatytumėte žemėlapyje"
                    />
                    {showLastMinute && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-md">
                        LAST MINUTE
                      </div>
                    )}
                  </div>
                  
                  {/* Screen Info */}
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 mb-1">{screen.name}</h3>
                    <div className="text-sm text-gray-600 mb-1">
                      <div className="flex items-center gap-1 mb-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="font-medium">Adresas:</span>
                      </div>
                      <p className="text-gray-700 ml-4">{screen.address}</p>
                    </div>
                    {false && (
                      <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        iki 2025-08-25
                      </p>
                    )}
                  </div>
                  
                  {/* Action Buttons - Subtle */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelectScreen(screen.name)}
                      className={`flex-1 py-2 px-3 rounded-md text-sm transition-colors flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-gray-100 text-gray-600 border border-gray-300'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3 h-3" />
                          Pridėtas
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
                          Pridėti
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => onShowPopup ? onShowPopup(screen.id) : window.open(`/ekranas/${screen.id}`, '_blank')}
                      className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 py-2 px-3 rounded-md text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Info className="w-3 h-3" />
                      Info
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}