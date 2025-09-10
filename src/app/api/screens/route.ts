import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: screens, error } = await supabase
      .from('led_screens')
      .select('*')
      .eq('is_active', true)
      .order('city', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch screens' }, { status: 500 })
    }

    // Transform coordinates from POINT to [lat, lng] array
    const transformedScreens = screens?.map(screen => {
      let coordinates: [number, number]
      
      if (screen.coordinates && typeof screen.coordinates === 'object') {
        // POINT object format
        coordinates = [screen.coordinates.x, screen.coordinates.y]
      } else if (typeof screen.coordinates === 'string') {
        // String format like "(54.6872, 25.2797)"
        const match = screen.coordinates.match(/\(([^,]+),\s*([^)]+)\)/)
        if (match) {
          coordinates = [parseFloat(match[1]), parseFloat(match[2])]
        } else {
          coordinates = [0, 0] // fallback
        }
      } else {
        coordinates = [0, 0] // fallback
      }
      
      return {
        ...screen,
        coordinates
      }
    }) || []

    return NextResponse.json(transformedScreens)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
