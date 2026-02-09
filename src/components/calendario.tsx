import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  InfoIcon,
  XIcon,
} from "lucide-react";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { useEffect, useState, useMemo } from "react";
import "@schedule-x/theme-default/dist/index.css";
type TipoEvento =
  | "cultural"
  | "lanzamiento"
  | "reunion"
  | "otro"
  | "institucional";
// Mapea los tipos de tu API a los tipos visuales
const tiposEvento: Record<
  TipoEvento,
  {
    color: string;
    backgroundColor: string;
    borderColor: string;
    label: string;
  }
> = {
  cultural: {
    color: "#6366f1",
    backgroundColor: "#e0e7ff",
    borderColor: "#6366f1",
    label: "Cultural",
  },
  institucional: {
    color: "#059669",
    backgroundColor: "#d1fae5",
    borderColor: "#059669",
    label: "Institucionales",
  },
  lanzamiento: {
    color: "#d97706",
    backgroundColor: "#fef3c7",
    borderColor: "#d97706",
    label: "Lanzamiento",
  },
  reunion: {
    color: "#059669",
    backgroundColor: "#d1fae5",
    borderColor: "#059669",
    label: "Reunión",
  },
  otro: {
    color: "#2563eb",
    backgroundColor: "#dbeafe",
    borderColor: "#2563eb",
    label: "Otro",
  },
};

