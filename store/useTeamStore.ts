"use client"

import { create } from 'zustand'

type TeamStore = {
  teamId: number | null
  setTeamId: (id: number) => void
}

export const useTeamStore = create<TeamStore>((set) => ({
  teamId: typeof window !== 'undefined' ? Number(localStorage.getItem('teamId')) || null : null,
  setTeamId: (id: number) => {
    set({ teamId: id })
    if (typeof window !== 'undefined') localStorage.setItem('teamId', String(id))
  },
}))
