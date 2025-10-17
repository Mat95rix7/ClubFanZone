import { NextRequest, NextResponse } from 'next/server'

const API_KEY = process.env.API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'https://api.football-data.org/v4'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const competitionId = params.id

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'API key missing' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(
      `${BASE_URL}/competitions/${competitionId}/standings`,
      {
        headers: {
          'X-Auth-Token': API_KEY,
        },
        next: {
          revalidate: 3600, // Cache 1 heure
        },
      }
    )

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching standings:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch standings' },
      { status: 500 }
    )
  }
}
