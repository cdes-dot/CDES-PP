import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchFileUrl } from "../../lib/firebase";
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
}

const index = client.index("documents");

export default function BibliotecaSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [documentosFiltrados, setDocumentosFiltrados] = useState<Documento[]>(
    [],
  );
  const [documentosUrls, setDocumentosUrls] = useState<
    Record<string, { coverUrl: string; pdfUrl: string }>
  >({});
  const [isSearching, setIsSearching] = useState(true);
  const [filtros, setFiltros] = useState({
    categoria: "",
    puesto_trabajo: "",
    fechaDesde: "",
    fechaHasta: "",
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [facetas, setFacetas] = useState({
    categoria: [] as string[],
    puesto_trabajo: [] as string[],
  });

  // Fetch facetas
  const fetchFacetas = useCallback(async () => {
    const results = await index.search("", {
      facets: ["categoria", "puesto_trabajo"],
      limit: 0,
    });
    setFacetas({
      categoria: Object.keys(results.facetDistribution?.categoria || {}),
      puesto_trabajo: Object.keys(
        results.facetDistribution?.puesto_trabajo || {},
      ),
    });
  }, []);

  useEffect(() => {
    fetchFacetas();
  }, [fetchFacetas]);

  // Buscar documentos
  useEffect(() => {
    const search = async () => {
      setIsSearching(true);
      const filterConditions: string[] = [];
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

      try {
        const searchResults = await index.search(searchTerm, {
          filter: filterConditions,
        });
        const docs = searchResults.hits as Documento[];
        setDocumentosFiltrados(docs);

        // Obtener URLs de Firebase para cada documento
        const urls: Record<string, { coverUrl: string; pdfUrl: string }> = {};
        await Promise.all(
          docs.map(async (doc) => {
            console.log(doc.cover_image_path);
            const coverUrl = doc.cover_image_path
              ? await fetchFileUrl(doc.cover_image_path)
              : "/placeholder.jpg";
            const pdfUrl = await fetchFileUrl(doc.storage_path);
            urls[doc.id] = { coverUrl, pdfUrl };
          }),
        );
        setDocumentosUrls(urls);
      } catch (error) {
        console.error("Error during search:", error);
        setDocumentosFiltrados([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(() => {
      search();
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm, filtros]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFiltros((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFiltros({
      categoria: "",
      puesto_trabajo: "",
      fechaDesde: "",
      fechaHasta: "",
    });
    setSearchTerm("");
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
                />
              </CardHeader>
              <CardContent className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold mb-2 text-gray-800 flex-grow">
                  {doc.title}
                </h2>
                <p className="text-gray-700 text-sm mb-4 flex-grow">
                  {doc.summary}
                </p>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />{" "}
                    {new Date(doc.date).toLocaleDateString()}
                  </p>
                  <p className="flex items-center">
                    <Hash className="mr-2 h-4 w-4" />{" "}
                    <Badge variant="secondary">{doc.categoria}</Badge>
                  </p>
                  <p className="flex items-center">
                    <Building className="mr-2 h-4 w-4" /> {doc.puesto_trabajo}
                  </p>
                </div>
                <div className="mt-auto flex gap-2">
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
