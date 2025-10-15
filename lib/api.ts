import { Competition, Match, Team } from '@/types'


async function fetchJson<T = any>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Fetch error ${res.status} ${res.statusText} — ${text}`)
  }

  return (await res.json()) as T
}

/**
 * Récupère la liste des compétitions via ton backend
 * Backend endpoint attendu : GET /api/competitions
 */
export const getCompetitions = async (): Promise<Competition[]> => {
  return fetchJson<Competition[]>('/api/competitions')
}

/**
 * Récupère les équipes d'une compétition via ton backend
 * Backend endpoint attendu : GET /api/teams/[competitionId]
 */
export const getTeams = async (competitionId: number): Promise<Team[]> => {
  return fetchJson<Team[]>(`/api/teams/${competitionId}`)
}

/**
 * Récupère les derniers matchs d'une équipe via ton backend
 * Backend endpoint attendu : GET /api/teams/matches/[teamId]
 */
export const getLastMatches = async (teamId: number): Promise<Match[]> => {
  return fetchJson<Match[]>(`/api/teams/matches/${teamId}`)
}

/**
 * Si tu veux récupérer les prochains matchs : soit ton backend gère un param type/ status,
 * soit tu crées un endpoint dédié. Exemple ci‑dessous en utilisant query param 'type=next'.
 *
 * Backend attendu : GET /api/teams/matches/[teamId]?type=next
 */
export const getNextMatches = async (teamId: number): Promise<Match[]> => {
  return fetchJson<Match[]>(`/api/teams/matches/${teamId}?type=next`)
}

/**
 * (Optionnel) Récupérer les infos d'une équipe si ton backend propose un endpoint dédié
 * Ex: GET /api/teams/info/[teamId]
 */
export const getTeamInfo = async (teamId: number): Promise<any> => {
  return fetchJson<Team>(`/api/teams/info/${teamId}`)
}

// export const getTeamPlayers = async (teamId: number): Promise<Player[]> => {
//   const res = await fetchJson<any>(`/api/teams/players/${teamId}`)
//   // Certains endpoints renvoient { squad: [...] } ou { players: [...] }
//   if (Array.isArray(res)) return res
//   if (res.players && Array.isArray(res.players)) return res.players
//   if (res.squad && Array.isArray(res.squad)) return res.squad
//   return []
// }
export const getTeamPlayers = async (teamId: number) => {
  const res = await fetchJson<any>(`/api/teams/players/${teamId}`)
  return res;

}


