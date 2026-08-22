import { readFileSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'led-ekranu-koordinates.xlsx')
    const buffer = readFileSync(filePath)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition':
          'attachment; filename="led-ekranu-koordinates.xlsx"',
        'Content-Length': String(buffer.length),
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('LED screens export error:', error)
    return NextResponse.json({ error: 'Export file not found' }, { status: 404 })
  }
}
