// import { NextRequest, NextResponse } from 'next/server'
// import axios from 'axios'

// const API_KEY = process.env.NEXT_PUBLIC_API_KEY
// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'https://api.football-data.org/v4'

// export async function GET(
//   req: NextRequest,
//   context: { params: { competitionId: string } }
// ) {
//   const { competitionId } = context.params

//   try {
//     const res = await axios.get(`${BASE_URL}/competitions/${competitionId}/teams`, {
//       headers: { 'X-Auth-Token': API_KEY ?? '' },
//     })
//     return NextResponse.json(res.data.teams)
//   } catch (err: any) {
//     console.error('Erreur récupération équipes :', err.message)
//     return NextResponse.json({ error: 'Impossible de récupérer les équipes' }, { status: 500 })
//   }
// }

import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// L'interface de contexte est généralement acceptée si elle est passée implicitement
interface Params {
  competitionId: string
}

const API_KEY = process.env.NEXT_PUBLIC_API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'https://api.football-data.org/v4'

export async function GET(
  req: NextRequest,
  // 👈 La solution la plus propre et acceptée par Next.js/Vercel
  context: { params: Params } 
) {
  const { competitionId } = context.params

  try {
    const res = await axios.get(`${BASE_URL}/competitions/${competitionId}/teams`, {
      headers: { 'X-Auth-Token': API_KEY ?? '' },
    })
    
    // ... reste du code
    
    return NextResponse.json(res.data.teams)
  } catch (err: any) {
    console.error('Erreur récupération équipes :', err.message)
    return NextResponse.json({ error: 'Impossible de récupérer les équipes' }, { status: 500 })
  }
}