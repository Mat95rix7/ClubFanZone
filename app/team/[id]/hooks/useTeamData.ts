import { useTeamStore } from "@/store/useTeamStore"
import { useEffect, useState } from "react"
import { getTeamFullData } from "@/lib/api"

export default function useTeamData(teamId: number) {
  const { getTeamData, setTeamData, isCacheValid, setTeamId } = useTeamStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cachedData = getTeamData(teamId)

  useEffect(() => {
    const fetchData = async () => {
      if (!teamId) return

      setTeamId(teamId)

      if (isCacheValid(teamId)) {
        console.log('📦 Données chargées depuis le cache')
        setLoading(false)
        return
      }

      console.log('🌐 Chargement depuis l\'API...')
      setLoading(true)
      setError(null)

      try {
        const data = await getTeamFullData(teamId)

        const sortedLastMatches = [...data.lastMatches]
          .filter((m) => m.utcDate)
          .sort((a, b) => new Date(b.utcDate!).getTime() - new Date(a.utcDate!).getTime())

        setTeamData(teamId, {
          info: data.team,
          lastMatches: sortedLastMatches,
          nextMatches: data.nextMatches,
          players: data.players,
        })

        console.log('✅ Données sauvegardées en cache')
      } catch (err: any) {
        console.error('❌ Erreur chargement équipe :', err)
        setError("Impossible de récupérer les données de l'équipe")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [teamId, setTeamId, getTeamData, setTeamData, isCacheValid])

  return {
    teamInfo: cachedData?.info || null,
    lastMatches: cachedData?.lastMatches || [],
    nextMatches: cachedData?.nextMatches || [],
    players: cachedData?.players || [],
    loading,
    error,
  }
}
