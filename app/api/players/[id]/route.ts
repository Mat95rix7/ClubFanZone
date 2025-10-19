// ===================================
// 2. API Route pour les stats par ID
// app/api/players/[id]/route.ts (ou pages/api/players/[id].ts)
// ===================================

import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const playerId = (await params).id
  const searchParams = request.nextUrl.searchParams
  const season = searchParams.get('season') || '2024'

  if (!playerId) {
    return NextResponse.json(
      { error: 'ID du joueur requis' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/players?id=${playerId}&season=${season}`,
      {
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
          'x-rapidapi-host': 'v3.football.api-sports.io'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Erreur stats joueur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des stats' },
      { status: 500 }
    )
  }
}