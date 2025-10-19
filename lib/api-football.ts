// ===================================
// 1. Configuration API (lib/api-football.ts)
// ===================================

export const API_FOOTBALL_CONFIG = {
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
    'x-rapidapi-host': 'v3.football.api-sports.io'
  }
}

// Types pour les réponses API
export interface PlayerStats {
  player: {
    id: number
    name: string
    firstname: string
    lastname: string
    age: number
    birth: {
      date: string
      place: string
      country: string
    }
    nationality: string
    height: string
    weight: string
    injured: boolean
    photo: string
  }
  statistics: Array<{
    team: {
      id: number
      name: string
      logo: string
    }
    league: {
      id: number
      name: string
      country: string
      logo: string
      season: number
    }
    games: {
      appearences: number
      lineups: number
      minutes: number
      number: number
      position: string
      rating: string
      captain: boolean
    }
    substitutes: {
      in: number
      out: number
      bench: number
    }
    shots: {
      total: number
      on: number
    }
    goals: {
      total: number
      conceded: number
      assists: number
      saves: number
    }
    passes: {
      total: number
      key: number
      accuracy: number
    }
    tackles: {
      total: number
      blocks: number
      interceptions: number
    }
    duels: {
      total: number
      won: number
    }
    dribbles: {
      attempts: number
      success: number
      past: number
    }
    fouls: {
      drawn: number
      committed: number
    }
    cards: {
      yellow: number
      yellowred: number
      red: number
    }
    penalty: {
      won: number
      commited: number
      scored: number
      missed: number
      saved: number
    }
  }>
}

export interface PlayerTrophy {
  league: string
  country: string
  season: string
  place: string
}
