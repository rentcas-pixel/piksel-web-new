import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('inquiries')
      .insert([
        {
          screen_id: body.screenId,
          company_name: body.companyName,
          contact_person: body.contactPerson,
          email: body.email,
          phone: body.phone,
          message: body.message,
          selected_dates: body.dateRange,
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



