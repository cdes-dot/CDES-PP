// Utilidades para manejo del cache durante desarrollo y producción
import { globalCache } from './cache';

/**
 * Invalidar cache específico por tipo de contenido
 */
export const invalidateCache = {
  // Invalidar datos de navegación y globales (layout)
  layout: () => {
    globalCache.invalidatePattern(/^fetch.*navegacion/);
    globalCache.invalidatePattern(/^fetch.*global/);
    console.log('🗑️ Layout cache invalidated');
  },

  // Invalidar datos de artículos/noticias
  articles: () => {
    globalCache.invalidatePattern(/^getData.*articulos/);
    globalCache.invalidatePattern(/^fetch.*articulos/);
    console.log('🗑️ Articles cache invalidated');
  },

  // Invalidar datos de proyectos
  projects: () => {
    globalCache.invalidatePattern(/^getData.*proyectos/);
    globalCache.invalidatePattern(/^fetch.*proyectos/);
    console.log('🗑️ Projects cache invalidated');
  },

  // Invalidar datos de videos
  videos: () => {
    globalCache.invalidatePattern(/^fetch.*pagina-principal/);
    console.log('🗑️ Videos cache invalidated');
  },

  // Invalidar datos de contacto
  contact: () => {
    globalCache.invalidatePattern(/^fetch.*contacto/);
    console.log('🗑️ Contact cache invalidated');
  },

  // Invalidar datos de equipo y miembros
  team: () => {
    globalCache.invalidate('equipoTecnico:full');
    globalCache.invalidate('miembros:full');
    console.log('🗑️ Team cache invalidated');
  },

  // Invalidar todo
  all: () => {
    globalCache.clear();
    console.log('🗑️ All cache invalidated');
  }
};

/**
 * Obtener estadísticas del cache para debugging
 */
export const getCacheStats = () => {
  return globalCache.getStats();
};

/**
 * Pre-calentar el cache con datos importantes
 */
export const warmupCache = async () => {
  try {
    console.log('🔥 Warming up cache...');
    
    const baseUrl = import.meta.env.PUBLIC_STRAPI_URL;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.PUBLIC_STRAPI_KEY}`,
    };

    // Pre-cargar datos críticos en paralelo
    const warmupTasks = [
      // Datos de layout (navegación y global)
      fetch(`${baseUrl}/api/navegacion?populate=*`, { headers }),
      fetch(`${baseUrl}/api/global?populate=*`, { headers }),
      
      // Datos de página principal
      fetch(`${baseUrl}/api/pagina-principal?populate[Contenidos][populate]=*`, { headers }),
      
      // Datos de contacto
      fetch(`${baseUrl}/api/contacto?populate[Contacto][populate]=*`, { headers }),
    ];

    await Promise.allSettled(warmupTasks);
    console.log('🔥 Cache warmup completed');
  } catch (error) {
    console.error('❌ Cache warmup failed:', error);
  }
};

// Función para debugging - mostrar estado del cache
export const debugCache = () => {
  const stats = getCacheStats();
  console.group('📊 Cache Debug Info');
  console.log(`Total entries: ${stats.size}`);
  console.log('Entries:');
  
  stats.entries.forEach(entry => {
    const ageMinutes = Math.floor(entry.age / 1000 / 60);
    const ttlMinutes = Math.floor(entry.ttl / 1000 / 60);
    console.log(`  ${entry.key}: ${ageMinutes}min old, ${ttlMinutes}min TTL ${entry.expired ? '(EXPIRED)' : '(VALID)'}`);
  });
  
  console.groupEnd();
  return stats;
};

// En desarrollo, exponer utilidades globalmente
if (import.meta.env.DEV) {
  (globalThis as any).cacheUtils = {
    invalidate: invalidateCache,
    stats: getCacheStats,
    debug: debugCache,
    warmup: warmupCache,
    clear: () => globalCache.clear()
  };
  
  console.log('🛠️ Cache utilities available globally as window.cacheUtils');
}