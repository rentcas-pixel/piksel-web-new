'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import Link from 'next/link';

export default function DUKMobile() {
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

  const faqData = [
    {
      question: "Ar galiu reklamuotis tik viename viaduke?",
      answer: "Viadukų ekranai parduodami tik kaip bendras reklamos paketas, apimantis 7 viadukų ekranus. Tik taip galime užtikrinti maksimalų reklamos pasiekiamumą."
    },
    {
      question: "Kokia vidutinė reklamos transliacijų trukmė?",
      answer: "Vidutinė transliacijų trukmė - 2 savaitės, dažniausiai rodant reklaminį klipą kas antrą valandą."
    },
    {
      question: "Koks turi būti reklamos klipas?",
      answer: "Nežiūrint į reklamos tikslus, klipas turi atitikti kelis pagrindinius reikalavimus: 1. Naudojamos kontrastuojančios spalvos. 2. Trumpas tekstas (idealiu atveju reikia įtilpti į 7 žodžius). 3. Aiškiai skaitomas teksto šriftas."
    },
    {
      question: "Kiek kartų per valandą pasirodys klipas?",
      answer: "Per valandą 10 sekundžių trukmės klipas rodomas mažiausiai 30 kartų. Parodymai priklauso nuo ekranų užimtumo. Bet kokiu atveju mes garantuojame 30 parodymų."
    },
    {
      question: "Ar galiu naudoti ilgesnį arba trumpesnį klipą?",
      answer: "Viadukų ekranuose galite naudoti ne trumpesnį nei 10 sekundžių reklamos klipą. Kituose mūsų ekranuose galite naudoti ir 5 sekundžių arba 15 sekundžių klipus. Nors labiausiai pasiteisina 10 sekundžių trukmės klipai."
    },
    {
      question: "Ar galite sukurti reklaminį klipą?",
      answer: "Taip, galime. Klipo kaina prasideda nuo 150 EUR, priklausomai nuo jo sudėtingumo."
    },
    {
      question: "Nuo kada iki kada rodoma reklama?",
      answer: "Ekranai veikia nuo 6.00 val. iki 23.00 val.."
    },
    {
      question: "Kas yra statinė reklama?",
      answer: "Dėl Vilniaus miesto savivaldybės keliamų reikalavimų kai kuriuose Vilniaus ekranuose galima transliuoti tik statinius vaizdo klipus, t. y. klipas turi būti pateiktas be judančių vaizdų. Minimali klipo trukmė - 10 sekundžių."
    },
    {
      question: "Kiek klipų galima rotuoti vienu metu?",
      answer: "Vienoje kampanijoje galite rotuoti iki 5 skirtingų video klipų."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#f0f0f0',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
      overflow: 'auto'
    }}>
      
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb', 
        padding: '24px 32px',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <img 
                src="/Piksel-logo-black-2023.png" 
                alt="Piksel Logo" 
                style={{ height: '22px', width: 'auto' }}
              />
            </Link>
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

      {/* Cities Navigation */}
      <div style={{ 
        backgroundColor: '#f9fafb', 
        borderBottom: '1px solid #e5e7eb', 
        padding: '8px 16px',
        flexShrink: 0
      }}>
        <div style={{ 
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
            <Link
              key={city}
              href={city === 'DUK' ? '/duk-mobile' : city === 'Reikalavimai klipams' ? '/klipai-mobile' : '/'}
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: '500',
                backgroundColor: city === 'DUK' ? '#3b82f6' : 'white',
                color: city === 'DUK' ? 'white' : '#374151',
                border: city === 'DUK' ? 'none' : '1px solid #d1d5db',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                textDecoration: 'none'
              }}
            >
              {city}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>DUK</h1>
        </div>

        {/* FAQ Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqData.map((item, index) => (
            <div key={index} style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              overflow: 'hidden',
              backgroundColor: 'white'
            }}>
              <button
                onClick={() => toggleItem(index)}
                style={{
                  width: '100%',
                  padding: '16px',
                  textAlign: 'left',
                  backgroundColor: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#111827',
                  paddingRight: '16px',
                  lineHeight: '1.4'
                }}>
                  {item.question}
                </span>
                <div style={{ flexShrink: 0 }}>
                  {openItems.includes(index) ? (
                    <Minus style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                  ) : (
                    <Plus style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                  )}
                </div>
              </button>
              
              {openItems.includes(index) && (
                <div style={{ 
                  padding: '16px', 
                  backgroundColor: '#f9fafb', 
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <p style={{ 
                    color: '#6b7280', 
                    lineHeight: '1.6', 
                    margin: 0,
                    fontSize: '14px'
                  }}>
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
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
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '320px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(10px)',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <img 
                src="/Piksel-logo-black-2023.png" 
                alt="Piksel Logo" 
                style={{ height: '22px', width: 'auto' }}
              />
              <button
                onClick={() => setShowContactPopup(false)}
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

            {/* Contact Information */}
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
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(10px)',
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
                  backgroundColor: '#3b82f6',
                  border: '1px solid #3b82f6',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'white'
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
