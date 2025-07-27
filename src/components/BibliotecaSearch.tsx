"use client"
import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Download, FileText, Calendar, User, Building, Hash, Filter, X, Loader } from 'lucide-react'
import client from '@/lib/meilisearch'

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

const index = client.index('libros')

export default function BibliotecaSearch() {
    const [searchTerm, setSearchTerm] = useState('')
    const [librosFiltrados, setLibrosFiltrados] = useState<Libro[]>([])
    const [isSearching, setIsSearching] = useState(true)
    const [filtros, setFiltros] = useState({
        seccion: '',
        publicador: '',
        autor: '',
        fechaDesde: '',
        fechaHasta: ''
    })
    const [mostrarFiltros, setMostrarFiltros] = useState(false)
    const [facetas, setFacetas] = useState({
        seccion: [] as string[],
        publicador: [] as string[],
        autor: [] as string[],
    })

    const fetchFacetas = useCallback(async () => {
        const results = await index.search('', {
            facets: ['seccion', 'publicador', 'autor'],
            limit: 0
        })
        setFacetas({
            seccion: Object.keys(results.facetDistribution?.seccion || {}),
            publicador: Object.keys(results.facetDistribution?.publicador || {}),
            autor: Object.keys(results.facetDistribution?.autor || {}),
        })
    }, [])

    useEffect(() => {
        fetchFacetas()
    }, [fetchFacetas])

    useEffect(() => {
        const search = async () => {
            setIsSearching(true)
            const filterConditions: string[] = []
            if (filtros.seccion) filterConditions.push(`seccion = "${filtros.seccion}"`)
            if (filtros.publicador) filterConditions.push(`publicador = "${filtros.publicador}"`)
            if (filtros.autor) filterConditions.push(`autor = "${filtros.autor}"`)
            
            if (filtros.fechaDesde) {
                const date = new Date(filtros.fechaDesde)
                filterConditions.push(`fechaTimestamp >= ${Math.floor(date.getTime() / 1000)}`)
            }
            if (filtros.fechaHasta) {
                const date = new Date(filtros.fechaHasta)
                filterConditions.push(`fechaTimestamp <= ${Math.floor(date.getTime() / 1000)}`)
            }

            try {
                const searchResults = await index.search(searchTerm, {
                    filter: filterConditions,
                })
                setLibrosFiltrados(searchResults.hits as Libro[])
            } catch (error) {
                console.error("Error during search:", error)
                setLibrosFiltrados([])
            } finally {
                setIsSearching(false)
            }
        }

        const timer = setTimeout(() => {
            search()
        }, 300) // 300ms debounce

        return () => {
            clearTimeout(timer)
        }
    }, [searchTerm, filtros])

    const handleFilterChange = (filterName: string, value: string) => {
        setFiltros(prev => ({ ...prev, [filterName]: value }))
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFiltros(prev => ({ ...prev, [name]: value }))
    }

    const resetFilters = () => {
        setFiltros({
            seccion: '',
            publicador: '',
            autor: '',
            fechaDesde: '',
            fechaHasta: ''
        })
        setSearchTerm('')
    }

    const secciones = facetas.seccion
    const publicadores = facetas.publicador
    const autores = facetas.autor

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Biblioteca Digital</h1>
            
            <div className="bg-black shadow-lg rounded-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full">
                        <Input 
                            type="text"
                            placeholder="Buscar por título, autor, o palabra clave..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-12 text-lg"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    <Button type="button" onClick={() => setMostrarFiltros(!mostrarFiltros)} className="h-12 w-full md:w-auto">
                        <Filter className="mr-2 h-4 w-4" />
                        {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                    </Button>
                    {(filtros.seccion || filtros.publicador || filtros.autor || filtros.fechaDesde || filtros.fechaHasta || searchTerm) && (
                        <Button type="button" onClick={resetFilters} variant="ghost" className="h-12 w-full md:w-auto">
                            <X className="mr-2 h-4 w-4" />
                            Limpiar
                        </Button>
                    )}
                </div>

                {mostrarFiltros && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                        <Select onValueChange={(value) => handleFilterChange('seccion', value)} value={filtros.seccion}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filtrar por sección" />
                            </SelectTrigger>
                            <SelectContent>
                                {secciones.map(seccion => <SelectItem key={seccion} value={seccion}>{seccion}</SelectItem>)}
                            </SelectContent>
                        </Select>

                        <Select onValueChange={(value) => handleFilterChange('publicador', value)} value={filtros.publicador}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filtrar por publicador" />
                            </SelectTrigger>
                            <SelectContent>
                                {publicadores.map(publicador => <SelectItem key={publicador} value={publicador}>{publicador}</SelectItem>)}
                            </SelectContent>
                        </Select>

                        <Select onValueChange={(value) => handleFilterChange('autor', value)} value={filtros.autor}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filtrar por autor" />
                            </SelectTrigger>
                            <SelectContent>
                                {autores.map(autor => <SelectItem key={autor} value={autor}>{autor}</SelectItem>)}
                            </SelectContent>
                        </Select>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="fechaDesde" className="text-sm font-medium text-gray-600">Desde</label>
                            <Input type="date" name="fechaDesde" value={filtros.fechaDesde} onChange={handleDateChange} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="fechaHasta" className="text-sm font-medium text-gray-600">Hasta</label>
                            <Input type="date" name="fechaHasta" value={filtros.fechaHasta} onChange={handleDateChange} />
                        </div>
                    </div>
                )}
            </div>

            {isSearching ? (
                <div className="flex justify-center items-center h-64">
                    <Loader className="h-16 w-16 animate-spin text-blue-600" />
                </div>
            ) : librosFiltrados.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {librosFiltrados.map((libro) => (
                        <Card key={libro.id} className="flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="p-0">
                                <img src={libro.imagen || '/placeholder.jpg'} alt={`Portada de ${libro.titulo}`} className="w-full h-48 object-cover" />
                            </CardHeader>
                            <CardContent className="p-6 flex flex-col flex-grow">
                                <h2 className="text-xl font-bold mb-2 text-gray-800 flex-grow">{libro.titulo}</h2>
                                <div className="space-y-3 text-sm text-gray-600 mb-4">
                                    <p className="flex items-center"><User className="mr-2 h-4 w-4" /> {libro.autor}</p>
                                    <p className="flex items-center"><Building className="mr-2 h-4 w-4" /> {libro.publicador}</p>
                                    <p className="flex items-center"><Calendar className="mr-2 h-4 w-4" /> {new Date(libro.fechaPublicacion).toLocaleDateString()}</p>
                                    <p className="flex items-center"><Hash className="mr-2 h-4 w-4" /> <Badge variant="secondary">{libro.seccion}</Badge></p>
                                </div>
                                <p className="text-gray-700 text-sm mb-4 flex-grow">{libro.descripcion}</p>
                                <div className="mt-auto flex gap-2">
                                    <Button asChild className="w-full">
                                        <a href={libro.urlPdf} target="_blank" rel="noopener noreferrer">
                                            <Download className="mr-2 h-4 w-4" />
                                            Descargar PDF
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron resultados</h3>
                    <p className="mt-1 text-sm text-gray-500">Intenta ajustar tu búsqueda o filtros.</p>
                </div>
            )}
        </div>
    )
}