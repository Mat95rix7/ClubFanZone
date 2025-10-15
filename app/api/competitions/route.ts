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
    console.log(res.data.count)
    return NextResponse.json(res.data.competitions)
  } catch (err: any) {
    console.error('Erreur récupération compétitions :', err.message)
    return NextResponse.json({ error: 'Impossible de récupérer les compétitions' }, { status: 500 })
  }
}
