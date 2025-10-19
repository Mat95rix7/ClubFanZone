// ===================================
// 4. Hook React personnalisé (hooks/usePlayerStats.ts)
// ===================================

import { useState, useEffect } from 'react'
import { apiFootballService } from '@/lib/api-football-service'
import { PlayerStats } from '@/lib/api-football'

export function usePlayerStats(playerName: string, season: number = 2024, league: number) {
  const [stats, setStats] = useState<PlayerStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  


  useEffect(() => {
    let isMounted = true
    
    const fetchStats = async () => {
      if (!playerName) return
      
      setLoading(true)
      setError(null)
      
      try {
        const data = await apiFootballService.getPlayerStats(playerName, season, league)
        
        if (isMounted) {
          setStats(data)
          if (!data) {
            setError('Aucune statistique trouvée')
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('Erreur lors du chargement des statistiques')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    fetchStats()
    
    return () => {
      isMounted = false
    }
  }, [playerName, season])
  
  return { stats, loading, error }
}
