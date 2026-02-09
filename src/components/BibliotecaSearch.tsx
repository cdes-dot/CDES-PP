import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchFileUrl, getFirebaseServices } from "../../lib/firebase";

// Obtener firestore desde los servicios de Firebase
const { firestore } = getFirebaseServices();

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Download,
  FileText,
  Calendar,
  Building,
  Hash,
  Filter,
  X,
  Loader,
} from "lucide-react";
import client from "@/lib/meilisearch";
import { collection, getDocs, query, where } from "firebase/firestore";

// Tipos para documentos
interface Documento {
  id: string;
  title: string;
  summary: string;
  filename: string;
  file_extension: string;
  date: string;
  categoria: string;
  puesto_trabajo: string;
  cover_image_path?: string;
  storage_path: string;
  
  // Campos adicionales de Firestore
  apartado?: string;
  created_at?: string;
  updated_at?: string;
  estrategia?: string;
  file_hash?: string;
  file_id?: string;
  file_size_bytes?: number;
  hash?: string;
  keywords?: string[];
  media_type?: string;
  original_filename?: string;
  processing_time_estimate?: string;
  processing_timestamp?: string;
  public?: boolean;
  upload_timestamp?: string;
  uploader_email?: string;
  uploader_id?: string;
  user_role?: string;
  version?: number;
}

// Fix for MeiliSearch client initialization
const meiliClient = client(); // Ensure client is instantiated
const index = meiliClient.index("library");

