import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received inquiry data:', body)
    
    const { data, error } = await supabase
      .from('inquiries')
      .insert([
        {
          screen_id: body.screenId || null, // Legacy field (optional)
          selected_screens: body.selectedScreens || [], // New: Array of screen names
          screen_cities: body.screenCities || {}, // New: Screen to city mapping
          company_name: body.companyName,
          contact_person: body.contactPerson,
          email: body.email,
          phone: body.phone,
          message: body.message,
          selected_dates: body.dateRange, // Store as text instead of DATERANGE
          status: 'pending'
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create inquiry' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