function toScheduleXFormat(dateStr?: string | null) {
  const d = dateStr ? new Date(dateStr) : new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

const CalendarApp = ({ eventos }: { eventos: any[] }) => {
  const [eventsService] = useState(() => createEventsServicePlugin());
  const [eventoSeleccionado, setEventoSeleccionado] = useState<
    any | TipoEvento | null
  >(null);
  const [filtrosActivos, setFiltrosActivos] = useState<string[]>([]);

  // Normaliza los eventos para ScheduleX
  const eventosNormalizados = eventos.map((e) => ({
    id: e.documentId || e.id,
    title: e.Titulo,
    start: toScheduleXFormat(e.Inicio || e.start || e.publishedAt),
    end: toScheduleXFormat(e.Fin || e.end || e.Start || e.publishedAt),
    description: e.Descripcion || "Sin descripción",
    location: e.Ubicacion || "Sin ubicación",
    type: e.Tipo || "otro",
    calendarId: e.Tipo || "otro",
  }));

  eventosNormalizados.forEach((evento) => {
    console.log(evento);
  });

  // Extrae los tipos únicos del array recibido
  const tiposUnicos = Array.from(
    new Set(eventosNormalizados.map((e) => e.type)),
  ).filter(Boolean);

  const calendar = useCalendarApp({
    locale: "es-ES",
    firstDayOfWeek: 0,
    defaultView: "month-grid",
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    calendars: Object.fromEntries(
      tiposUnicos.map((tipo: TipoEvento) => [
        tipo,
        {
          colorName: tipo,
          lightColors: {
            main: tiposEvento[tipo]?.color || tiposEvento.otro.color,
            container:
              tiposEvento[tipo]?.backgroundColor ||
              tiposEvento.otro.backgroundColor,
            onContainer:
              tiposEvento[tipo]?.borderColor || tiposEvento.otro.borderColor,
          },
          darkColors: {
            main: tiposEvento[tipo]?.color || tiposEvento.otro.color,
            container:
              tiposEvento[tipo]?.backgroundColor ||
              tiposEvento.otro.backgroundColor,
            onContainer:
              tiposEvento[tipo]?.borderColor || tiposEvento.otro.borderColor,
          },
        },
      ]),
    ),
    events: eventosNormalizados,
    plugins: [eventsService],
    callbacks: {
      onEventClick(calendarEvent) {
        const eventoId = calendarEvent.id;
        const eventoCompleto = eventosNormalizadosStable.find(
          (e) => e.id === eventoId,
        );
        setEventoSeleccionado(eventoCompleto || null);
      },
    },
  });

  // FIXED: Estabilizar eventosNormalizados con useMemo
  const eventosNormalizadosStable = useMemo(() => eventosNormalizados, [eventosNormalizados.length]);

  // Filtrar eventos cuando cambia el filtro - FIXED
  useEffect(() => {
    const eventosParaMostrar =
      filtrosActivos.length > 0
        ? eventosNormalizadosStable.filter((e) => filtrosActivos.includes(e.type))
        : eventosNormalizadosStable;

    eventsService.set(eventosParaMostrar);
  }, [filtrosActivos, eventsService, eventosNormalizadosStable.length]); // FIXED: usar length en lugar del array completo

  const eventosFiltrados =
    filtrosActivos.length > 0
      ? eventosNormalizadosStable.filter((evento) =>
          filtrosActivos.includes(evento.type),
        )
      : eventosNormalizadosStable;

  const handleTagClick = (type: string) => {
    setFiltrosActivos((prevFiltros) =>
      prevFiltros.includes(type)
        ? prevFiltros.filter((f) => f !== type)
        : [...prevFiltros, type],
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Calendario de Eventos CDES</h2>
        <p className="text-muted-foreground">
          Mantente al día con nuestros eventos, reuniones y actividades
          programadas
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Columna de Filtros */}
        <div className="w-full md:w-1/4 lg:w-1/5">
          <h3 className="text-lg font-semibold mb-4">Filtrar por tipo</h3>
          <div className="space-y-3">
            {tiposUnicos.map((tipo: TipoEvento) => {
              const tipoData = tiposEvento[tipo] || tiposEvento.otro;
              const isActive = filtrosActivos.includes(tipo);
              return (
                <div
                  key={tipo}
                  onClick={() => handleTagClick(tipo)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "shadow-lg scale-105"
                      : "opacity-80 hover:opacity-100 hover:shadow-md"
                  }`}
                  style={{
                    backgroundColor: isActive
                      ? tipoData.backgroundColor
                      : `${tipoData.color}10`,
                    borderColor: tipoData.borderColor,
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tipoData.color }}
                  ></div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: tipoData.color }}
                  >
                    {tipoData.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna del Calendario */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          <div className="bg-background rounded-lg border shadow-sm">
            <ScheduleXCalendar calendarApp={calendar} />
          </div>
        </div>
      </div>

      {eventoSeleccionado && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4 p-6 relative transform transition-all duration-300 ease-out scale-95 hover:scale-100">
            <button
              onClick={() => setEventoSeleccionado(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XIcon className="w-6 h-6" />
            </button>
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-lg flex-shrink-0"
                style={{
                  backgroundColor: `${tiposEvento[eventoSeleccionado.type as TipoEvento]?.backgroundColor || tiposEvento.otro.backgroundColor}`,
                  border: `2px solid ${tiposEvento[eventoSeleccionado.type as TipoEvento]?.borderColor || tiposEvento.otro.borderColor}`,
                }}
              ></div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {eventoSeleccionado.title}
                </h3>
                <div
                  className="mt-2 inline-block px-3 py-1 rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: `${tiposEvento[eventoSeleccionado.type as TipoEvento]?.backgroundColor || tiposEvento.otro.backgroundColor}`,
                    color:
                      tiposEvento[eventoSeleccionado.type as TipoEvento]
                        ?.color || tiposEvento.otro.color,
                  }}
                >
                  {tiposEvento[eventoSeleccionado.type as TipoEvento]?.label ||
                    tiposEvento.otro.label}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-gray-600">
              <div className="flex items-start gap-3">
                <InfoIcon className="w-5 h-5 mt-1 text-gray-400" />
                <p>{eventoSeleccionado.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <MapPinIcon className="w-5 h-5 text-gray-400" />
                <p>{eventoSeleccionado.location}</p>
              </div>
              <div className="flex items-center gap-3">
                <ClockIcon className="w-5 h-5 text-gray-400" />
                <p>
                  {eventoSeleccionado.start
                    ? new Date(eventoSeleccionado.start).toLocaleString()
                    : "Sin fecha"}
                  {eventoSeleccionado.end
                    ? ` - ${new Date(eventoSeleccionado.end).toLocaleString()}`
                    : ""}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
              <span>ID del Evento</span>
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {eventoSeleccionado.id}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-muted-foreground space-y-1">
        <p>📅 Haz clic en un evento existente para ver todos los detalles</p>
        <p>
          🗓️ El calendario muestra {eventosFiltrados.length} de{" "}
          {eventosNormalizadosStable.length} eventos programados
        </p>
        <div className="mt-2 text-xs">
          <strong>Distribución:</strong>
          {tiposUnicos.map((tipo: TipoEvento) => {
            const count = eventosNormalizadosStable.filter(
              (e) => e.type === tipo,
            ).length;
            const tipoData = tiposEvento[tipo] || tiposEvento.otro;
            return (
              <span key={tipo} className="ml-2">
                {tipoData.label}: {count}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarApp;
