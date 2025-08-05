"use client"
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Eye
} from 'lucide-react'

// Datos de proyectos actuales del CDES (simplificados según la imagen)
type Proyecto = {
  instituciones?: { [key: string]: any }[]; // puede estar ausente o null
};

function contarInstitucionesTotales(proyectos: Proyecto[]): number {
  return proyectos.reduce((total, proyecto) => {
    const count = Array.isArray(proyecto.instituciones)
      ? proyecto.instituciones.length
      : 0;
    return total + count;
  }, 0);
}
export default function ProyectosSection({ proyectos }: { proyectos: any[] }) {
  console.log(proyectos)
  proyectos.map((proyecto) => {
    proyecto.Objetivos.map((item: any) => {
      item.children.map((child: any) => {
        console.log(child.text)
      })
    })
  })
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
          {proyectos.map((proyecto) => {
            const IconComponent = proyecto.icono
            return (
              <Card key={proyecto.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 font-noto">
                        {proyecto.Titulo}
                      </h3>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 min-h-[249px]">
                  {/* Objetivos */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-primary">Objetivos</h4>

                    {
                      proyecto.Objetivos.map((item: any) => {
                        return item.children.map((child: any) => {
                          return (
                            <p className="text-muted-foreground text-sm font-inter leading-relaxed">
                              {child.text}
                            </p>
                          )
                        })
                      })
                    }
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
                      {proyecto.Alcance}
                    </p>
                  </div>

                  {/* Instituciones Involucradas */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-primary">Instituciones Involucradas</h4>
                    <div className="flex flex-wrap gap-2">
                      {proyecto.instituciones.map((institucion: any, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {institucion.Nombre}
                        </Badge>
                      ))}
                    </div>
                  </div>

                </CardContent>
                <CardFooter>
                  {/* Botón Ver Detalles */}
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
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Footer Section */}
        <div className="mt-16 bg-background rounded-lg border shadow-sm p-8">
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-semibold font-playfair">
              Impacto en el Desarrollo de Santiago
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{proyectos.length}</div>
                <div className="text-sm text-muted-foreground">Proyectos Estratégicos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">1.3M+</div>
                <div className="text-sm text-muted-foreground">Ciudadanos Beneficiados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">RD$ 11B</div>
                <div className="text-sm text-muted-foreground">Inversión Total</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{contarInstitucionesTotales(proyectos)}</div>
                <div className="text-sm text-muted-foreground">Instituciones Aliadas</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg">
                Ver Todos los Proyectos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                Únete como Aliado Estratégico
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}