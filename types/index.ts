// src/types/index.ts

export type Area = {
  id?: number
  name?: string
  code?: string
  flag?: string
}

export type Competition = {
  id: number
  name: string
  code?: string
  type?: string
  emblem?: string
  area?: Area
}

export type Team = {
  id: number
  name: string
  shortName?: string
  tla?: string
  crest?: string
  address?: string
  website?: string
  founded?: number
  clubColors?: string
  venue?: string
  area?: Area
  runningCompetitions?: Competition[]
  coach?: Coach
  squad?: Player[]
  staff?: any[]
  lastUpdated?: string
}

export type Coach = {
  id?: number
  name: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  nationality?: string
  contract?: {
    start?: string
    until?: string
  }
}

export type MatchTeam = {
  id: number
  name: string
  crest?: string
}

export type MatchScore = {
  fullTime?: { home?: number | null; away?: number | null }
  halfTime?: { home?: number | null; away?: number | null }
  winner?: string | null
}

export type Match = {
  id: number
  utcDate: string
  competition?: Competition
  homeTeam: MatchTeam
  awayTeam: MatchTeam
  score?: MatchScore
  status?: string
}

export type Player = {
  id: number
  name: string
  position?: string
  nationality?: string
  dateOfBirth?: string
}

// ============================================================================
// TYPES
// ============================================================================

export type MainTab = "info" | "squad" | "palmares" | "competitions"
export type CompetitionSubTab = "last" | "next" | "standings"

export interface TabConfig {
  id: string
  label: string
  icon: string
  count?: number
}

export interface StandingPosition {
  position: number
  team: {
    id: number
    name: string
    shortName: string
    tla: string
    crest: string
  }
  playedGames: number
  form: string | null
  won: number
  draw: number
  lost: number
  points: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
}

export interface StandingTable {
  stage: string
  type: string
  group: string | null
  table: StandingPosition[]
}

export interface CompetitionStandings {
  competition: {
    id: number
    name: string
    code: string
    type: string
    emblem: string
  }
  season: {
    id: number
    startDate: string
    endDate: string
    currentMatchday: number
  }
  standings: StandingTable[]
}
