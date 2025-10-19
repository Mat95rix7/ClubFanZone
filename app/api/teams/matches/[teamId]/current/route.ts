import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const API_KEY = process.env.API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'https://api.football-data.org/v4'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await params

  if (!API_KEY) {
    console.error('API_KEY non configurée')
    return NextResponse.json({ error: 'Configuration API manquante' }, { status: 500 })
  }

  try {
    // Récupère le match en cours
    const response = await fetch(
      `${BASE_URL}/teams/${teamId}/matches?status=LIVE,IN_PLAY,PAUSED`,
      {
        headers: { 'X-Auth-Token': API_KEY },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      return NextResponse.json(null, { status: 404 })
    }

    const data = await response.json()
    if (!data.matches || data.matches.length === 0) {
      return NextResponse.json(null, { status: 404 })
    }

    const match = data.matches[0]

    // Récupérer le détail complet du match
    const detailResponse = await fetch(`${BASE_URL}/matches/${match.id}`, {
      headers: { 'X-Auth-Token': API_KEY },
      cache: 'no-store',
    })

    let detailedMatch = match
    if (detailResponse.ok) {
      detailedMatch = await detailResponse.json()
    }

    // Extraire les événements si disponibles
    const events =
      detailedMatch?.match?.events?.map((e: any) => ({
        minute: e.minute,
        team: e.team?.name,
        player: e.player?.name,
        type: e.type, // e.g. GOAL, YELLOW_CARD, SUBSTITUTION
        detail: e.detail, // e.g. "Penalty", "Foul", "Injury"
      })) || []

    // Formatter le résultat
    const formattedMatch = {
      id: detailedMatch.id,
      homeTeam: {
        id: detailedMatch.homeTeam?.id,
        name: detailedMatch.homeTeam?.name,
        shortName: detailedMatch.homeTeam?.shortName,
        tla: detailedMatch.homeTeam?.tla,
        logo: detailedMatch.homeTeam?.crest,
      },
      awayTeam: {
        id: detailedMatch.awayTeam?.id,
        name: detailedMatch.awayTeam?.name,
        shortName: detailedMatch.awayTeam?.shortName,
        tla: detailedMatch.awayTeam?.tla,
        logo: detailedMatch.awayTeam?.crest,
      },
      score: detailedMatch.score,
      status: detailedMatch.status,
      competition: detailedMatch.competition,
      startTime: detailedMatch.utcDate,
      referee: detailedMatch.referees?.[0]?.name || null,
      venue: detailedMatch.venue || null,
      statistics: detailedMatch.statistics || null,
      events, // <= Ajout des événements
    }

    return NextResponse.json(formattedMatch, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Erreur lors de la récupération du match en cours:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
