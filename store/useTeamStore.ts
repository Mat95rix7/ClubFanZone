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

  // Actions
  setTeamCache: (teamId: number, data: Partial<TeamCache>) => void
  getTeamCache: (teamId: number) => TeamCache | null
  isCacheValid: (teamId: number, maxAge?: number) => boolean

  // Nettoyage
  clearCache: () => void
  clearTeamCache: (teamId: number) => void
  clearCurrentTeam: () => void // 🔹 ajoutée ici
}

const CACHE_MAX_AGE = 5 * 60 * 1000 // 5 minutes

export const useTeamStore = create<TeamStore>()(
  persist(
    (set, get) => ({
      teamId: null,
      teamsCache: {},

      setTeamId: (id: number) => set({ teamId: id }),

      setTeamCache: (teamId: number, data: Partial<TeamCache>) => {
        set((state) => ({
          teamsCache: {
            ...state.teamsCache,
            [teamId]: {
              info: data.info ?? state.teamsCache[teamId]?.info ?? null,
              lastMatches: data.lastMatches ?? state.teamsCache[teamId]?.lastMatches ?? [],
              nextMatches: data.nextMatches ?? state.teamsCache[teamId]?.nextMatches ?? [],
              players: data.players ?? state.teamsCache[teamId]?.players ?? [],
              lastFetched: Date.now(),
            },
          },
        }))
      },

      getTeamCache: (teamId: number) => get().teamsCache[teamId] || null,

      isCacheValid: (teamId: number, maxAge: number = CACHE_MAX_AGE) => {
        const cache = get().teamsCache[teamId]
        if (!cache?.lastFetched) return false
        return Date.now() - cache.lastFetched < maxAge
      },

      clearCache: () => set({ teamsCache: {} }),

      clearTeamCache: (teamId: number) => {
        set((state) => {
          const newCache = { ...state.teamsCache }
          delete newCache[teamId]
          return { teamsCache: newCache }
        })
      },

      // 🔹 Nouvelle fonction pour effacer l'équipe sélectionnée
      clearCurrentTeam: () => {
        const currentTeamId = get().teamId
        if (currentTeamId) {
          get().clearTeamCache(currentTeamId)
        }
        set({ teamId: null })
      },
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
