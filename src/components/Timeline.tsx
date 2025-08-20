import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type TimelineEntry = {
  date: string;
  title: string;
  content: string;
};

const Timeline = ({ timeline }: { timeline: any }) => {
  return (
    <section className="py-32">
      <div className="w-full max-w-6xl mx-auto px-4">
        <h1 className="text-foreground mb-10 text-center text-3xl font-bold tracking-tighter">
          Nuestra Historia
        </h1>
        
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {timeline.map((event: any, index: number) => (
              <CarouselItem
                key={event.documentId || index}
                className="pl-2 md:pl-4 md:basis-4/5 lg:basis-3/4"
              >
                <Card className="overflow-hidden h-full">
                  <CardContent className="p-0 h-full flex flex-col">
                    <motion.div
                      className="w-full h-full flex flex-col"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {/* Imagen */}
                      {event.Media && (
                        <div className="relative overflow-hidden flex-shrink-0">
                          <img
                            className="w-full h-64 md:h-80 object-cover"
                            src={event.Media.url}
                            alt={event.Titulo}
                          />
                          {/* Overlay con fecha */}
                          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm">
                            {new Date(event.Fecha).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "short",
                            })}
                          </div>
                        </div>
                      )}
                      
                      {/* Contenido */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h2 className="text-foreground mb-4 text-xl md:text-2xl font-bold tracking-tight">
                            {event.Titulo}
                          </h2>
                          
                          <p className="text-muted-foreground mb-4 text-sm md:text-base leading-relaxed flex-1">
                            {event.Descripcion}
                          </p>
                        </div>
                        
                        <p className="text-xs text-muted-foreground font-medium mt-auto">
                          {new Date(event.Fecha).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious className="left-2 md:left-4" />
          <CarouselNext className="right-2 md:right-4" />
        </Carousel>

        {/* Información adicional */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Desliza para explorar nuestra historia • {timeline.length} hitos importantes</p>
        </div>
      </div>
    </section>
  );
};

export { Timeline };