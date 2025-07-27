import 'dotenv/config'
import { MeiliSearch } from 'meilisearch'

const librosData = [
    {
        id: 1,
        titulo: "Plan Estratégico Santiago 2030 - Actualización",
        autor: "Consejo para el Desarrollo Estratégico de Santiago",
        isbn: "978-99934-123-45-6",
        publicador: "CDES Santiago",
        seccion: "Planificación Urbana",
        fechaPublicacion: "2024-01-15",
        descripcion: "Documento actualizado del Plan Estratégico de Santiago que contempla proyectos estructurantes para mejorar la calidad de vida de los ciudadanos hasta el año 2030.",
        urlPdf: "/docs/plan-estrategico-2030-actualizacion.pdf",
        imagen: "/PES_libro.jpg",
        paginas: 156,
    },
    {
        id: 2,
        titulo: "Diagnóstico Territorial de Santiago",
        autor: "Dr. Reynaldo Peguero",
        isbn: "978-99934-123-46-7",
        publicador: "CDES Santiago",
        seccion: "Análisis Territorial",
        fechaPublicacion: "2023-11-20",
        descripcion: "Análisis comprehensivo del territorio de Santiago incluyendo aspectos demográficos, económicos y sociales.",
        urlPdf: "/docs/diagnostico-territorial-santiago.pdf",
        imagen: "/PES_libro.jpg",
        paginas: 89,
    },
    {
        id: 3,
        titulo: "Movilidad Urbana Sostenible en Santiago",
        autor: "Ing. Ervin Vargas",
        isbn: "978-99934-123-47-8",
        publicador: "CDES Santiago",
        seccion: "Transporte",
        fechaPublicacion: "2023-09-10",
        descripcion: "Estudio sobre las estrategias de movilidad urbana sostenible implementadas y propuestas para la ciudad de Santiago.",
        urlPdf: "/docs/movilidad-urbana-sostenible.pdf",
        imagen: "/PES_libro.jpg",
        paginas: 67,
    },
    {
        id: 4,
        titulo: "Desarrollo Económico Local",
        autor: "Johanna Castillo",
        isbn: "978-99934-123-48-9",
        publicador: "PUCMM",
        seccion: "Economía",
        fechaPublicacion: "2023-06-05",
        descripcion: "Análisis del desarrollo económico local en Santiago y estrategias para fomentar el crecimiento económico sostenible.",
        urlPdf: "/docs/desarrollo-economico-local.pdf",
        imagen: "/PES_libro.jpg",
        paginas: 134,
    },
    {
        id: 5,
        titulo: "Gestión Ambiental Urbana",
        autor: "Dr. María Fernández",
        isbn: "978-99934-123-49-0",
        publicador: "Universidad ISA",
        seccion: "Medio Ambiente",
        fechaPublicacion: "2023-03-18",
        descripcion: "Guía sobre gestión ambiental urbana y implementación de políticas verdes en ciudades intermedias.",
        urlPdf: "/docs/gestion-ambiental-urbana.pdf",
        imagen: "/PES_libro.jpg",
        paginas: 98,
    },
    {
        id: 6,
        titulo: "Historia del Desarrollo de Santiago",
        autor: "Prof. Luis García",
        isbn: "978-99934-123-50-6",
        publicador: "Editora Nacional",
        seccion: "Historia",
        fechaPublicacion: "2022-12-12",
        descripcion: "Recorrido histórico del desarrollo urbano y social de Santiago desde la fundación hasta la actualidad.",
        urlPdf: "/docs/historia-desarrollo-santiago.pdf",
        imagen: "/PES_libro.jpg",
        paginas: 245,
    }
];

