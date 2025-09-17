'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Map from '@/components/Map';
import ScreenList from '@/components/ScreenList';
import { useLEDScreens } from '@/hooks/useLEDScreens';
import { Building2, User, Mail, MessageSquare, Send, Calendar, MapPin, X } from 'lucide-react';
import { sendInquiryEmail, initEmailJS } from '@/lib/emailjs';


export default function Home() {
  const [selectedCity, setSelectedCity] = useState<string>('Vilnius');
  const [selectedScreens, setSelectedScreens] = useState<string[]>([]);
  const [screenCities, setScreenCities] = useState<{[screenName: string]: string}>({});
  const [dateRange, setDateRange] = useState<{from: string; to: string} | null>(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  // Inquiry form state
  const [inquiryForm, setInquiryForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  
  // Get LED screens from Supabase
  const { screens: ledScreens, loading, error } = useLEDScreens();

  // Initialize EmailJS on component mount
  useEffect(() => {
    initEmailJS();
  }, []);



  const handleCityFilter = (city: string) => {
    setSelectedCity(city);
    setSearchResults([]); // Clear search results when changing city
    console.log('Selected city:', city);
  };
  
  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
  };


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
        }
        return [...prev, screenName];
      }
    });
  };

  const handleShowPopup = (screenId: string) => {
    // Find the screen by ID
    const screen = ledScreens.find(s => s.id === screenId);
    if (screen) {
      // Store the screen to show popup and let Map component handle it
      if ((window as any).mapInstance) {
        // Find all layers (markers) on the map
        const map = (window as any).mapInstance;
        map.eachLayer((layer: any) => {
          // Check if this layer is a marker with our screen data
          if (layer.options && layer.options.screenId === screenId) {
            // Open the popup
            layer.openPopup();
            return;
          }
          // Also check if the popup content contains our screen name
          if (layer.getPopup && layer.getPopup()) {
            const popupContent = layer.getPopup().getContent();
            if (popupContent && popupContent.includes(screen.name)) {
              layer.openPopup();
              return;
            }
          }
        });
      }
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

  // Handle inquiry form submission
  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inquiryForm.companyName || !inquiryForm.contactPerson || !inquiryForm.email) {
      alert('Prašome užpildyti visus privalomus laukus');
      return;
    }
    
    if (selectedScreens.length === 0) {
      alert('Prašome pasirinkti bent vieną ekraną');
      return;
    }
    
    if (!dateRange) {
      alert('Prašome pasirinkti reklamos periodą');
      return;
    }
    
    setSubmittingInquiry(true);
    
    try {
      // 1. Save to Supabase
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedScreens: selectedScreens,
          screenCities: screenCities,
          companyName: inquiryForm.companyName,
          contactPerson: inquiryForm.contactPerson,
          email: inquiryForm.email,
          phone: inquiryForm.phone,
          message: inquiryForm.message,
          dateRange: `${dateRange.from} - ${dateRange.to}`,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`Nepavyko išsiųsti užklausos: ${errorData.error || 'Unknown error'}`);
      }
      
      // 2. Send email notification
      const emailResult = await sendInquiryEmail({
        selectedScreens: selectedScreens,
        screenCities: screenCities,
        companyName: inquiryForm.companyName,
        contactPerson: inquiryForm.contactPerson,
        email: inquiryForm.email,
        phone: inquiryForm.phone,
        message: inquiryForm.message,
        dateRange: `${dateRange.from} - ${dateRange.to}`,
      });
      
      if (!emailResult.success) {
        console.warn('Email failed to send:', emailResult.error);
        // Still show success since data was saved to Supabase
      }
      
      // Success
      alert('Užklausa sėkmingai išsiųsta! Susisieksime su jumis artimiausiu metu.');
      
      // Reset form
      setInquiryForm({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        message: ''
      });
      setShowInquiryForm(false);
      
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Klaida siunčiant užklausą. Bandykite dar kartą.');
    } finally {
      setSubmittingInquiry(false);
    }
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
        onSearchResults={handleSearchResults}
      />
      
      {/* Screen List */}
      <ScreenList 
        selectedCity={selectedCity}
        selectedScreens={selectedScreens}
        onSelectScreen={handleSelectScreen}
        onShowPopup={handleShowPopup}
        isLoading={isLoading}
        searchResults={searchResults}
      />
      
      {/* Map - Full Width with margin for sidebar */}
      <div className={`ml-[640px] ${showInquiryForm ? 'mr-96' : 'mr-0'}`}>
        <Map 
          selectedCity={selectedCity} 
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
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Įmonė *</h3>
              <input
                type="text"
                value={inquiryForm.companyName}
                onChange={(e) => setInquiryForm({...inquiryForm, companyName: e.target.value})}
                placeholder="Įmonės pavadinimas"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Name */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Vardas *</h3>
              <input
                type="text"
                value={inquiryForm.contactPerson}
                onChange={(e) => setInquiryForm({...inquiryForm, contactPerson: e.target.value})}
                placeholder="Jūsų vardas"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">El. paštas *</h3>
              <input
                type="email"
                value={inquiryForm.email}
                onChange={(e) => setInquiryForm({...inquiryForm, email: e.target.value})}
                placeholder="el@paštas.lt"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Telefonas</h3>
              <input
                type="tel"
                value={inquiryForm.phone}
                onChange={(e) => setInquiryForm({...inquiryForm, phone: e.target.value})}
                placeholder="+370 600 12345"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Comment */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Komentaras</h3>
              <textarea
                value={inquiryForm.message}
                onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})}
                placeholder="Jūsų komentaras ar papildoma informacija..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Send Button */}
            <form onSubmit={handleSubmitInquiry}>
              <button
                type="submit"
                disabled={submittingInquiry}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {submittingInquiry ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Siunčiama...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Siųsti užklausą</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}