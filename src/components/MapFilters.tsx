'use client';

import { useState, useEffect } from 'react';

interface MapFiltersProps {
  onFilterChange: (filters: {
    cities: string[];
    districts: string[];
  }) => void;
  debugInfo?: {
    filteredScreens: number;
    totalScreens: number;
    cities: string[];
    districts: string[];
  };
}

export default function MapFilters({ onFilterChange, debugInfo }: MapFiltersProps) {
  const [selectedCities, setSelectedCities] = useState<string[]>(['Vilnius']); // Default to Vilnius
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

  // Send initial filter on component mount
  useEffect(() => {
    onFilterChange({
      cities: ['Vilnius'],
      districts: []
    });
  }, []);

  const cities = [
    'Vilnius',
    'Kaunas', 
    'Klaipėda',
    'Šiauliai',
    'Panevėžys',
    'Regionai'
  ];

  const districts = [
    'Regionai'
  ];

  const handleCityToggle = (city: string) => {
    const newCities = selectedCities.includes(city)
      ? selectedCities.filter(c => c !== city)
      : [...selectedCities, city];
    
    setSelectedCities(newCities);
    onFilterChange({
      cities: newCities,
      districts: selectedDistricts
    });
  };

  const handleDistrictToggle = (district: string) => {
    const newDistricts = selectedDistricts.includes(district)
      ? selectedDistricts.filter(d => d !== district)
      : [...selectedDistricts, district];
    
    setSelectedDistricts(newDistricts);
    onFilterChange({
      cities: selectedCities,
      districts: newDistricts
    });
  };

  const clearAllFilters = () => {
    setSelectedCities(['Vilnius']); // Reset to Vilnius
    setSelectedDistricts([]);
    onFilterChange({
      cities: ['Vilnius'],
      districts: []
    });
  };

  return (
    <div 
      className="w-80 shadow-2xl rounded-lg" 
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 999999
      }}
    >
      <div className="p-6 bg-white rounded-lg">
        {/* Cities Filter */}
        <div className="mb-6">
          <div className="space-y-2">
            {cities.map((city) => (
              <label key={city} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer group">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-black to-gray-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{city}</span>
                </div>
                <input
                  type="checkbox"
                  checked={selectedCities.includes(city)}
                  onChange={() => handleCityToggle(city)}
                  className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black focus:ring-2"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Clear All Button */}
        <button
          onClick={clearAllFilters}
          className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          Grąžinti į Vilnių
        </button>
      </div>
    </div>
  );
}
