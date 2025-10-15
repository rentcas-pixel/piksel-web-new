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
  const [hasError, setHasError] = useState(false)

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
    setHasError(true)
    console.error(`Failed to load image: ${imageSrc}`)
    console.error(`Mobile: ${isMobile}, MobileSrc: ${mobileSrc}, DesktopSrc: ${desktopSrc}`)
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
          <div className="text-gray-400 text-sm">Kraunama...</div>
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500">
          <div className="text-2xl mb-2">📷</div>
          <div className="text-sm text-center px-2">Nuotrauka neprieinama<br/>(402 error)</div>
        </div>
      ) : (
        <>
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
        </>
      )}
      
    </div>
  )
}

