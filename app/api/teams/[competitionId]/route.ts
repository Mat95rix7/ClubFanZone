// import { NextRequest, NextResponse } from 'next/server'
// import axios from 'axios'

// const API_KEY = process.env.API_KEY
// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'https://api.football-data.org/v4'

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ competitionId: string }> }
// ) {
//   const { competitionId } = await params
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

const API_KEY = process.env.API_KEY
const BASE_URL = 'https://api.football-data.org/v4'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ competitionId: string }> }
) {
  const { competitionId } = await params

  // Log pour déboguer sur Vercel
  console.log('API_KEY présente:', !!API_KEY)
  console.log('Competition ID:', competitionId)

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'API_KEY manquante sur le serveur' }, 
      { status: 500 }
    )
  }

  try {
    const url = `${BASE_URL}/competitions/${competitionId}/teams`
    console.log('Appel API:', url)

    const response = await fetch(url, {
      headers: { 
        'X-Auth-Token': API_KEY,
      },
      // Important pour Vercel
      cache: 'no-store'
    })

    console.log('Status réponse:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erreur API:', errorText)
      
      return NextResponse.json(
        { 
          error: 'Erreur API football-data',
          status: response.status,
          details: errorText
        }, 
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Équipes récupérées:', data.teams?.length)

    return NextResponse.json(data.teams || [])

  } catch (err: any) {
    console.error('Erreur catch:', err.message)
    return NextResponse.json(
      { 
        error: 'Erreur serveur',
        message: err.message 
      }, 
      { status: 500 }
    )
  }
}