export default function BibliotecaSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [documentosFiltrados, setDocumentosFiltrados] = useState<Documento[]>([]);
  const [documentosUrls, setDocumentosUrls] = useState<
    Record<string, { coverUrl: string; pdfUrl: string }>
  >({});
  const [isSearching, setIsSearching] = useState(true);
  
  // FIXED: Usar useState para objeto inmutable y useMemo para estabilizar
  const [filtrosBase, setFiltrosBase] = useState({
    categoria: "",
    puesto_trabajo: "",
    fechaDesde: "",
    fechaHasta: "",
  });
  
  // Memorizar el objeto filtros para evitar recreación
  const filtros = useMemo(() => filtrosBase, [filtrosBase]);
  
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [facetas, setFacetas] = useState({
    categoria: [] as string[],
    puesto_trabajo: [] as string[],
  });
  const [useMeilisearch, setUseMeilisearch] = useState(true);

  // Check Meilisearch availability
  useEffect(() => {
    const checkMeilisearch = async () => {
      try {
        await index.search("", { limit: 1 });
        setUseMeilisearch(true);
      } catch {
        setUseMeilisearch(false);
      }
    };
    checkMeilisearch();
  }, []);

  // Fetch facetas with fallback
  const fetchFacetas = useCallback(async () => {
    if (useMeilisearch) {
      try {
        const results = await index.search("", {
          facets: ["categoria", "puesto_trabajo"],
          limit: 0,
        });
        setFacetas({
          categoria: Object.keys(results.facetDistribution?.categoria || {}),
          puesto_trabajo: Object.keys(results.facetDistribution?.puesto_trabajo || {}),
        });
      } catch {
        // Fallback to Firestore
        setUseMeilisearch(false);
      }
    }
    
    if (!useMeilisearch) {
      try {
        const libraryRef = collection(firestore, "library");
        const snapshot = await getDocs(query(libraryRef, where("public", "==", true)));
        
        const categorias = new Set<string>();
        const puestosTrabajo = new Set<string>();
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.categoria) categorias.add(data.categoria);
          if (data.puesto_trabajo) puestosTrabajo.add(data.puesto_trabajo);
        });
        
        setFacetas({
          categoria: Array.from(categorias),
          puesto_trabajo: Array.from(puestosTrabajo),
        });
      } catch {
        setFacetas({
          categoria: [],
          puesto_trabajo: [],
        });
      }
    }
  }, [useMeilisearch]);

  useEffect(() => {
    fetchFacetas();
  }, [fetchFacetas]);

  // Search documents with Meilisearch
  const searchWithMeilisearch = async () => {
    const filterConditions: string[] = [];
    filterConditions.push(`public = true`);

    if (filtros.categoria)
      filterConditions.push(`categoria = "${filtros.categoria}"`);
    if (filtros.puesto_trabajo)
      filterConditions.push(`puesto_trabajo = "${filtros.puesto_trabajo}"`);

    if (filtros.fechaDesde) {
      const date = new Date(filtros.fechaDesde);
      filterConditions.push(`date >= ${Math.floor(date.getTime() / 1000)}`);
    }
    if (filtros.fechaHasta) {
      const date = new Date(filtros.fechaHasta);
      filterConditions.push(`date <= ${Math.floor(date.getTime() / 1000)}`);
    }

    const searchResults = await index.search(searchTerm, {
      filter: filterConditions,
    });
    return searchResults.hits as Documento[];
  };

  // Search documents with Firestore
  const searchWithFirestore = async () => {
    const libraryRef = collection(firestore, "library");
    let firestoreQuery = query(libraryRef, where("public", "==", true));

    if (filtros.categoria) {
      firestoreQuery = query(firestoreQuery, where("categoria", "==", filtros.categoria));
    }
    if (filtros.puesto_trabajo) {
      firestoreQuery = query(firestoreQuery, where("puesto_trabajo", "==", filtros.puesto_trabajo));
    }
    if (filtros.fechaDesde) {
      const fechaDesde = new Date(filtros.fechaDesde).toISOString().split('T')[0];
      firestoreQuery = query(firestoreQuery, where("date", ">=", fechaDesde));
    }
    if (filtros.fechaHasta) {
      const fechaHasta = new Date(filtros.fechaHasta).toISOString().split('T')[0];
      firestoreQuery = query(firestoreQuery, where("date", "<=", fechaHasta));
    }
    
    const snapshot = await getDocs(firestoreQuery);
    
    let docs = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        summary: data.summary || "",
        filename: data.filename || data.original_filename || "",
        file_extension: data.file_extension || "",
        date: data.date || data.created_at || "",
        categoria: data.categoria || "",
        puesto_trabajo: data.puesto_trabajo || "",
        cover_image_path: data.cover_image_path || "",
        storage_path: data.storage_path || "",
        ...data
      } as Documento;
    });

    if (searchTerm) {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      docs = docs.filter(doc => {
        const titleMatch = doc.title?.toLowerCase().includes(lowercaseSearchTerm) || false;
        const summaryMatch = doc.summary?.toLowerCase().includes(lowercaseSearchTerm) || false;
        const keywordsMatch = doc.keywords?.some(keyword => 
          keyword.toLowerCase().includes(lowercaseSearchTerm)
        ) || false;
        return titleMatch || summaryMatch || keywordsMatch;
      });
    }
    
    return docs;
  };

  // Main search effect
  useEffect(() => {
    const search = async () => {
      setIsSearching(true);
      
      try {
        let docs: Documento[] = [];
        
        if (useMeilisearch) {
          try {
            docs = await searchWithMeilisearch();
          } catch {
            setUseMeilisearch(false);
            docs = await searchWithFirestore();
          }
        } else {
          docs = await searchWithFirestore();
        }

        const urls: Record<string, { coverUrl: string; pdfUrl: string }> = {};

        await Promise.all(
          docs.map(async (doc) => {
            try {
              const coverUrl = doc.cover_image_path
                ? await fetchFileUrlWrapper(doc.cover_image_path)
                : "/placeholder.jpg";
              
              if (useMeilisearch) {
                const pdfUrl = await fetchFileUrlWrapper(doc.storage_path);
                urls[doc.id] = { coverUrl, pdfUrl };
              } else {
                urls[doc.id] = { coverUrl, pdfUrl: "#" };
              }
            } catch {
              urls[doc.id] = { coverUrl: "/placeholder.jpg", pdfUrl: "#" };
            }
          })
        );

        setDocumentosFiltrados(docs);
        setDocumentosUrls(urls);
      } catch {
        setDocumentosFiltrados([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(() => {
      search();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filtros.categoria, filtros.puesto_trabajo, filtros.fechaDesde, filtros.fechaHasta, useMeilisearch]); // FIXED: usar propiedades específicas en lugar del objeto completo

  const handleFilterChange = (filterName: string, value: string) => {
    setFiltrosBase((prev) => ({ ...prev, [filterName]: value })); // FIXED: usar setFiltrosBase
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiltrosBase((prev: typeof filtrosBase) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFiltrosBase({
      categoria: "",
      puesto_trabajo: "",
      fechaDesde: "",
      fechaHasta: "",
    });
    setSearchTerm("");
  };

  const handleDownload = async (doc: Documento) => {
    if (!useMeilisearch) {
      if (!doc.storage_path) {
        alert("Este documento no tiene un archivo adjunto.");
        return;
      }
      try {
        const url = await fetchFileUrlWrapper(doc.storage_path);
        window.open(url, '_blank');
      } catch {
        alert("No se pudo obtener el enlace de descarga.");
      }
    }
  };

  const categorias = facetas.categoria;
  const puestos = facetas.puesto_trabajo;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Biblioteca Digital
      </h1>

      <div className="bg-transparent shadow-lg rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <Input
              type="text"
              placeholder="Buscar por título, resumen o palabra clave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <Button
            type="button"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="h-12 w-full md:w-auto"
          >
            <Filter className="mr-2 h-4 w-4" />
            {mostrarFiltros ? "Ocultar Filtros" : "Mostrar Filtros"}
          </Button>
          {(filtros.categoria ||
            filtros.puesto_trabajo ||
            filtros.fechaDesde ||
            filtros.fechaHasta ||
            searchTerm) && (
            <Button
              type="button"
              onClick={resetFilters}
              variant="ghost"
              className="h-12 w-full md:w-auto"
            >
              <X className="mr-2 h-4 w-4" />
              Limpiar
            </Button>
          )}
        </div>

        {mostrarFiltros && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <Select
              onValueChange={(value) => handleFilterChange("categoria", value)}
              value={filtros.categoria}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) =>
                handleFilterChange("puesto_trabajo", value)
              }
              value={filtros.puesto_trabajo}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por puesto de trabajo" />
              </SelectTrigger>
              <SelectContent>
                {puestos.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="fechaDesde"
                className="text-sm font-medium text-gray-600"
              >
                Desde
              </label>
              <Input
                type="date"
                name="fechaDesde"
                value={filtros.fechaDesde}
                onChange={handleDateChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="fechaHasta"
                className="text-sm font-medium text-gray-600"
              >
                Hasta
              </label>
              <Input
                type="date"
                name="fechaHasta"
                value={filtros.fechaHasta}
                onChange={handleDateChange}
              />
            </div>
          </div>
        )}
      </div>

      {isSearching ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="h-16 w-16 animate-spin text-blue-600" />
        </div>
      ) : documentosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {documentosFiltrados.map((doc) => (
            <Card
              key={doc.id}
              className="flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader className="p-0">
                <img
                  src={documentosUrls[doc.id]?.coverUrl || "/placeholder.jpg"}
                  alt={`Portada de ${doc.title}`}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.jpg';
                  }}
                />
              </CardHeader>
              <CardContent className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold mb-2 text-gray-800 flex-grow">
                  {doc.title || "Sin título"}
                </h2>
                <p className="text-gray-700 text-sm mb-4 flex-grow">
                  {doc.summary || "Sin descripción"}
                </p>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  {doc.date && (
                    <p className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />{" "}
                      {(() => {
                        try {
                          return new Date(doc.date).toLocaleDateString();
                        } catch {
                          return doc.date;
                        }
                      })()}
                    </p>
                  )}
                  {doc.categoria && (
                    <div className="flex items-center">
                      <Hash className="mr-2 h-4 w-4" />{" "}
                      <Badge variant="secondary">{doc.categoria}</Badge>
                    </div>
                  )}
                  {doc.puesto_trabajo && (
                    <p className="flex items-center">
                      <Building className="mr-2 h-4 w-4" /> {doc.puesto_trabajo}
                    </p>
                  )}
                  {doc.keywords && doc.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-auto flex gap-2">
                  {useMeilisearch ? (
                    <Button asChild className="w-full">
                      <a
                        href={documentosUrls[doc.id]?.pdfUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Descargar PDF
                      </a>
                    </Button>
                  ) : (
                    <Button 
                      className="w-full"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Descargar PDF
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No se encontraron resultados
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Intenta ajustar tu búsqueda o filtros.
          </p>
        </div>
      )}
    </div>
  );
}

// Fix for fetchFileUrl function calls
// Updated to use only one argument as per the function definition
const fetchFileUrlWrapper = async (path: string) => {
  try {
    return await fetchFileUrl(path);
  } catch (error) {
    console.error("Error fetching file URL:", error);
    return "/placeholder.jpg"; // Fallback URL
  }
};