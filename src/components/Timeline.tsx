import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type TimelineEntry = {
    date: string;
    title: string;
    content: string;
};

const timelineData: TimelineEntry[] = [
    {
        date: "1993",
        title: "Los Juevones Estratégicos",
        content:
            "Convocatoria de actores claves y ciudadanos independientes para analizar el crecimiento poblacional y urbanístico de la ciudad, formando el primer grupo gestor de impulso denominado “Los Juevones Estratégicos.",
    },
    {
        date: "1996",
        title: "Asamblea fundacional",
        content:
            "Reunión de organizaciones de gobierno, sociedad civil, academias, organizaciones no gubernamentales, juntas de vecinos, movimientos de derechos humanos y ciudadanos y munícipes independientes. ",
    },
    {
        date: "1998",
        title: "Incorporación institucional por Decreto Presidencial No.  57-98",
        content:
            "Proceso en el cual los órganos del Estado Dominicano reconocen las organizaciones públicas y privadas acogidas a la ley y la Constitución. ",
    },
    {
        date: "1999",
        title: "Inicio contratación de consultores",
        content:
            "Proceso en el que se inició con la exploración de la estructura de las comisiones técnicas como organismo de participación social. Se solicitó en manera de concurso público un conjunto de especialistas en diversas disciplinas del saber, muy en especial en demografía, urbanismo, economía, sociología, salud pública, arquitectura, gestión social, y otras disciplinas de las áreas de gestión de proyectos, permitiendo la elaboración de análisis que involucraran todas las instituciones con capacidad de impulsar el desarrollo de Santiago.",
    },
    {
        date: "2000",
        title: "Creación Comisiones técnicas",
        content:
            "Proceso de formación de las primeras cinco comisiones técnicas de formulación del Plan Estratégico 2000-2010. Órganos estructurados por la junta de directores del CDES, de la matrícula de socios de esta entidad y del conjunto de organizaciones públicas y privadas de la ciudad y el municipio de Santiago. ",
    },
    {
        date: "2001",
        title: "Culminación del primer diagnóstico de la ciudad y el municipio de Santiago y su entorno regional.",
        content:
            `Compilación ejecutiva del conjunto de análisis, variables, e indicadores que conforman el sistema territorial de Santiago, dividido en cinco ejes: 
            \n i) Población y organización social; \nii)  Uso del suelo, infraestructura y equipamiento comunitario; \n iii) Ambiente; \n iv) Gobernanza; \n v) Economía.
            
            Paralelamente a esta valoración se realizaron los siguientes análisis externos: 
            i) El proceso de Globalización; 
            ii) Santiago de los Caballeros ante la dinámica internacional; 
            iii) La Revolución Científico Tecnológica; 
            iv) La banca multilateral en el contexto regional; 
            v) Oportunidades y amenazas de la dinámica internacional para Santiago. 

            Selección de los 158 proyectos prioritarios de la ciudad de Santiago y 29 programas.
            `,
    },
    {
        date: "2002",
        title: "Organización del primer evento de puesta en valor del Plan Estratégico Santiago 2002-2010",
        content:
            "Articulación y diseño del gran encuentro ciudadano, organizado en el viejo Aeropuerto de Santiago para llamar la atención sobre el proyecto más emblemático de este Plan Estratégico, el Parque Central o metropolitano de Santiago.  ",
    },
    {
        date: "2003",
        title: "Inicio de la implantación del nuevo Plan Estratégico y Creación de la primera Unidad de Gestión de Proyectos",
        content:
            "Para asegurar el impulso de los proyectos de alta prioridad del primer Plan Estratégico de Santiago, se crea la Unidad de Gestión de Proyectos adscrita a la Oficina Técnica Coordinadora del CDES, bajo la coordinación de la Dirección Ejecutiva. Igualmente, la asignación de grupos de impulso por proyectos prioritarios.",
    },
    {
        date: "2004",
        title: "Primer proyecto de cooperación",
        content:
            "Aprobación del primer proyecto de cooperación de largo alcance de la Unión Europea para apoyar la implantación del Plan Estratégico Santiago 2002-2010, iniciativa denominada: Programa para la reforma y modernización del Estado (PARME). Una partida financiera importante que contribuyó a impulsar los trabajos. ",
    },

];

const Timeline = ({timeline}: {timeline: any}) => {
    return (
        <section className="py-32">
            <div className="container">
                <h1 className="text-foreground mb-10 text-center text-3xl font-bold tracking-tighter ">
                    Nuestra Historia
                </h1>
                <div className="relative mx-auto max-w-4xl">
                    <Separator
                        orientation="vertical"
                        className="bg-white absolute left-2 top-4"
                    />
                    {timeline.map((entry: any, index: number) => (
                        <div key={index} className="relative mb-10 pl-8">
                            <div className="bg-foreground absolute left-0 top-3.5 flex size-4 items-center justify-center rounded-full" />
                            <h4 className="rounded-xl py-2 text-xl font-bold tracking-tight xl:mb-4 xl:px-3">
                                {entry.Titulo}
                            </h4>

                            <h5 className="text-md -left-34 text-muted-foreground top-3 rounded-xl tracking-tight xl:absolute">
                                {entry.Fecha}
                            </h5>

                            <Card className="my-5 border-none shadow-none">
                                <CardContent className="px-0 xl:px-2">
                                    <div
                                        className="prose dark:prose-invert text-foreground mx-2"
                                        dangerouslySetInnerHTML={{ __html: entry.Descripcion }}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export { Timeline };
