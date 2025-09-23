import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html } = await request.json()
    
    // For now, just log the email (you can integrate with email service later)
    console.log('Email would be sent to:', to)
    console.log('Subject:', subject)
    console.log('HTML:', html)
    
    // You can integrate with:
    // - Nodemailer + Gmail/SMTP
    // - SendGrid
    // - Resend
    // - EmailJS
    
    return NextResponse.json({ success: true, message: 'Email logged (not sent yet)' })
  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json({ error: 'Failed to process email' }, { status: 500 })
  }
}
