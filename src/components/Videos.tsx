import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import { fetchWithCache } from "../../lib/cache";

export default function CarouselVideos() {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [data, setVideos] = useState({
    Videos: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Solo cargar si no se ha cargado antes
    if (hasLoaded) return;
    
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        // Usar fetchWithCache para optimizar las peticiones
        const response = await fetchWithCache(
          `${import.meta.env.PUBLIC_STRAPI_URL}/api/pagina-principal?populate[Contenidos][populate]=*`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.PUBLIC_STRAPI_KEY}`,
            },
          },
          'videos'
        );
        
        if (response?.data?.Contenidos) {
          setVideos({ Videos: response.data.Contenidos });
          setHasLoaded(true);
          console.log("Videos loaded from cache or API");
        } else {
          console.error("No video data found");
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideos();
  }, []); // Solo se ejecuta una vez

  const handleVideoPlay = (videoId: number) => {
    setPlayingVideo(videoId);
  };

  const handleVideoPause = () => {
    setPlayingVideo(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 py-36">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Conócenos mas fondo
      </h2>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {data.Videos.map((video: any) => (
            <>
              {video.__component === "shared.enlace" ? (
                <CarouselItem key={video.documentId} className="">
                  <Card className="overflow-hidden min-h-auto">
                    <CardContent className="p-0 h-auto">
                      <div className="relative group h-96">
                        <YouTube
                          videoId={video.Url.substring(
                            video.Url.lastIndexOf("/") + 1,
                          )}
                          opts={{
                            width: "100%",
                            playerVars: {
                              autoplay: 0,
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ) : (
                <CarouselItem key={video.documentId} className="">
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative group">
                        {/* Video Player */}
                        <video
                          className="w-full aspect-video object-cover"
                          poster={video.Contenido.thumbnail}
                          controls
                          preload="metadata"
                          onPlay={() => handleVideoPlay(video.Contenido.id)}
                          onPause={handleVideoPause}
                        >
                          <source src={video.Contenido.url} type="video/mp4" />
                          Tu navegador no soporta el elemento video.
                        </video>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              )}
            </>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      {/* Información adicional */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Desliza para ver más videos</p>
      </div>
    </div>
  );
}
