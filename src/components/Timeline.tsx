import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
type TimelineEntry = {
  date: string;
  title: string;
  content: string;
};

const Timeline = ({ timeline }: { timeline: any }) => {
  const [currentEvent, setCurrentEvent] = useState(timeline[0]);
  
  return (
    <section className="py-32">
      <div className="gap-4">
        <h1 className="text-foreground mb-10 text-center text-3xl font-bold tracking-tighter ">
          Nuestra Historia
        </h1>
        <div className="flex lg:flex-row flex-col relative w-full space-x-6">

          <div className="lg:w-4/5 w-full">
            <h1 className="text-foreground mb-10 text-center text-3xl font-bold tracking-tighter">
              {currentEvent.Titulo}
            </h1>
            {
              currentEvent.Media && (<img
                className="rounded-md object-cover mb-10"
                src={currentEvent.Media.url}
              />)
            }

            <p className="text-muted-foreground mb-10 text-center text-lg tracking-tight">
              {currentEvent.Descripcion}
            </p>
          </div>
          <div className="lg:w-1/2 w-full">
            {timeline.map((entry: any, index: number) => (
              <Card className="border-none relative mb-10 pl-8 cursor-pointer h-fit shadow-none bg-neutral-200 " onClick={() => setCurrentEvent(entry)}>
                <CardHeader>
                  <CardTitle className="rounded-xl text-lg font-bold tracking-tight">
                    {entry.Titulo}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-sm">
                    {new Date(entry.Fecha).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </CardHeader>

              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Timeline };
