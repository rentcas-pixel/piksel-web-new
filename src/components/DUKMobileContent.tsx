'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import Link from 'next/link';

export default function DUKMobileContent() {
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

  const faqData = [
    {
      question: "Ar galiu reklamuotis tik viename viaduke?",
      answer: "Taip, galite pasirinkti tik vieną viaduką arba kombinaciją iš kelių viadukų, priklausomai nuo jūsų kampanijos tikslų ir biudžeto."
    },
    {
      question: "Kokie yra minimalūs kampanijos laikotarpiai?",
      answer: "Minimalus kampanijos laikotarpis yra 1 diena. Rekomenduojame bent 3-7 dienų kampanijas, kad pasiektumėte geriausius rezultatus."
    },
    {
      question: "Ar galiu keisti reklamos turinį kampanijos metu?",
      answer: "Taip, galite keisti reklamos turinį kampanijos metu. Paprastai reikia 24 valandų iš anksto pranešti apie turinio keitimus."
    },
    {
      question: "Kokie yra mokėjimo terminai?",
      answer: "Mokėjimas atliekamas iš anksto kampanijos pradžiai. Priimame banko pavedimus ir kitus mokėjimo būdus."
    },
    {
      question: "Ar pateikiate reklamos turinio kūrimo paslaugas?",
      answer: "Taip, mes galime padėti sukurti profesionalų reklamos turinį, kuris atitiks jūsų viaduko specifikacijas ir tikslus."
    },
    {
      question: "Kokie yra techniniai reikalavimai reklamos turiniui?",
      answer: "Reklamos turinys turi atitikti mūsų nurodytus techninius reikalavimus: tikslų dydį, skiriamąją gebą ir formatą. Detalūs reikalavimai pateikiami pasirašius sutartį."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

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
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{ 
                width: '24px', 
                height: '24px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between' 
              }}>
                <div style={{ width: '100%', height: '2px', backgroundColor: '#374151' }}></div>
                <div style={{ width: '100%', height: '2px', backgroundColor: '#374151' }}></div>
                <div style={{ width: '100%', height: '2px', backgroundColor: '#374151' }}></div>
              </div>
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

      {/* City Navigation */}
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
          {['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys', 'Regionai'].map(city => (
            <Link
              key={city}
              href="/"
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: '500',
                backgroundColor: 'white',
                color: '#374151',
                border: '1px solid #d1d5db',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {city}
            </Link>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '24px 16px',
        paddingBottom: '80px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqData.map((item, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <button
                onClick={() => toggleItem(index)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  textAlign: 'left'
                }}
              >
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#111827', 
                  margin: 0,
                  flex: 1
                }}>
                  {item.question}
                </h3>
                {openItems.includes(index) ? (
                  <Minus size={20} color="#6b7280" />
                ) : (
                  <Plus size={20} color="#6b7280" />
                )}
              </button>
              
              {openItems.includes(index) && (
                <div style={{ 
                  marginTop: '12px', 
                  paddingTop: '12px', 
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Phone */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '12px',
                backgroundColor: '#3b82f6',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px'
                }}>
                  <span style={{ filter: 'brightness(0) invert(1)' }}>📞</span>
                </div>
                <a 
                  href="tel:+37069066633"
                  style={{ 
                    color: '#000000', 
                    textDecoration: 'none', 
                    fontSize: '16px',
                    fontWeight: '400'
                  }}
                >
                  +370 690 666 33
                </a>
              </div>

              {/* Email */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '12px',
                backgroundColor: '#3b82f6',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px'
                }}>
                  <span style={{ filter: 'brightness(0) invert(1)' }}>✉️</span>
                </div>
                <a 
                  href="mailto:info@piksel.lt"
                  style={{ 
                    color: '#000000', 
                    textDecoration: 'none', 
                    fontSize: '16px',
                    fontWeight: '400'
                  }}
                >
                  info@piksel.lt
                </a>
              </div>
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
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            width: '280px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  backgroundColor: '#3b82f6', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  P
                </div>
                <div>
                  <img 
                    src="/Piksel-logo-black-2023.png" 
                    alt="Piksel - LED reklamos ekranai Lietuvoje, reklama ekranuose, led reklama"
                    style={{ height: '24px' }}
                  />
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>ryškių ekranų tinklas</p>
                </div>
              </div>
              <button
                onClick={() => setShowHamburgerMenu(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '20px',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            {/* Menu Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <a 
                href="/klipai-mobile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  border: '1px solid #e5e7eb'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.color = '#374151';
                }}
                onClick={() => setShowHamburgerMenu(false)}
              >
                📹 Klipai
              </a>
              
              <a 
                href="/duk-mobile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  border: '1px solid #e5e7eb'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.color = '#374151';
                }}
                onClick={() => setShowHamburgerMenu(false)}
              >
                ❓ DUK
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
