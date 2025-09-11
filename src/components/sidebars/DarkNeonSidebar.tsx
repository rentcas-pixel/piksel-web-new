'use client';

import { motion } from 'framer-motion'
import { BarChart3, FileText, Calendar, Mail, ChevronRight, Loader, Zap } from 'lucide-react'

export function DarkNeonSidebar() {
  return (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="h-screen w-72 bg-black border-r border-purple-500/30 flex flex-col"
    >
      {/* Logo Section */}
      <div className="p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-purple-500/30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-md flex items-center justify-center shadow-lg shadow-purple-500/50">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Piksel</h1>
            <p className="text-sm text-purple-300">ryškių ekranų tinklas</p>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-b border-purple-500/30">
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-800/50 to-blue-800/50 rounded-lg border border-purple-400/50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="flex-shrink-0"
          >
            <Zap className="w-4 h-4 text-purple-400" />
          </motion.div>
          <div className="flex-1">
            <div className="text-sm font-medium text-purple-100">System Status</div>
            <div className="text-xs text-purple-300">Synchronizing data...</div>
          </div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 bg-gradient-to-b from-black to-purple-900/20">
        <div className="space-y-1">
          {/* Miestai */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-purple-300 mb-3 px-3">Miestai</h3>
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
                whileHover={{ 
                  backgroundColor: 'rgba(147, 51, 234, 0.2)',
                  boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-purple-200 hover:text-white transition-all group mb-1 border border-transparent hover:border-purple-400/50"
              >
                <BarChart3 className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                <span className="flex-1 text-left font-medium">{city.name}</span>
                <span className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-purple-200 text-xs font-medium px-2 py-1 rounded-full border border-purple-400/30">
                  {city.badge}
                </span>
                <ChevronRight className="w-4 h-4 text-purple-500 group-hover:text-purple-300 transition-colors" />
              </motion.button>
            ))}
          </div>

          {/* Kiti */}
          {[
            { icon: FileText, label: 'Klipai', badge: '42' },
            { icon: Calendar, label: 'DUK', badge: null },
            { icon: Mail, label: 'Kontaktai', badge: null }
          ].map((item) => (
            <motion.button
              key={item.label}
              whileHover={{ 
                backgroundColor: 'rgba(147, 51, 234, 0.2)',
                boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-purple-200 hover:text-white transition-all group border border-transparent hover:border-purple-400/50"
            >
              <item.icon className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.badge && (
                <span className="bg-gradient-to-r from-red-600/30 to-pink-600/30 text-red-200 text-xs font-medium px-2 py-1 rounded-full border border-red-400/30">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-purple-500 group-hover:text-purple-300 transition-colors" />
            </motion.button>
          ))}
        </div>
      </nav>
    </motion.div>
  )
}





