// Sistema de cache global para optimizar peticiones HTTP
interface CacheItem {
  data: any;
  timestamp: number;
  ttl: number;
}

class GlobalCache {
  private cache = new Map<string, CacheItem>();
  
  // TTL por defecto: 5 minutos
  private defaultTTL = 5 * 60 * 1000;
  
  // TTL específicos por tipo de datos
  private ttlConfig = {
    // Datos de navegación (cambian raramente): 15 minutos
    'navigation': 15 * 60 * 1000,
    'global': 15 * 60 * 1000,
    
    // Datos de contenido: 5 minutos
    'articles': 5 * 60 * 1000,
    'projects': 5 * 60 * 1000,
    'videos': 10 * 60 * 1000,
    
    // Datos de contacto (casi estáticos): 30 minutos
    'contact': 30 * 60 * 1000,
    
    // Equipo y miembros (cambian poco): 20 minutos
    'team': 20 * 60 * 1000,
    'members': 20 * 60 * 1000,
  };

  /**
   * Obtiene datos del cache o ejecuta la función de fetch si no existen o han expirado
   */
  async get<T>(
    key: string, 
    fetchFn: () => Promise<T>,
    cacheType?: keyof typeof this.ttlConfig
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();
    const ttl = cacheType ? this.ttlConfig[cacheType] : this.defaultTTL;
    
    // Si existe en cache y no ha expirado, devolverlo
    if (cached && (now - cached.timestamp < cached.ttl)) {
      console.log(`🟢 Cache HIT for: ${key}`);
      return cached.data;
    }
    
    console.log(`🔵 Cache MISS for: ${key}, fetching...`);
    
    try {
      const data = await fetchFn();
      
      // Guardar en cache
      this.cache.set(key, {
        data,
        timestamp: now,
        ttl
      });
      
      return data;
    } catch (error) {
      console.error(`❌ Error fetching data for key ${key}:`, error);
      
      // Si hay un error pero tenemos datos en cache (aunque expirados), devolverlos
      if (cached) {
        console.log(`🟡 Returning expired cache data for: ${key}`);
        return cached.data;
      }
      
      throw error;
    }
  }

  /**
   * Invalida una entrada específica del cache
   */
  invalidate(key: string): void {
    this.cache.delete(key);
    console.log(`🗑️ Cache invalidated for: ${key}`);
  }

  /**
   * Invalida múltiples entradas por patrón
   */
  invalidatePattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
        console.log(`🗑️ Cache invalidated for pattern match: ${key}`);
      }
    }
  }

  /**
   * Limpia todo el cache
   */
  clear(): void {
    this.cache.clear();
    console.log('🧹 Cache completely cleared');
  }

  /**
   * Limpia entradas expiradas
   */
  cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp >= item.ttl) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned ${cleanedCount} expired cache entries`);
    }
  }

  /**
   * Obtiene estadísticas del cache
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      entries: Array.from(this.cache.entries()).map(([key, item]) => ({
        key,
        age: Date.now() - item.timestamp,
        ttl: item.ttl,
        expired: Date.now() - item.timestamp >= item.ttl
      }))
    };
  }
}

// Instancia global del cache
export const globalCache = new GlobalCache();

// Helper functions para casos de uso comunes
export const getCachedData = async <T>(
  key: string, 
  fetchFn: () => Promise<T>,
  cacheType?: 'navigation' | 'global' | 'articles' | 'projects' | 'videos' | 'contact' | 'team' | 'members'
): Promise<T> => {
  return globalCache.get(key, fetchFn, cacheType);
};

// Función helper para peticiones HTTP con cache
export const fetchWithCache = async (
  url: string,
  options: RequestInit = {},
  cacheType?: 'navigation' | 'global' | 'articles' | 'projects' | 'videos' | 'contact' | 'team' | 'members'
) => {
  const cacheKey = `fetch:${url}:${JSON.stringify(options)}`;

  return getCachedData(
    cacheKey,
    async () => {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    cacheType
  );
};

// Remove global setInterval for cleanup (not allowed in Cloudflare Workers)
// Instead, provide a manual cleanup function
export const cleanupCache = () => {
  if (typeof globalThis !== 'undefined') {
    globalCache.cleanup();
  }
};