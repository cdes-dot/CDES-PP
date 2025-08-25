import { useEffect, useState } from "react";
import client from "@/lib/meilisearch";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Eye } from "lucide-react";
import { Input } from "./ui/input";

type RichTextChild = {
  text: string;
  type?: string;
};

type RichText = {
  type: string;
  children: RichTextChild[];
};

type Institucion = {
  id: number;
  Nombre: string;
};

type Proyecto = {
  id: number;
  documentId: string;
  Titulo: string;
  Objetivos: (string | RichText)[];
  Alcance: string;
  instituciones: Institucion[];
  Descripcion?: string | null;
  Portada?: { url: string } | null;
};

const extractText = (objetivo: string | RichText): string => {
  if (typeof objetivo === "string") return objetivo;
  if (objetivo.type === "paragraph" && objetivo.children) {
    return objetivo.children.map((child) => child.text).join(" ");
  }
  return "";
};

const TodosProyectos = () => {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(false);

  const index = client.index("proyecto");

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await index.search("", { limit: 20 });
        setResultados(res.hits as Proyecto[]);
      } catch (err) {
        console.error(err);
        setResultados([]);
      }
      setLoading(false);
    };
    fetchAll();
  }, [index]);

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await index.search(query, { limit: 20 });
      setResultados(res.hits as Proyecto[]);
    } catch (err) {
      console.error(err);
      setResultados([]);
    }
    setLoading(false);
  };

  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <form onSubmit={buscar} className="flex gap-2 mb-4">
          <Input
            type="search"
            placeholder="Buscar proyectos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Buscando..." : "Buscar"}
          </Button>
        </form>

        <div className="text-sm text-muted-foreground mb-4">
          {resultados.length} proyecto{resultados.length !== 1 ? "s" : ""} encontrados
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
          {resultados.map((proyecto) => (
            <Card
              key={proyecto.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="pb-4">
                <h3 className="text-xl font-semibold mb-2 font-noto">
                  {proyecto.Titulo}
                </h3>
              </CardHeader>

              <CardContent className="space-y-6 min-h-[249px]">
                {/* Objetivos */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-primary">Objetivos</h4>
                  {proyecto.Objetivos.map((obj, idx) => (
                    <p
                      key={idx}
                      className="text-muted-foreground text-sm font-inter leading-relaxed"
                    >
                      {extractText(obj)}
                    </p>
                  ))}
                </div>

                {/* Alcance */}
                {proyecto.Alcance && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-primary">Alcance</h4>
                    <p className="text-muted-foreground text-sm font-inter">
                      {proyecto.Alcance.trim()}
                    </p>
                  </div>
                )}

                {/* Instituciones */}
                {proyecto.instituciones.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-primary">
                      Instituciones Involucradas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {proyecto.instituciones.map((inst) => (
                        <Badge key={inst.id} variant="secondary" className="text-xs">
                          {inst.Nombre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Descripción opcional */}
                {proyecto.Descripcion && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-primary">Descripción</h4>
                    <p className="text-muted-foreground text-sm font-inter">
                      {proyecto.Descripcion}
                    </p>
                  </div>
                )}

                {/* Portada opcional */}
                {proyecto.Portada?.url && (
                  <img
                    src={proyecto.Portada.url}
                    alt={proyecto.Titulo}
                    className="w-full h-auto rounded"
                  />
                )}
              </CardContent>

              <CardFooter>
                <a href={`/proyecto/${proyecto.documentId}`} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalles del Proyecto
                  </Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TodosProyectos;
