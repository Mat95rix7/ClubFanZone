// app/api/competitions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const API_KEY = process.env.NEXT_PUBLIC_API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'https://api.football-data.org/v4'

export async function GET(req: NextRequest) {
  try {
    const res = await axios.get(`${BASE_URL}/competitions?plan=TIER_ONE`, {
      headers: { 'X-Auth-Token': API_KEY ?? '' },
    })
    // Filtrer pour ne garder que les compétitions de type "TIER_ONE"
    const competitions = res.data.competitions?.filter(
      (c: any) => c.plan === "TIER_ONE"
    )

    return NextResponse.json(competitions)
  } catch (err: any) {
    console.error('Erreur récupération compétitions :', err.message)
    return NextResponse.json({ error: 'Impossible de récupérer les compétitions' }, { status: 500 })
  }
}
