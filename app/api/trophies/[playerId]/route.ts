// ===================================
// 3. API Route pour les trophées
// app/api/trophies/[playerId]/route.ts (ou pages/api/trophies/[playerId].ts)
// ===================================

import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  const playerId = (await params).playerId

  if (!playerId) {
    return NextResponse.json(
      { error: 'ID du joueur requis' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/trophies?player=${playerId}`,
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
    console.error('Erreur trophées joueur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des trophées' },
      { status: 500 }
    )
  }
}
