import { getCachedData } from './cache';

export const getData = async (url: string, meta: boolean = false) => {
  // Determinar el tipo de cache basado en la URL
  let cacheType: 'navigation' | 'global' | 'articles' | 'projects' | 'videos' | 'contact' | 'team' | 'members' | undefined;
  
  if (url.includes('navegacion')) cacheType = 'navigation';
  else if (url.includes('global')) cacheType = 'global';
  else if (url.includes('articulos')) cacheType = 'articles';
  else if (url.includes('proyectos')) cacheType = 'projects';
  else if (url.includes('pagina-principal')) cacheType = 'videos';
  else if (url.includes('contacto')) cacheType = 'contact';
  else if (url.includes('equipo')) cacheType = 'team';
  else if (url.includes('miembros')) cacheType = 'members';
  
  const cacheKey = `getData:${url}:meta:${meta}`;
  
  return getCachedData(
    cacheKey,
    async () => {
      try {
        const response = await fetch(
          `${import.meta.env.PUBLIC_STRAPI_URL}/api/${url}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.PUBLIC_STRAPI_KEY}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (meta) {
          const json = await response.json();
          return [json.data, json.meta];
        }

        const json = await response.json();
        return json.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    },
    cacheType
  );
};

// Interfaz para el modelo de Equipo Técnico
export interface EquipoTecnicoItem {
  id: number;
  documentId: string;
  Nombres: string;
  Apellidos: string;
  contacto: string;
  Portada?: {
    id: number;
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  };
  Puesto?: {
    id: number;
    Nombre: string;
  };
}

/**
 * Obtiene el equipo técnico con todas sus relaciones (Portada y Puesto)
 * @returns Array de miembros del equipo técnico
 */
export const getEquipoTecnico = async (): Promise<EquipoTecnicoItem[]> => {
  const cacheKey = 'equipoTecnico:full';
  
  return getCachedData(
    cacheKey,
    async () => {
      try {
        const response = await fetch(
          `${import.meta.env.PUBLIC_STRAPI_URL}/api/equipo-tecnicos?populate[Portada]=*&populate[Puesto]=*`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.PUBLIC_STRAPI_KEY}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        console.log("Equipo Técnico raw response (cached):", JSON.stringify(json, null, 2));
        
        return json.data || [];
      } catch (error) {
        console.error("Error fetching equipo técnico:", error);
        return [];
      }
    },
    'team'
  );
};

// Interfaz para el modelo de Miembro
export interface MiembroItem {
  id: number;
  documentId: string;
  Nombres: string;
  Apellidos: string;
  Portada?: {
    id: number;
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  };
  institucion?: {
    id: number;
    Nombre: string;
  };
  Puestos?: {
    id: number;
    Nombre: string;
  }[];
}

/**
 * Obtiene los miembros con todas sus relaciones (Portada, institucion y Puestos)
 * @returns Array de miembros
 */
export const getMiembros = async (): Promise<MiembroItem[]> => {
  const cacheKey = 'miembros:full';
  
  return getCachedData(
    cacheKey,
    async () => {
      try {
        const response = await fetch(
          `${import.meta.env.PUBLIC_STRAPI_URL}/api/miembros?populate[Portada]=*&populate[institucion]=*&populate[Puestos]=*`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.PUBLIC_STRAPI_KEY}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        console.log("Miembros raw response (cached):", JSON.stringify(json, null, 2));
        
        return json.data || [];
      } catch (error) {
        console.error("Error fetching miembros:", error);
        return [];
      }
    },
    'members'
  );
};
