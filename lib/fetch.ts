export const getData = async (url: string, meta: boolean = false) => {
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
    console.log("Equipo Técnico raw response:", JSON.stringify(json, null, 2));
    
    return json.data || [];
  } catch (error) {
    console.error("Error fetching equipo técnico:", error);
    return [];
  }
};
