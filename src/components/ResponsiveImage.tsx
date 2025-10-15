'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ResponsiveImageProps {
  desktopSrc: string
  mobileSrc?: string
  alt: string
  className?: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
}

export default function ResponsiveImage({
  desktopSrc,
  mobileSrc,
  alt,
  className = '',
  width,
  height,
  fill = false,
  priority = false,
  objectFit = 'cover'
}: ResponsiveImageProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Choose the appropriate image source
  const imageSrc = isMobile && mobileSrc && mobileSrc.trim() !== '' ? mobileSrc : desktopSrc

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    console.warn(`Failed to load image: ${imageSrc}`)
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
          <div className="text-gray-400 text-sm">Kraunama...</div>
        </div>
      )}
      
      {fill ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 object-${objectFit}`}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
        />
      ) : (
        <Image
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 object-${objectFit}`}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
        />
      )}
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {isMobile ? 'Mobile' : 'Desktop'} | {mobileSrc && mobileSrc.trim() !== '' ? 'Optimized' : 'Fallback'} | Src: {imageSrc ? 'OK' : 'NULL'}
        </div>
      )}
    </div>
  )
}

