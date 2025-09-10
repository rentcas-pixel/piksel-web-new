'use client';

import { motion } from 'motion/react'
import { BarChart3, FileText, Calendar, Mail, ChevronRight, Loader } from 'lucide-react'
import Image from 'next/image'

interface CorporateSidebarProps {
  onCitySelect: (city: string) => void;
}

export function CorporateSidebar({ onCitySelect }: CorporateSidebarProps) {
  return (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-screen w-[374px] bg-slate-900 border-r border-slate-700 flex flex-col z-30"
    >
      {/* Logo Section */}
      <div className="p-6 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <Image
              src="/Piksel-logo-black-2023.png"
              alt="Piksel Logo"
              width={120}
              height={40}
              className="h-[22px] w-auto brightness-0 invert"
            />
            <p className="text-sm text-slate-400">ryškių ekranų tinklas</p>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="p-4 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3 p-3 bg-blue-950/50 rounded-lg border border-blue-800/50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="flex-shrink-0"
          >
            <Loader className="w-4 h-4 text-blue-400" />
          </motion.div>
          <div className="flex-1">
                        <div className="text-sm font-medium text-blue-100">Rodome reklamą</div>
            <div className="text-xs text-blue-400">Renkame kontaktus...</div>
          </div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 bg-slate-800">
        <div className="space-y-1">
          {/* Miestai */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 px-3">Miestai</h3>
            {[
              { name: 'Vilnius', badge: '45' },
              { name: 'Kaunas', badge: '32' },
              { name: 'Klaipėda', badge: '28' },
              { name: 'Šiauliai', badge: '22' },
              { name: 'Panevėžys', badge: '18' },
              { name: 'Regionai', badge: '15' }
            ].map((city) => (
              <motion.button
                key={city.name}
                whileHover={{ backgroundColor: '#475569' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCitySelect(city.name)}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:text-white transition-colors group mb-1"
              >
                <BarChart3 className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                <span className="flex-1 text-left font-medium">{city.name}</span>
                            <span className="bg-blue-600/20 text-blue-300 text-xs font-medium px-2 py-1 rounded-full">
                  {city.badge}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
              </motion.button>
            ))}
          </div>

          {/* Kiti */}
        {[
          { icon: FileText, label: 'Klipai', badge: null },
          { icon: Calendar, label: 'DUK', badge: null },
          { icon: Mail, label: 'Kontaktai', badge: null }
        ].map((item) => (
            <motion.button
              key={item.label}
              whileHover={{ backgroundColor: '#475569' }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:text-white transition-colors group"
            >
              <item.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.badge && (
                            <span className="bg-blue-600/20 text-blue-300 text-xs font-medium px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Footer Image */}
      <div className="px-4 pt-4 pb-0 bg-slate-800">
        <div className="relative w-full h-[276px] rounded-lg overflow-hidden">
          <Image
            src="/Ekranas-ant-kojos-su-reklama.png?v=2"
            alt="LED Ekranas ant kojos"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </motion.div>
  )
}