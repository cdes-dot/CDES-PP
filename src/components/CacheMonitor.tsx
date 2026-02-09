// Componente para monitorear el cache durante desarrollo
import { useState, useEffect } from 'react';
import { getCacheStats, debugCache, invalidateCache } from '../../lib/cache-utils';

const CacheMonitor = () => {
  const [stats, setStats] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Solo mostrar en desarrollo
    if (import.meta.env.DEV) {
      const updateStats = () => {
        setStats(getCacheStats());
      };

      updateStats();
      const interval = setInterval(updateStats, 2000); // Actualizar cada 2 segundos

      return () => clearInterval(interval);
    }
  }, []);

  // Solo renderizar en desarrollo
  if (!import.meta.env.DEV || !stats) return null;

  const validEntries = stats.entries.filter((entry: any) => !entry.expired);
  const expiredEntries = stats.entries.filter((entry: any) => entry.expired);

  return (
    <>
      {/* Botón flotante para mostrar/ocultar */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 10000,
          background: '#007ACC',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '20px',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}
        title="Toggle Cache Monitor"
      >
        📊
      </button>

      {/* Panel del monitor */}
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            width: '400px',
            maxHeight: '80vh',
            overflowY: 'auto',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            zIndex: 9999,
            fontSize: '14px',
            fontFamily: 'monospace'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, color: '#333' }}>Cache Monitor</h3>
            <button
              onClick={() => setIsVisible(false)}
              style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          {/* Estadísticas generales */}
          <div style={{ marginBottom: '16px', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
            <div><strong>Total Entries:</strong> {stats.size}</div>
            <div><strong>Valid:</strong> <span style={{ color: 'green' }}>{validEntries.length}</span></div>
            <div><strong>Expired:</strong> <span style={{ color: 'orange' }}>{expiredEntries.length}</span></div>
          </div>

          {/* Botones de acción */}
          <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => invalidateCache.all()}
              style={{ 
                padding: '4px 8px', 
                background: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Clear All
            </button>
            <button
              onClick={() => invalidateCache.layout()}
              style={{ 
                padding: '4px 8px', 
                background: '#6c757d', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Clear Layout
            </button>
            <button
              onClick={() => debugCache()}
              style={{ 
                padding: '4px 8px', 
                background: '#007ACC', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Debug Console
            </button>
          </div>

          {/* Lista de entradas */}
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>Cache Entries</h4>
            {stats.entries.length === 0 ? (
              <div style={{ color: '#666', fontStyle: 'italic' }}>No cache entries</div>
            ) : (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {stats.entries.map((entry: any, index: number) => {
                  const ageMinutes = Math.floor(entry.age / 1000 / 60);
                  const ttlMinutes = Math.floor(entry.ttl / 1000 / 60);
                  const isExpired = entry.expired;
                  
                  return (
                    <div
                      key={index}
                      style={{
                        padding: '8px',
                        margin: '4px 0',
                        background: isExpired ? '#fff3cd' : '#d4edda',
                        border: `1px solid ${isExpired ? '#ffeaa7' : '#c3e6cb'}`,
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    >
                      <div style={{ fontWeight: 'bold', color: isExpired ? '#856404' : '#155724' }}>
                        {entry.key.length > 50 ? entry.key.substring(0, 50) + '...' : entry.key}
                      </div>
                      <div style={{ color: '#666', marginTop: '4px' }}>
                        Age: {ageMinutes}min | TTL: {ttlMinutes}min
                        {isExpired && <span style={{ color: '#dc3545', marginLeft: '8px' }}>EXPIRED</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CacheMonitor;