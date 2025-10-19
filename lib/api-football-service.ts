// ===================================
// 4. Service API mis à jour (lib/api-football-service.ts)
// ===================================

import { PlayerStats, PlayerTrophy } from './api-football'
import { cacheService } from './cache'

export class APIFootballService {
  private requestCount = 0
  private readonly MAX_DAILY_REQUESTS = 100
  
  // Rechercher un joueur par nom via notre API route
  async searchPlayer(playerName: string, season: number = 2023, league: number): Promise<number | null> {
    const cacheKey = `player_id_${playerName}_${season}`
  
    
    const cached = cacheService.get<number>(cacheKey)
    if (cached) {
      console.log(`✅ ID de ${playerName} récupéré du cache: ${cached}`)
      return cached
    }
    
    if (this.requestCount >= this.MAX_DAILY_REQUESTS) {
      console.warn('⚠️ Limite de requêtes API atteinte (100/jour)')
      return null
    }
    
    try {
      // Appel à notre API route Next.js (pas de CORS !)
      const response = await fetch(
        `/api/players/search?name=${encodeURIComponent(playerName)}&season=${season}&league=${league}`
      )
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }
      
      const data = await response.json()
      this.requestCount++
      
      if (data.response && data.response.length > 0) {
        const playerId = data.response[0].player.id
        
        // Cache 30 jours
        cacheService.set(cacheKey, playerId, 30 * 24 * 60 * 60 * 1000)
        
        console.log(`📡 ID de ${playerName} trouvé: ${playerId} (${this.requestCount}/100)`)
        return playerId
      }
      
      return null
    } catch (error) {
      console.error('Erreur recherche joueur:', error)
      return null
    }
  }
  
  // Récupérer les stats par ID via notre API route
  async getPlayerStatsByID(playerId: number, season: number = 2024): Promise<PlayerStats | null> {
    const cacheKey = `player_stats_id_${playerId}_${season}`
    
    const cached = cacheService.get<PlayerStats>(cacheKey)
    if (cached) {
      console.log(`✅ Stats du joueur #${playerId} récupérées du cache`)
      return cached
    }
    
    if (this.requestCount >= this.MAX_DAILY_REQUESTS) {
      console.warn('⚠️ Limite de requêtes API atteinte (100/jour)')
      return null
    }
    
    try {
      // Appel à notre API route Next.js
      const response = await fetch(
        `/api/players/${playerId}?season=${season}`
      )
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }
      
      const data = await response.json()
      this.requestCount++
      
      if (data.response && data.response.length > 0) {
        const playerData = data.response[0]
        
        // Cache 24h
        cacheService.set(cacheKey, playerData, cacheService.getStatsTTL())
        
        console.log(`📡 Stats du joueur #${playerId} récupérées (${this.requestCount}/100)`)
        return playerData
      }
      
      return null
    } catch (error) {
      console.error('Erreur API Football:', error)
      return null
    }
  }
  
  // Méthode principale : recherche + stats
  async getPlayerStats(playerName: string, season: number = 2024, league: number): Promise<PlayerStats | null> {
    const cacheKey = `player_stats_${playerName}_${season}`
    
    const cached = cacheService.get<PlayerStats>(cacheKey)
    if (cached) {
      console.log(`✅ Stats complètes de ${playerName} récupérées du cache`)
      return cached
    }
    
    // 1. Rechercher l'ID
    const playerId = await this.searchPlayer(playerName, season, league)
    if (!playerId) {
      console.warn(`⚠️ Joueur "${playerName}" non trouvé`)
      return null
    }
    
    // 2. Récupérer les stats
    const stats = await this.getPlayerStatsByID(playerId, season)
    
    if (stats) {
      cacheService.set(cacheKey, stats, cacheService.getStatsTTL())
    }
    
    return stats
  }
  
  // Récupérer les trophées via notre API route
  async getPlayerTrophies(playerId: number): Promise<PlayerTrophy[]> {
    const cacheKey = `player_trophies_${playerId}`
    
    const cached = cacheService.get<PlayerTrophy[]>(cacheKey)
    if (cached) {
      console.log(`✅ Trophées récupérés du cache`)
      return cached
    }
    
    if (this.requestCount >= this.MAX_DAILY_REQUESTS) {
      console.warn('⚠️ Limite de requêtes API atteinte')
      return []
    }
    
    try {
      // Appel à notre API route Next.js
      const response = await fetch(`/api/trophies/${playerId}`)
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }
      
      const data = await response.json()
      this.requestCount++
      
      if (data.response) {
        // Cache 7 jours
        cacheService.set(cacheKey, data.response, cacheService.getTrophiesTTL())
        
        console.log(`📡 Trophées récupérés de l'API (${this.requestCount}/100)`)
        return data.response
      }
      
      return []
    } catch (error) {
      console.error('Erreur API Football:', error)
      return []
    }
  }
  
  getRemainingRequests(): number {
    return this.MAX_DAILY_REQUESTS - this.requestCount
  }
}

export const apiFootballService = new APIFootballService()
