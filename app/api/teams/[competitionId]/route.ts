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

// Définir l'interface pour les paramètres dynamiques (Next.js le fait implicitement mais c'est mieux pour la typage)
interface RouteContext {
  params: {
    competitionId: string // Doit correspondre au nom du dossier [competitionId]
  }
}

const API_KEY = process.env.NEXT_PUBLIC_API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'https://api.football-data.org/v4'

// Vous devez typer le second argument avec l'interface correcte
export async function GET(
  req: NextRequest,
  context: RouteContext // 👈 UTILISEZ CE TYPAGE
) {
  const { competitionId } = context.params

  try {
    const res = await axios.get(`${BASE_URL}/competitions/${competitionId}/teams`, {
      headers: { 'X-Auth-Token': API_KEY ?? '' },
    })
    // Vérification de la structure de l'API (assurez-vous que res.data.teams existe)
    if (!res.data || !res.data.teams) {
      throw new Error('Données d’équipe manquantes dans la réponse de l’API externe.')
    }
    return NextResponse.json(res.data.teams)
  } catch (err: any) {
    console.error('Erreur récupération équipes :', err.message)
    // Retourner une erreur standardisée
    return NextResponse.json({ error: 'Impossible de récupérer les équipes' }, { status: 500 })
  }
}