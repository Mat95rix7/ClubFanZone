
import { useState, useEffect } from 'react'
import { getCompetitionStandings } from '@/lib/api'
import { CompetitionStandings } from '@/types'

export function useStandings(competitionId: number | null) {
  const [standings, setStandings] = useState<CompetitionStandings | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!competitionId) {
      setStandings(null)
      return
    }

    const fetchStandings = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getCompetitionStandings(competitionId)
        setStandings(data)
      } catch (err: any) {
        console.error('Error loading standings:', err)
        setError(err.message || 'Impossible de charger le classement')
      } finally {
        setLoading(false)
      }
    }

    fetchStandings()
  }, [competitionId])

  return { standings, loading, error }
}
