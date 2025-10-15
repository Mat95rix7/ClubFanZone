// app/api/teams/matches/[teamId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const API_KEY = process.env.NEXT_PUBLIC_API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'https://api.football-data.org/v4'

export async function GET(req: NextRequest, { params }: { params: { teamId: string } }) {
  const { teamId } = params
  const type = req.nextUrl.searchParams.get('type')
  const season = req.nextUrl.searchParams.get('season')
  const status = type === 'next' ? 'SCHEDULED' : 'FINISHED'
  try {
    const res = await axios.get(`${BASE_URL}/teams/${teamId}/matches`, {
      headers: { 'X-Auth-Token': API_KEY ?? '' },
      params: { status, season },
    })
    return NextResponse.json(res.data.matches)
  } catch (err: any) {
    console.error('Erreur récupération matchs :', err.message)
    return NextResponse.json({ error: 'Impossible de récupérer les matchs' }, { status: 500 })
  }
}

