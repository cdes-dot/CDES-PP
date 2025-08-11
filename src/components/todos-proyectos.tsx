import { useEffect, useState } from "react";
import client from "@/lib/meilisearch";
import ProyectosSection from "./Proyectos";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Eye } from "lucide-react";
import { Input } from "./ui/input";

type Proyecto = {
    id: number;
    documentId: string;
    titulo: string;
    objetivos: string
    alcance: string
    instituciones: string[]
    // ...otros campos que necesites mostrar
};

const TodosProyectos = ({ }: {}) => {
    const [query, setQuery] = useState("");
    const [resultados, setResultados] = useState<Proyecto[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const index = client.index("proyectos");
                const res = await index.search("", { limit: 20 }); // "" para traer todos
                setResultados(res.hits as Proyecto[]);
            } catch (err) {
                setResultados([]);
            }
            setLoading(false);
        };
        fetchAll();
    }, []);

    const buscar = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const index = client.index("proyectos");
            const res = await index.search(query, { limit: 20 });
            console.log(res)
            setResultados(res.hits as Proyecto[]);
        } catch (err) {
            setResultados([]);
        }
        setLoading(false);
    };

    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto  max-w-7xl px-6">
                <div className="w-full">
                    <div className="w-full">
                        <form onSubmit={buscar} className="flex gap-2 mb-4 ">
                            <Input
                                type="search"

                                placeholder="Buscar proyectos..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />
                            <Button
                                type="submit"
                                className="bg-primary text-white px-4 py-2 rounded"
                                disabled={loading}
                            >
                                {loading ? "Buscando..." : "Buscar"}
                            </Button>
                        </form>
                        <div className="grid grid-cols-3 mx-auto gap-3">
                            {resultados.map(proyecto => (
                                <Card key={proyecto.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold mb-2 font-noto">
                                                    {proyecto.titulo}
                                                </h3>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-6 min-h-[249px]">
                                        {/* Objetivos */}
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-sm text-primary">Objetivos</h4>


                                            <p className="text-muted-foreground text-sm font-inter leading-relaxed">
                                                {proyecto.objetivos}
                                            </p>

                                            {/*proyecto.objetivos.map((obj: any, index: number) => (
                      <p className="text-muted-foreground text-sm font-inter leading-relaxed">
                        {obj}
                      </p>
                    ))*/}

                                        </div>

                                        {/* Alcance */}
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-sm text-primary">Alcance</h4>
                                            <p className="text-muted-foreground text-sm font-inter">
                                                {proyecto.alcance}
                                            </p>
                                        </div>

                                        {/* Instituciones Involucradas */}
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-sm text-primary">Instituciones Involucradas</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {proyecto.instituciones.map((institucion: any, index: number) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {institucion}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                    </CardContent>
                                    {/* <CardFooter>
                                      
                                        <div className="pt-4 border-t w-full">
                                            <a href={`/proyecto/${proyecto.documentId}`} className="w-full">


                                                <Button
                                                    variant="outline"
                                                    className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Ver Detalles del Proyecto
                                                </Button>
                                            </a>
                                        </div>
                                    </CardFooter>*/}
                                </Card>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TodosProyectos;