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
      <div className="container">
        <h1 className="text-foreground mb-10 text-center text-3xl font-bold tracking-tighter ">
          Nuestra Historia
        </h1>
        <div className="flex lg:flex-row flex-col relative mx-auto max-w-4xl gap-4">
          <div className="w-4/5">
            <h1 className="text-foreground mb-10 text-center text-3xl font-bold tracking-tighter">
              {currentEvent.Titulo}
            </h1>
            <p className="text-muted-foreground mb-10 text-center text-lg tracking-tight">
              {currentEvent.Descripcion}
            </p>
          </div>
          <div className="w-1/5">
            {timeline.map((entry: any, index: number) => (
              <Card className="my-5 border-none shadow-none relative mb-10 pl-8" onClick={() => setCurrentEvent(entry)}>
                <CardHeader>
                  <CardTitle className="rounded-xl py-2 text-xl font-bold tracking-tight xl:mb-4 xl:px-3">
                    {entry.Titulo}
                  </CardTitle>

                  <CardDescription className="text-md -left-34 text-muted-foreground top-3 rounded-xl tracking-tight xl:absolute">
                    {entry.Fecha}
                  </CardDescription>

                </CardHeader>
                <CardContent className="px-0 xl:px-2">
                  <div
                    className="prose dark:prose-invert text-foreground mx-2"
                    dangerouslySetInnerHTML={{ __html: entry.Descripcion }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Timeline };
