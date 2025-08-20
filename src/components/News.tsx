import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function NewsSection({
  news,
  title,
  subtitle,
}: {
  news: any[];
  title: string;
  subtitle: string;
}) {
  const [selectedNews, setSelectedNews] = useState(news[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // console.log(news)
  // Auto-rotate news every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedIndex((prevIndex) => {
        const nextIndex = prevIndex >= news.length - 1 ? 0 : prevIndex + 1;
        setSelectedNews(news[nextIndex]);
        return nextIndex;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [news]);

  const handleNewsClick = (item: any, index: number) => {
    setSelectedNews(item);
    setSelectedIndex(index);
  };

  return (
    <section className="bg-background py-16 dark:bg-transparent">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl news-title">
            {title}
          </h2>
          <h3 className="text-balance text-lg font-medium text-muted-foreground mt-2">
            {subtitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel de detalles a la izquierda */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedNews?.documentId || selectedIndex}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden"
              >
                {/* Imagen principal */}
                <motion.div
                  className="relative h-64 md:h-80 overflow-hidden"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <img
                    src={
                      selectedNews?.Portada?.url
                        ? `${selectedNews.Portada.url}`
                        : "/placeholder-news.jpg"
                    }
                    alt={selectedNews?.Titulo || "Noticia"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                  {/* Indicador de categoría */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-4 left-4"
                  >
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Destacado
                    </span>
                  </motion.div>
                </motion.div>

                {/* Contenido */}
                <div className="p-6 md:p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                      {selectedNews?.Titulo}
                    </h3>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="prose dark:prose-invert max-w-none mb-6"
                  >
                    {selectedNews?.Content?.[0]?.children
                      ?.slice(0, 3)
                      .map((item: any, index: number) => (
                        <p
                          key={index}
                          className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed"
                        >
                          {item.text}
                        </p>
                      ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex items-center justify-between"
                  >
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">
                        {selectedNews?.publishedAt
                          ? new Date(
                              selectedNews.publishedAt,
                            ).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Fecha no disponible"}
                      </span>
                    </div>

                    <motion.a
                      href={`/noticias/${selectedNews?.documentId}`}
                      className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Leer artículo completo
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </motion.a>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Lista de noticias a la derecha */}
          <div className="order-1 lg:order-2">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Noticias Destacadas
              </h4>

              <div className="space-y-3 max-h-96 lg:max-h-[600px] overflow-y-auto custom-scrollbar">
                {news.map((item, index) => (
                  <motion.div
                    key={item.documentId || index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                        selectedIndex === index
                          ? "ring-2 ring-primary bg-primary/5 border-primary"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => handleNewsClick(item, index)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          {/* Thumbnail */}
                          <div className="flex-shrink-0">
                            <img
                              src={
                                item.Portada?.url
                                  ? `${item.Portada.url}`
                                  : "/placeholder-news.jpg"
                              }
                              alt={item.Titulo}
                              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                            />
                          </div>

                          {/* Contenido */}
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-sm md:text-base text-gray-900 dark:text-white line-clamp-2 mb-2">
                              {item.Titulo}
                            </h5>

                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                              {item.Content?.[0]?.children?.[0]?.text ||
                                "Sin descripción disponible"}
                            </p>

                            <div className="text-xs text-muted-foreground">
                              {item.publishedAt
                                ? new Date(item.publishedAt).toLocaleDateString(
                                    "es-ES",
                                  )
                                : "Sin fecha"}
                            </div>
                          </div>

                          {/* Indicador activo */}
                          {selectedIndex === index && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex-shrink-0 w-3 h-3 bg-primary rounded-full self-center"
                            />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Link para ver todas */}
              <motion.div
                className="pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <a
                  href="/noticias"
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                >
                  Ver todas las noticias
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgb(203 213 225) transparent;
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgb(203 213 225);
                    border-radius: 3px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgb(148 163 184);
                }
            `}</style>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
    />
    <div
      aria-hidden
      className="bg-radial to-background absolute inset-0 from-transparent to-75%"
    />
    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">
      {children}
    </div>
  </div>
);
