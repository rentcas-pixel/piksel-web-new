'use client';

import { Image, Video, Square } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useNews } from '@/hooks/useNews';
import { clipScreensFromExcel } from '@/data/clipsData';
import MobileNavMenu from '@/components/MobileNavMenu';

export default function KlipaiMobile() {
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const { news: newsItems } = useNews();

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
      
      {/* Header - same style as naujienos mobile */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb', 
        padding: '0 16px',
        height: '56px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <img 
            src="/Piksel-logo-black-2023.png" 
            alt="Piksel Logo" 
            style={{ height: '28px', width: 'auto' }}
          />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => setShowHamburgerMenu(true)}
            style={{ 
              padding: '8px', 
              backgroundColor: 'transparent', 
              color: '#374151', 
              borderRadius: '8px',
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ☰
          </button>
          <button 
            onClick={() => setShowContactPopup(true)}
            style={{ 
              padding: '8px', 
              backgroundColor: 'transparent', 
              color: '#374151', 
              borderRadius: '8px',
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            i
          </button>
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
          {['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys', 'Regionai', 'Naujienos', 'Reikalavimai klipams', 'DUK'].map(item => (
            <Link
              key={item}
              href={item === 'DUK' ? '/duk-mobile' : item === 'Reikalavimai klipams' ? '/klipai-mobile' : item === 'Naujienos' ? '/naujienos' : '/'}
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: '500',
                backgroundColor: item === 'Reikalavimai klipams' ? '#3b82f6' : 'white',
                color: item === 'Reikalavimai klipams' ? 'white' : '#374151',
                border: item === 'Reikalavimai klipams' ? 'none' : '1px solid #d1d5db',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                textDecoration: 'none'
              }}
            >
              {item}
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
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Reikalavimai klipams</h2>
        </div>
            
        {/* Table */}
        <div style={{ 
          backgroundColor: 'white', 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px', 
          overflow: 'hidden',
          marginBottom: '24px'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '600px' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: '#374151',
                    borderRight: '1px solid #e5e7eb'
                  }}>
                    MIESTAS
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: '#374151',
                    borderRight: '1px solid #e5e7eb'
                  }}>
                    EKRANAS
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: '#374151',
                    borderRight: '1px solid #e5e7eb'
                  }}>
                    TIPAS
                  </th>
                  <th style={{ 
                    padding: '12px 8px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: '#374151'
                  }}>
                    REZOLIUCIJA (px)
                  </th>
                </tr>
              </thead>
              <tbody>
                {clipScreensFromExcel.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ 
                      padding: '12px 8px', 
                      fontSize: '12px', 
                      color: '#374151',
                      borderRight: '1px solid #e5e7eb'
                    }}>
                      {item.city}
                    </td>
                    <td style={{ 
                      padding: '12px 8px', 
                      fontSize: '12px', 
                      fontWeight: '600',
                      color: '#374151',
                      borderRight: '1px solid #e5e7eb'
                    }}>
                      {item.screen}
                    </td>
                    <td style={{ 
                      padding: '12px 8px', 
                      fontSize: '12px', 
                      color: '#374151',
                      borderRight: '1px solid #e5e7eb'
                    }}>
                      {item.type}
                    </td>
                    <td style={{ 
                      padding: '12px 8px', 
                      fontSize: '12px', 
                      color: '#374151'
                    }}>
                      {item.resolution}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Format Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '80px' }}>
          {/* Graphic Formats */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Image style={{ width: '20px', height: '20px', color: '#6b7280' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#111827', margin: 0 }}>GRAFINIAI FORMATAI</h3>
            </div>
            <p style={{ color: '#374151', lineHeight: '1.6', margin: 0, fontSize: '14px' }}>
              Yra tinkami JPEG, bei PNG formatai. Spalvų koduotė RGB. Netinka - PDF, GIF.
            </p>
          </div>

          {/* Video Formats */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Video style={{ width: '20px', height: '20px', color: '#6b7280' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#111827', margin: 0 }}>VIDEO FORMATAI</h3>
            </div>
            <p style={{ color: '#374151', lineHeight: '1.6', margin: 0, fontSize: '14px' }}>
              Formatas MPEG-4 (be audio), taip pat ne didesnis nei 50MB dydžio. Tik lėta, neblaškanti ir neagresyvi animacija.
            </p>
          </div>

          {/* Static Clip */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Square style={{ width: '20px', height: '20px', color: '#6b7280' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#111827', margin: 0 }}>STATINIS KLIPAS</h3>
            </div>
            <p style={{ color: '#374151', lineHeight: '1.6', margin: 0, fontSize: '14px' }}>
              10s nejudantis klipas, pirma sekundė gali būti animuota.
            </p>
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
                style={{ height: '31px', width: 'auto' }}
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

      <MobileNavMenu
        isOpen={showHamburgerMenu}
        onClose={() => setShowHamburgerMenu(false)}
        newsCount={newsItems.length}
        topOffset={56}
      />

    </div>
  );
}