// ✅ NUEVO: Datos de proyectos para MeiliSearch
const proyectosData = [
    {
        id: 1,
        titulo: "Parque Central Metropolitano",
        objetivos: "Crear el principal espacio verde y recreativo de Santiago con áreas deportivas, culturales y de esparcimiento.",
        alcance: "500,000 habitantes beneficiados",
        categoria: "Medio Ambiente",
        estado: "En Desarrollo",
        fechaInicio: "2024-01-15",
        fechaEstimadaFinalizacion: "2026-12-31",
        presupuesto: 45000000,
        instituciones: ["Ayuntamiento de Santiago", "Ministerio de Obras Públicas", "BID"],
        logos: [
            { name: "Ayuntamiento de Santiago", url: "/content-image.svg"},
            { name: "Ministerio de Obras Públicas", url: "/content-image.svg"},
            { name: "BID", url: "/content-image.svg"},
        ],
        imagen: "/viena-1.jpg",
        link: "#",
        icono: "Leaf",
        color: "bg-green-500",
        ubicacion: "Centro de Santiago",
        porcentajeAvance: 25,
        descripcionDetallada: "Proyecto integral para crear un parque metropolitano de 50 hectáreas con áreas verdes, deportivas, culturales y recreativas que servirá como pulmón verde de la ciudad.",
        beneficiarios: "Familias, jóvenes, adultos mayores, turistas",
        impactoEsperado: "Mejora calidad del aire, espacios recreativos, turismo urbano"
    },
    {
        id: 2,
        titulo: "Sistema de Transporte Público BRT",
        objetivos: "Implementar un sistema de transporte público rápido y eficiente para mejorar la movilidad urbana.",
        alcance: "800,000 habitantes con mejor acceso",
        categoria: "Transporte",
        estado: "En Desarrollo",
        fechaInicio: "2023-06-01",
        fechaEstimadaFinalizacion: "2025-12-31",
        presupuesto: 120000000,
        instituciones: ["INTRANT", "MOPC", "Banco Mundial"],
        logos: [
            { name: "INTRANT", url: "/content-image.svg"},
            { name: "MOPC", url: "/content-image.svg"},
            { name: "Banco Mundial", url: "/content-image.svg"},
        ],
        imagen: "/viena-2.jpg",
        link: "#",
        icono: "Car",
        color: "bg-blue-500",
        ubicacion: "Corredores principales de Santiago",
        porcentajeAvance: 45,
        descripcionDetallada: "Sistema BRT con 3 líneas principales, 45 estaciones y tecnología de punta para mejorar la movilidad urbana.",
        beneficiarios: "Estudiantes, trabajadores, comerciantes, población en general",
        impactoEsperado: "Reducción tiempo de viaje, menor contaminación, mejor conectividad"
    },
    {
        id: 3,
        titulo: "Centro de Innovación Urbana",
        objetivos: "Desarrollar un hub tecnológico para soluciones innovadoras y fomento del emprendimiento local.",
        alcance: "50,000 emprendedores apoyados",
        categoria: "Tecnología",
        estado: "En Desarrollo",
        fechaInicio: "2024-03-01",
        fechaEstimadaFinalizacion: "2025-08-31",
        presupuesto: 15000000,
        instituciones: ["PUCMM", "INTEC", "Sector Privado"],
        logos: [
            { name: "PUCMM", url: "/content-image.svg"},
            { name: "INTEC", url: "/content-image.svg"},
            { name: "Sector Privado", url: "/content-image.svg"},
        ],
        imagen: "/viena-3.jpg",
        link: "#",
        icono: "Building",
        color: "bg-purple-500",
        ubicacion: "Zona Universitaria",
        porcentajeAvance: 60,
        descripcionDetallada: "Hub tecnológico con espacios de coworking, laboratorios de innovación, incubadoras y programas de aceleración.",
        beneficiarios: "Emprendedores, startups, estudiantes, investigadores",
        impactoEsperado: "Generación de empleo, innovación tecnológica, desarrollo económico"
    },
    {
        id: 4,
        titulo: "Programa Juventud Emprendedora",
        objetivos: "Capacitar y apoyar a jóvenes emprendedores con herramientas, financiamiento y mentorías.",
        alcance: "2,000 jóvenes capacitados anualmente",
        categoria: "Educación",
        estado: "Activo",
        fechaInicio: "2023-09-01",
        fechaEstimadaFinalizacion: "2026-08-31",
        presupuesto: 8000000,
        instituciones: ["Universidades Locales", "Sector Privado", "USAID"],
        logos: [
            { name: "Universidades Locales", url: "/content-image.svg"},
            { name: "Sector Privado", url: "/content-image.svg"},
            { name: "USAID", url: "/content-image.svg"},
        ],
        imagen: "/viena-4.jpg",
        link: "#",
        icono: "GraduationCap",
        color: "bg-orange-500",
        ubicacion: "Múltiples ubicaciones",
        porcentajeAvance: 75,
        descripcionDetallada: "Programa integral de capacitación empresarial dirigido a jóvenes de 18-30 años con componentes de formación, mentorías y financiamiento.",
        beneficiarios: "Jóvenes emprendedores, estudiantes universitarios, graduados recientes",
        impactoEsperado: "Creación de microempresas, reducción desempleo juvenil, desarrollo de habilidades"
    }
]

const client = new MeiliSearch({
  host: process.env.MEILI_HOST || 'http://127.0.0.1:7700',
  apiKey: process.env.MEILI_API_KEY || 'MASTER_KEY',
})

async function indexData() {
  try {
    // ✅ EXISTENTE: Indexar libros
    const librosIndex = client.index('libros');
    const librosDocuments = librosData.map(libro => ({
      ...libro,
      fechaTimestamp: Math.floor(new Date(libro.fechaPublicacion).getTime() / 1000)
    }));
    let librosResponse = await librosIndex.addDocuments(librosDocuments);
    console.log('Libros indexed:', librosResponse);
    await librosIndex.updateFilterableAttributes(['seccion', 'publicador', 'autor', 'fechaTimestamp']);
    await librosIndex.updateSortableAttributes(['fechaTimestamp']);

    // ✅ NUEVO: Indexar proyectos
    const proyectosIndex = client.index('proyectos');
    const proyectosDocuments = proyectosData.map(proyecto => ({
      ...proyecto,
      fechaInicioTimestamp: Math.floor(new Date(proyecto.fechaInicio).getTime() / 1000),
      fechaFinalizacionTimestamp: Math.floor(new Date(proyecto.fechaEstimadaFinalizacion).getTime() / 1000),
      institucionesString: proyecto.instituciones.join(', '), // Para búsqueda por texto
      presupuestoNumerico: proyecto.presupuesto // Para filtros numéricos
    }));

    let proyectosResponse = await proyectosIndex.addDocuments(proyectosDocuments);
    console.log('Proyectos indexed:', proyectosResponse);

    // ✅ NUEVO: Configurar atributos filtrables y ordenables para proyectos
    await proyectosIndex.updateFilterableAttributes([
      'categoria', 
      'estado', 
      'fechaInicioTimestamp', 
      'fechaFinalizacionTimestamp'
    ]);
    await proyectosIndex.updateSortableAttributes([
      'fechaInicioTimestamp', 
      'fechaFinalizacionTimestamp'
    ]);
    
    console.log('Proyectos index settings updated.');

  } catch (error) {
    console.error('Error indexing data:', error);
  }
}

indexData().catch(console.error);