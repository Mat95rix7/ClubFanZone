// ===================================
// 2. Service de Cache (lib/cache.ts)
// ===================================

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map()
  
  // Durée de cache : 24h pour les stats, 7 jours pour les trophées
  private readonly STATS_TTL = 24 * 60 * 60 * 1000 // 24 heures
  private readonly TROPHIES_TTL = 7 * 24 * 60 * 60 * 1000 // 7 jours
  
  set<T>(key: string, data: T, ttl: number = this.STATS_TTL): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl
    }
    this.cache.set(key, entry)
    
    // Sauvegarder dans localStorage pour persistance
    try {
      // Note: Ne pas utiliser dans Claude.ai artifacts
      // localStorage.setItem(`cache_${key}`, JSON.stringify(entry))
    } catch (e) {
      console.warn('Cache localStorage non disponible')
    }
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      // Essayer de récupérer depuis localStorage
      try {
        // const stored = localStorage.getItem(`cache_${key}`)
        // if (stored) {
        //   const parsed: CacheEntry<T> = JSON.parse(stored)
        //   if (parsed.expiresAt > Date.now()) {
        //     this.cache.set(key, parsed)
        //     return parsed.data
        //   }
        // }
      } catch (e) {
        console.warn('Erreur lecture cache')
      }
      return null
    }
    
    // Vérifier expiration
    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data as T
  }
  
  clear(): void {
    this.cache.clear()
  }
  
  getStatsTTL(): number {
    return this.STATS_TTL
  }
  
  getTrophiesTTL(): number {
    return this.TROPHIES_TTL
  }
}

export const cacheService = new CacheService()