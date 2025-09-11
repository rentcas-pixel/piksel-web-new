import { useState, useEffect } from 'react'
import { LEDScreen } from '@/lib/supabase'

export function useLEDScreens() {
  const [screens, setScreens] = useState<LEDScreen[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchScreens() {
      try {
        setLoading(true)
        const response = await fetch('/api/screens')
        
        if (!response.ok) {
          throw new Error('Failed to fetch screens')
        }
        
        const data = await response.json()
        setScreens(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        console.error('Error fetching screens:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchScreens()
  }, [])

  return { screens, loading, error }
}



