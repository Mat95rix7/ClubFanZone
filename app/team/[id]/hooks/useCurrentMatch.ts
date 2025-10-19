import { useEffect, useState } from 'react'

interface CurrentMatch {
  id: number
  homeTeam: {
    id: number
    name: string
    logo: string
  }
  awayTeam: {
    id: number
    name: string
    logo: string
  }
  score: {
    home: number
    away: number
  }
  status: string
  minute: number
  competition: {
    id: number
    name: string
    logo: string
  }
  startTime: string
}

export function useCurrentMatch(teamId: number) {
  const [currentMatch, setCurrentMatch] = useState<CurrentMatch | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchCurrentMatch = async () => {
    try {
      const response = await fetch(`/api/teams/matches/${teamId}/current`, {
        cache: 'no-store'
      })
      
      if (response.ok) {
        const data = await response.json()
        setCurrentMatch(data)
      } else {
        setCurrentMatch(null)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du match en cours:', error)
      setCurrentMatch(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchCurrentMatch()

    // Mise à jour toutes les 30 secondes
    const interval = setInterval(fetchCurrentMatch, 30000)

    return () => clearInterval(interval)
  }, [teamId])

  return { currentMatch, loading, refetch: fetchCurrentMatch }
}