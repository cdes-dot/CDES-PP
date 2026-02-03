"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  Users,
  Target,
  ArrowRight,
  Building,
  Leaf,
  Car,
  GraduationCap,
  Eye,
} from "lucide-react";
import { Resumen } from "./resumen";

// Tipo de proyecto según el nuevo esquema
type Proyecto = {
  id: number;
  documentId: string;
  Titulo: string;
  Portada: any;
  Descripcion: any[];
  Objetivos?: any[];
  eje_estrategico?: {
    id: number;
    Nombre: string;
  };
};
export default function ProyectosSection({
  proyectos,
  children,
}: {
  proyectos: Proyecto[];
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-muted py-16 md:py-32">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Header con Foto */}
        {/*<div className="text-center mb-16">
          <div className="bg-background rounded-lg border shadow-sm p-8 mb-8">
            <div className="aspect-video overflow-hidden rounded-lg mb-6">
              <img
                src="/trabajadores.jpg"
                alt="Proyectos CDES Santiago"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg width='800' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='16' fill='%236b7280'%3EProyectos CDES Santiago%3C/text%3E%3C/svg%3E"
                }}
              />
            </div>
            <h2 className="text-4xl font-bold mb-4 font-playfair">
              Proyectos en Desarrollo
            </h2>
            <p className="text-muted-foreground text-lg font-inter max-w-4xl mx-auto">
              Profundizar más la importancia de CDES en los proyectos actualmente en desarrollo para
              mejorar la ciudad de Santiago
            </p>
          </div>
        </div>*/}

        {/* Grid de Proyectos - Estructura según imagen */}
        <div className="grid gap-8 lg:grid-cols-2">
          {proyectos.map((proyecto) => (
              <Card
                key={proyecto.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 font-noto">
                        {proyecto.Titulo}
                      </h3>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 min-h-[200px]">
                  {/* Eje Estratégico */}
                  {proyecto.eje_estrategico && (
                    <div className="space-y-2">
                      <Badge variant="outline" className="text-xs">
                        {proyecto.eje_estrategico.Nombre}
                      </Badge>
                    </div>
                  )}

                  {/* Objetivos */}
                  {proyecto.Objetivos && proyecto.Objetivos.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-primary">
                        Objetivos
                      </h4>
                      {proyecto.Objetivos.map((item: any, idx: number) => (
                        <div key={idx}>
                          {item.children?.map((child: any, childIdx: number) => (
                            <p
                              key={childIdx}
                              className="text-muted-foreground text-sm font-inter leading-relaxed"
                            >
                              {child.text}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {/* Botón Ver Detalles */}
                  <div className="pt-4 border-t w-full">
                    <a
                      href={`/proyecto/${proyecto.documentId}`}
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalles del Proyecto
                      </Button>
                    </a>
                  </div>
                </CardFooter>
              </Card>
            ))}
        </div>

        {/* Footer Section */}
        {children}
      </div>
    </section>
  );
}
