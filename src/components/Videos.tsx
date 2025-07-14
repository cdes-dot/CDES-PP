import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Play, Pause } from "lucide-react"
import { use, useEffect, useState } from "react"

export default function CarouselVideos() {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null)
  const [data, setVideos] = useState({
    Videos: []
  })

  useEffect(() => {
    const fetchVideos = async () => {
      const request = await fetch(`${import.meta.env.PUBLIC_STRAPI_URL}/api/pagina-principal?populate[Videos][populate]=*`, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${import.meta.env.PUBLIC_STRAPI_KEY}`
        }
      })
      const data = await request.json()
      return data
    }
    fetchVideos().then((response) => {
      if (response) {
        setVideos({Videos: response.data.Videos.Videos})
      } else {
        console.error("No data found")
        throw new Error("No data found")
      }
    })
  },[])

 
  const handleVideoPlay = (videoId: number) => {
    setPlayingVideo(videoId)
  }

  const handleVideoPause = () => {
    setPlayingVideo(null)
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 py-36">
      <h2 className="text-2xl font-bold mb-6 text-center">Conócenos mas fondo</h2>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {data.Videos.map((video: any) => (
            <CarouselItem key={video.documentId} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative group">
                    {/* Video Player */}
                    <video
                      className="w-full aspect-video object-cover"
                      poster={video.thumbnail}
                      controls
                      preload="metadata"
                      onPlay={() => handleVideoPlay(video.id)}
                      onPause={handleVideoPause}
                    >
                      <source src={import.meta.env.PUBLIC_STRAPI_URL + video.url} type="video/mp4" />
                      Tu navegador no soporta el elemento video.
                    </video>

                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
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
  )
}
