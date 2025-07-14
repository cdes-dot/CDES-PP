import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Download, FileText, Calendar, User, Building, Hash, Filter, X } from 'lucide-react'

// Tipos para los libros
interface Libro {
    id: number
    titulo: string
    autor: string
    isbn: string
    publicador: string
    seccion: string
    fechaPublicacion: string
    descripcion: string
    urlPdf: string
    imagen?: string
    paginas?: number
}

// Datos de ejemplo - en producción esto vendría de una API
const librosData: Libro[] = [
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
]

// Obtener opciones únicas para los filtros
const getSecciones = (libros: Libro[]) => [...new Set(libros.map(libro => libro.seccion))]
const getPublicadores = (libros: Libro[]) => [...new Set(libros.map(libro => libro.publicador))]
const getAutores = (libros: Libro[]) => [...new Set(libros.map(libro => libro.autor))]

export default function BibliotecaSearch() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filtros, setFiltros] = useState({
        seccion: '',
        publicador: '',
        autor: '',
        fechaDesde: '',
        fechaHasta: ''
    })
    const [mostrarFiltros, setMostrarFiltros] = useState(false)

    // Filtrar libros basado en búsqueda y filtros
    const librosFiltrados = useMemo(() => {
        return librosData.filter(libro => {
            // Búsqueda por término general
            const coincideBusqueda = searchTerm === '' || 
                libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                libro.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                libro.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                libro.publicador.toLowerCase().includes(searchTerm.toLowerCase()) ||
                libro.seccion.toLowerCase().includes(searchTerm.toLowerCase())

            // Filtros específicos
            const coincideSeccion = filtros.seccion === '' || libro.seccion === filtros.seccion
            const coincidePublicador = filtros.publicador === '' || libro.publicador === filtros.publicador
            const coincideAutor = filtros.autor === '' || libro.autor === filtros.autor

            // Filtro por fecha
            let coincideFecha = true
            if (filtros.fechaDesde || filtros.fechaHasta) {
                const fechaLibro = new Date(libro.fechaPublicacion)
                if (filtros.fechaDesde) {
                    coincideFecha = coincideFecha && fechaLibro >= new Date(filtros.fechaDesde)
                }
                if (filtros.fechaHasta) {
                    coincideFecha = coincideFecha && fechaLibro <= new Date(filtros.fechaHasta)
                }
            }

            return coincideBusqueda && coincideSeccion && coincidePublicador && coincideAutor && coincideFecha
        })
    }, [searchTerm, filtros])

    const limpiarFiltros = () => {
        setFiltros({
            seccion: '',
            publicador: '',
            autor: '',
            fechaDesde: '',
            fechaHasta: ''
        })
        setSearchTerm('')
    }

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-DO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const contarFiltrosActivos = () => {
        return Object.values(filtros).filter(valor => valor !== '').length
    }

    return (
        <div className="space-y-6">
            {/* Barra de búsqueda principal */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Buscar por título, autor, ISBN, publicador o sección..."
                                className="pl-10 text-base"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                variant={mostrarFiltros ? "default" : "outline"}
                                size="sm"
                                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                                className="flex items-center gap-2"
                            >
                                <Filter className="w-4 h-4" />
                                Filtros Avanzados
                                {contarFiltrosActivos() > 0 && (
                                    <Badge variant="secondary" className="ml-1 text-xs">
                                        {contarFiltrosActivos()}
                                    </Badge>
                                )}
                            </Button>
                            
                            {(searchTerm || contarFiltrosActivos() > 0) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={limpiarFiltros}
                                    className="flex items-center gap-2 text-muted-foreground"
                                >
                                    <X className="w-4 h-4" />
                                    Limpiar
                                </Button>
                            )}
                            
                            <div className="ml-auto text-sm text-muted-foreground">
                                {librosFiltrados.length} de {librosData.length} libros
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Panel de filtros avanzados */}
            {mostrarFiltros && (
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">Filtros Avanzados</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Sección</label>
                                <Select value={filtros.seccion} onValueChange={(value) => setFiltros({...filtros, seccion: value})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todas las secciones" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Todas las secciones</SelectItem>
                                        {getSecciones(librosData).map(seccion => (
                                            <SelectItem key={seccion} value={seccion}>{seccion}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Publicador</label>
                                <Select value={filtros.publicador} onValueChange={(value) => setFiltros({...filtros, publicador: value})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos los publicadores" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Todos los publicadores</SelectItem>
                                        {getPublicadores(librosData).map(publicador => (
                                            <SelectItem key={publicador} value={publicador}>{publicador}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Autor</label>
                                <Select value={filtros.autor} onValueChange={(value) => setFiltros({...filtros, autor: value})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos los autores" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Todos los autores</SelectItem>
                                        {getAutores(librosData).map(autor => (
                                            <SelectItem key={autor} value={autor}>{autor}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Fecha desde</label>
                                <Input
                                    type="date"
                                    value={filtros.fechaDesde}
                                    onChange={(e) => setFiltros({...filtros, fechaDesde: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Fecha hasta</label>
                                <Input
                                    type="date"
                                    value={filtros.fechaHasta}
                                    onChange={(e) => setFiltros({...filtros, fechaHasta: e.target.value})}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Resultados */}
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"> {/* Cambiar grid para más columnas y menor gap */}
                {librosFiltrados.map((libro) => (
                    <Card key={libro.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        {/* Imagen como botón de descarga */}
                        <a
                            href={libro.urlPdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block cursor-pointer group"
                        >
                            <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                                {libro.imagen ? (
                                    <img
                                        src={libro.imagen}
                                        alt={`Portada de ${libro.titulo}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-colors">
                                        <FileText className="w-12 h-12 text-primary/40" />
                                    </div>
                                )}
                                
                                {/* Overlay con ícono de descarga */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                                        <Download className="w-6 h-6 text-primary" />
                                    </div>
                                </div>
                                
                                {/* Badge de sección */}
                                <div className="absolute top-2 right-2">
                                    <Badge variant="secondary" className="text-xs">
                                        {libro.seccion}
                                    </Badge>
                                </div>
                            </div>
                        </a>
                        
                        <CardContent className="p-3 space-y-2"> {/* Reducir padding */}
                            <h3 className="font-semibold text-sm line-clamp-2 font-noto"> {/* Reducir tamaño de texto */}
                                {libro.titulo}
                            </h3>
                            
                            <div className="space-y-1 text-xs text-muted-foreground"> {/* Reducir tamaño y espaciado */}
                                <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    <span className="line-clamp-1">{libro.autor}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Building className="w-3 h-3" />
                                    <span className="line-clamp-1">{libro.publicador}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatearFecha(libro.fechaPublicacion)}</span>
                                </div>
                            </div>
                            
                            <p className="text-xs text-muted-foreground line-clamp-2"> {/* Reducir líneas mostradas */}
                                {libro.descripcion}
                            </p>
                            
                            {/* Footer compacto */}
                            <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    {libro.paginas && <span>{libro.paginas} págs.</span>}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Hash className="w-3 h-3" />
                                    <span className="text-xs">{libro.isbn.slice(-4)}</span> {/* Solo últimos 4 dígitos */}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Mensaje cuando no hay resultados */}
            {librosFiltrados.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No se encontraron libros</h3>
                        <p className="text-muted-foreground mb-4">
                            No hay libros que coincidan con los criterios de búsqueda actuales.
                        </p>
                        <Button variant="outline" onClick={limpiarFiltros}>
                            Limpiar filtros
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}