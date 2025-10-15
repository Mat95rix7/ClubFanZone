// // app/api/teams/info/[teamId]/route.ts
// import { NextResponse } from "next/server"
// import axios from "axios"

// const API_KEY = process.env.NEXT_PUBLIC_API_KEY
// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "https://api.football-data.org/v4"

// export async function GET(
//   req: Request,
//   { params }: { params: Promise<{ teamId: string }> }
// ) {
//   const { teamId } = await params
//   try {
//     const res = await axios.get(`${BASE_URL}/teams/${teamId}`, {
//       headers: { "X-Auth-Token": API_KEY ?? "" },
//     })
//     console.log(res.data);
//     return NextResponse.json({
//       team: res.data.info,
//       lastMatches: res.data.lastMatches,
//       nextMatches: res.data.nextMatches,
//       players: res.data.squad || [],
//     })
//   }
//   // return NextResponse.json(res.data)
//   catch (err: any) {
//     console.error(err)
//     return NextResponse.json(
//       { error: "Impossible de récupérer les informations de l'équipe" },
//       { status: 500 }
//     )
//   }
// }
// app/api/teams/[teamId]/full/route.ts
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

const API_KEY = process.env.NEXT_PUBLIC_API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "https://api.football-data.org/v4"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await params
  
  // Optionnel : paramètre season si besoin de filtrer par saison
  const season = req.nextUrl.searchParams.get('season')

  try {
    // Faire les appels en parallèle
    const [teamResponse, finishedMatchesResponse, scheduledMatchesResponse] = await Promise.all([
      // 1. Infos équipe (contient squad, coach, runningCompetitions, etc.)
      axios.get(`${BASE_URL}/teams/${teamId}`, {
        headers: { "X-Auth-Token": API_KEY ?? "" },
      }),
      
      // 2. Matchs terminés
      axios.get(`${BASE_URL}/teams/${teamId}/matches`, {
        headers: { "X-Auth-Token": API_KEY ?? "" },
        params: { 
          status: 'FINISHED',
          ...(season && { season })
        }
      }),
      
      // 3. Matchs à venir
      axios.get(`${BASE_URL}/teams/${teamId}/matches`, {
        headers: { "X-Auth-Token": API_KEY ?? "" },
        params: { 
          status: 'SCHEDULED',
          ...(season && { season })
        }
      })
    ])

    const teamData = teamResponse.data
    const finishedMatches = finishedMatchesResponse.data.matches || []
    const scheduledMatches = scheduledMatchesResponse.data.matches || []

    // Trier les derniers matchs (du plus récent au plus ancien)
    const lastMatches = finishedMatches
      .filter((match: any) => match.utcDate)
      .sort((a: any, b: any) => 
        new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime()
      )
      .slice(0, 10) // Limiter à 10 matchs

    // Trier les prochains matchs (du plus proche au plus lointain)
    const nextMatches = scheduledMatches
      .filter((match: any) => match.utcDate)
      .sort((a: any, b: any) => 
        new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
      )
      // .slice(0, 10) // Limiter à 10 matchs

    // Retourner toutes les données structurées
    return NextResponse.json({
      team: teamData, // Contient: area, name, crest, coach, squad, runningCompetitions, etc.
      lastMatches,
      nextMatches,
      players: teamData.squad || [],
    })

  } catch (err: any) {
    console.error("❌ Erreur API football-data:", err.response?.data || err.message)
    
    // Gestion des erreurs spécifiques
    if (err.response?.status === 429) {
      return NextResponse.json(
        { error: "Limite de requêtes API atteinte (10 req/min). Réessayez dans quelques instants." },
        { status: 429 }
      )
    }

    if (err.response?.status === 404) {
      return NextResponse.json(
        { error: "Équipe introuvable" },
        { status: 404 }
      )
    }

    if (err.response?.status === 403) {
      return NextResponse.json(
        { error: "Accès refusé. Vérifiez votre clé API." },
        { status: 403 }
      )
    }

    if (err.response?.status === 400) {
      return NextResponse.json(
        { error: "Paramètres invalides" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Impossible de récupérer les données de l'équipe" },
      { status: 500 }
    )
  }
}