import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eknndiyjolypgxkwtvxn.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbm5kaXlqb2x5cGd4a3d0dnhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTg0MzIsImV4cCI6MjA3MzA3NDQzMn0.BYGZRH9kk2mSqpLMwb67_W9YDoweA6sAQhebYkquQBw'

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key:', supabaseAnonKey.substring(0, 20) + '...')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface LEDScreen {
  id: string
  slug: string // SEO-friendly URL identifier (e.g., compensa, senukai-vilnius)
  name: string
  coordinates: [number, number] // [latitude, longitude]
  city: string
  district: string
  address: string
  image_url: string // Desktop version
  mobile_image_url?: string // Mobile version (optional, falls back to image_url)
  description?: string
  is_video?: boolean
  is_static?: boolean
  is_double_sided?: boolean
  is_viaduct?: boolean
  side_a_name?: string
  side_b_name?: string
  side_a_image_url?: string
  side_b_image_url?: string
  side_a_mobile_image_url?: string // Mobile version for side A
  side_b_mobile_image_url?: string // Mobile version for side B
  size?: string // e.g., "8x4"
  resolution?: string // e.g., "1152x576"
  traffic?: string // e.g., "300.258"
  price?: number // e.g., 70
  is_active: boolean
  is_last_minute?: boolean
  last_minute_date?: string
  display_order?: number
  created_at: string
  updated_at: string
}

export interface Pricing {
  id: string
  screen_id: string
  duration_days: number
  price_euros: number
  is_last_minute: boolean
  last_minute_date?: string
  created_at: string
}

export interface Inquiry {
  id: string
  screen_id: string // Legacy field (keep for compatibility)
  selected_screens: string[] // New: Array of selected screen names
  screen_cities: { [screenName: string]: string } // New: Screen name to city mapping
  company_name: string
  contact_person: string
  email: string
  phone?: string
  message?: string
  selected_dates: string // DATERANGE as string
  status: 'pending' | 'contacted' | 'completed' | 'cancelled'
  created_at: string
}
