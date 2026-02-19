import { getCachedData } from './cache';

/**
 * Helper function to normalize image URLs from Strapi
 * Handles both absolute and relative URLs
 */
const normalizeImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  // If URL is already absolute (starts with http:// or https://), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // If URL is relative, prepend STRAPI_URL
  return `${import.meta.env.PUBLIC_STRAPI_URL}${url}`;
};

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
  Nombre: string;
  Apellidos: string;
  Contacto: string;
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
          `${import.meta.env.PUBLIC_STRAPI_URL}/api/equipo-tecnicos?populate=Portada`,
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
        console.log("Equipo Técnico raw response:", JSON.stringify(json, null, 2));
        
        // Transformar la estructura de Strapi a un formato plano
        const transformedData = (json.data || []).map((item: any) => {
          const attrs = item.attributes || item;
          
          return {
            id: item.id,
            documentId: item.documentId,
            Nombre: attrs.Nombre,
            Apellidos: attrs.Apellidos,
            Contacto: attrs.Contacto,
            Portada: attrs.Portada?.data ? {
              id: attrs.Portada.data.id,
              url: `${import.meta.env.PUBLIC_STRAPI_URL}${attrs.Portada.data.attributes.url}`,
              formats: attrs.Portada.data.attributes.formats
            } : undefined,
            puesto: attrs.puesto?.data ? {
              id: attrs.puesto.data.id,
              Nombre: attrs.puesto.data.attributes.Nombre
            } : undefined
          };
        });
        
        console.log("Equipo Técnico transformed:", JSON.stringify(transformedData, null, 2));
        return transformedData;
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
          `${import.meta.env.PUBLIC_STRAPI_URL}/api/miembros?populate=Portada`,
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
        console.log("Miembros raw response:", JSON.stringify(json, null, 2));
        
        // Transformar la estructura de Strapi a un formato plano
        const transformedData = (json.data || []).map((item: any) => {
          const attrs = item.attributes || item;
          
          return {
            id: item.id,
            documentId: item.documentId,
            Nombres: attrs.Nombres,
            Apellidos: attrs.Apellidos,
            Portada: attrs.Portada?.data ? {
              id: attrs.Portada.data.id,
              url: normalizeImageUrl(attrs.Portada.data.attributes?.url || attrs.Portada.data.url),
              formats: attrs.Portada.data.attributes?.formats
            } : undefined
          };
        });
        
        console.log("Miembros transformed:", JSON.stringify(transformedData, null, 2));
        return transformedData;
      } catch (error) {
        console.error("Error fetching miembros:", error);
        return [];
      }
    },
    'members'
  );
};
