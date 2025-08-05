import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { useEffect, useState } from "react";

export default function LogosSection() {
  const [logos, setLogos] = useState([]);
  useEffect(() => {
    const fetchLogos = async () => {
      const request = await fetch(
        `${import.meta.env.PUBLIC_STRAPI_URL}/api/aliados?populate[institucion][populate]=*`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.PUBLIC_STRAPI_KEY}`,
          },
        },
      );
      const data = await request.json();
      return data;
    };

    fetchLogos().then((data) => {
      if (data) {
        setLogos(data.data);
      } else {
        throw new Error("No data found");
      }
    }).catch((error) => {
      console.error("Error fetching logos:", error);
    });
  }, []);
  return (
    <section className="bg-background pb-16 md:pb-32">
      <div className="group relative m-auto">
        <div className="flex flex-col items-center md:flex-row">
          <div className="inline md:max-w-44 md:border-r md:pr-6">
            <p className="text-end text-sm">
              Aliados estrategicos internacionales
            </p>
          </div>
          <div className="relative py-6 md:w-[calc(100%-11rem)]">
            <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
              {logos.map((logo: any, index: number) => (
                <div className="flex" key={logo.Url}>
                  <img
                    className="mx-auto size-8 w-fit dark:invert"
                    src={logo.institucion.Media.url}
                    alt="Nvidia Logo"
                    height="40"
                    width="auto"
                  />
                </div>
              ))}
            </InfiniteSlider>

            <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20">
            </div>
            <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20">
            </div>
            <ProgressiveBlur
              className="pointer-events-none absolute left-0 top-0 h-full w-20"
              direction="left"
              blurIntensity={1}
            />
            <ProgressiveBlur
              className="pointer-events-none absolute right-0 top-0 h-full w-20"
              direction="right"
              blurIntensity={1}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
