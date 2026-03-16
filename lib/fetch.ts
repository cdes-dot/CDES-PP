import { getCachedData } from './cache';

const normalizeImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${import.meta.env.PUBLIC_STRAPI_URL}${url}`;
};

export const getData = async (url: string, meta: boolean = false) => {
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

        const json = await response.json();

        if (meta) return [json.data, json.meta];
        return json.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    },
    cacheType
  );
};

// ─── Interfaces ───────────────────────────────────────────────

export interface PortadaItem {
  id: number;
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

export interface EquipoTecnicoItem {
  id: number;
  documentId: string;
  Nombre: string;
  Apellidos: string;
  Contacto: string;
  Portada?: PortadaItem;
  puesto?: string;
}

export interface MiembroItem {
  id: number;
  documentId: string;
  Nombres: string;
  Apellidos: string;
  Portada?: PortadaItem;
  institucion?: { id: number; Nombre: string };
  puesto?: string;
}

// ─── Helper: normalizar Portada (Strapi 5 formato plano) ──────

const normalizePortada = (portada: any): PortadaItem | undefined => {
  if (!portada) return undefined;

  // Strapi 5 — formato plano: { id, url, formats, ... }
  if (portada.url) {
    return {
      id: portada.id,
      url: normalizeImageUrl(portada.url),
      formats: portada.formats,
    };
  }

  // Strapi 4 — legacy: { data: { id, attributes: { url } } }
  if (portada.data?.attributes?.url) {
    return {
      id: portada.data.id,
      url: normalizeImageUrl(portada.data.attributes.url),
      formats: portada.data.attributes.formats,
    };
  }

  return undefined;
};

// ─── Helper: normalizar relación simple (puesto, institucion) ─

const normalizeRelacion = (rel: any): { id: number; Nombre: string } | undefined => {
  if (!rel) return undefined;

  // Strapi 5 — plano: { id, Nombre }
  if (rel.Nombre) return { id: rel.id, Nombre: rel.Nombre };

  // Strapi 4 — legacy: { data: { id, attributes: { Nombre } } }
  if (rel.data?.attributes?.Nombre) {
    return { id: rel.data.id, Nombre: rel.data.attributes.Nombre };
  }

  return undefined;
};

// ─── getEquipoTecnico ─────────────────────────────────────────

export const getEquipoTecnico = async (): Promise<EquipoTecnicoItem[]> => {
  return getCachedData(
    'equipoTecnico:full',
    async () => {
      const response = await fetch(
        `${import.meta.env.PUBLIC_STRAPI_URL}/api/equipo-tecnicos?populate[Portada]=*`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.PUBLIC_STRAPI_KEY}`,
          },
        },
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const json = await response.json();

      return (json.data || []).map((item: any): EquipoTecnicoItem => ({
        id: item.id,
        documentId: item.documentId,
        Nombre: item.Nombre,
        Apellidos: item.Apellidos,
        Contacto: item.Contacto,
        Portada: normalizePortada(item.Portada),
        puesto: item.puesto || item.Puesto,
      }));
    },
    'team'
  );
};

// ─── getMiembros ──────────────────────────────────────────────

export const getMiembros = async (): Promise<MiembroItem[]> => {
  return getCachedData(
    'miembros:full',
    async () => {
      const response = await fetch(
        `${import.meta.env.PUBLIC_STRAPI_URL}/api/miembros?populate[Portada]=*&populate[institucion][fields][0]=Nombre`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.PUBLIC_STRAPI_KEY}`,
          },
        },
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const json = await response.json();

      return (json.data || []).map((item: any): MiembroItem => ({
        id: item.id,
        documentId: item.documentId,
        Nombres: item.Nombres,
        Apellidos: item.Apellidos,
        Portada: normalizePortada(item.Portada),
        puesto: item.puesto || item.Puesto,
        institucion: normalizeRelacion(item.institucion),
      }));
    },
    'members'
  );
};
