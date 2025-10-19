// ===================================
// 1. API Route pour rechercher un joueur
// app/api/players/search/route.ts (ou pages/api/players/search.ts)
// ===================================

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const playerName = searchParams.get('name')
  const player = playerName?.split(' ').pop() || '';
  const season = searchParams.get('season') || '2024'
  const league1 = searchParams.get('league') || ''
  const league = getApiFootballLeagueId(parseInt(league1)) || '';
 


  if (!playerName) {
    return NextResponse.json(
      { error: 'Le nom du joueur est requis' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/players?search=${encodeURIComponent(player)}&season=${season}&league=${league}`,
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
    console.log(data);
    return NextResponse.json(data)

  } catch (error) {
    console.error('Erreur recherche joueur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la recherche du joueur' },
      { status: 500 }
    )
  }
}

// mapping entre Football-Data.org et API-Football
export const leagueIdMap: Record<number, number> = {
  2021: 39,   // Premier League
  2015: 61,   // Ligue 1
  2019: 135,  // Serie A
  2002: 78,   // Bundesliga
  2014: 140,  // LaLiga
  // ajoute d'autres si besoin
}

// fonction utilitaire
export function getApiFootballLeagueId(fdId: number): number | null {
  return leagueIdMap[fdId] || null
}
