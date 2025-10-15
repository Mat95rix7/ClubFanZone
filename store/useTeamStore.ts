"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import { Team, Match, Player } from "@/types"

type TeamCache = {
  info: Team | null
  lastMatches: Match[]
  nextMatches: Match[]
  players: Player[]
  lastFetched: number | null
}

type TeamStore = {
  teamId: number | null
  setTeamId: (id: number) => void

  // Cache par équipe
  teamsCache: Record<number, TeamCache>

  // Actions principales
  setTeamData: (teamId: number, data: {
    info: Team
    lastMatches: Match[]
    nextMatches: Match[]
    players: Player[]
  }) => void
  
  getTeamData: (teamId: number) => TeamCache | null
  isCacheValid: (teamId: number, maxAge?: number) => boolean

  // Nettoyage
  clearCache: () => void
}

const CACHE_MAX_AGE = 5 * 60 * 1000 // 5 minutes

export const useTeamStore = create<TeamStore>()(
  persist(
    (set, get) => ({
      teamId: null,
      teamsCache: {},

      setTeamId: (id: number) => set({ teamId: id }),

      // Stocker toutes les données d'équipe en une fois
      setTeamData: (teamId: number, data: {
        info: Team
        lastMatches: Match[]
        nextMatches: Match[]
        players: Player[]
      }) => {
        set((state) => ({
          teamsCache: {
            ...state.teamsCache,
            [teamId]: {
              info: data.info,
              lastMatches: data.lastMatches,
              nextMatches: data.nextMatches,
              players: data.players,
              lastFetched: Date.now(),
            },
          },
        }))
      },

      // Récupérer les données d'une équipe
      getTeamData: (teamId: number) => get().teamsCache[teamId] || null,

      // Vérifier si le cache est valide
      isCacheValid: (teamId: number, maxAge: number = CACHE_MAX_AGE) => {
        const cache = get().teamsCache[teamId]
        if (!cache?.lastFetched) return false
        return Date.now() - cache.lastFetched < maxAge
      },

      // Vider tout le cache
      clearCache: () => set({ teamsCache: {}, teamId: null }),
    }),
    {
      name: "fanzone-team-storage",
      partialize: (state) => ({
        teamId: state.teamId,
        teamsCache: state.teamsCache,
      }),
    }
  )
)