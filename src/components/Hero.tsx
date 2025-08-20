import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import LogosSection from "./astro/LogosSection";

export default function HeroSection({ slides }: { slides: any[] }) {
  const [menuState, setMenuState] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    const showinterval = setInterval(() => {
      setShow((prev) => !prev);
    }, 4000); // Change slide every 10 seconds
    return () => {
      clearInterval(interval);
      clearInterval(showinterval);
    };
  }, [slides.length]);
  return (
    <>
      <main>
        <section className="overflow-hidden">
          <div className="relative mx-auto max-w-screen px-6 py-24 lg:py-14">
            <div className="lg:flex lg:items-center lg:gap-12">
              <div className="h-2xl relative z-10 mx-auto max-w-xl text-center lg:ml-0 lg:w-1/2 lg:text-left space-y-6">
                <AnimatePresence mode="wait">
                  {/* Use mode="wait" to ensure one animation completes before the next starts */}
                  <motion.h1
                    key={slides[currentSlide]?.Contenido}
                    className="text-balance h-[144px] text-4xl font-bold md:text-5xl xl:text-5xl"
                    initial={{ opacity: 0 }} // Start slightly below and invisible
                    animate={{ opacity: 1 }} // Slide up and fade in
                    exit={{ opacity: 0 }} // Slide up and fade out
                    transition={{ duration: 0.7, ease: "easeIn" }} // Adjust duration and easing
                  >
                    {slides[currentSlide]?.Contenido}
                  </motion.h1>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={slides[currentSlide]?.Subtitulo}
                    className="h-[168px] text-base leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }} // Add a slight delay for the description
                  >
                    {slides[currentSlide]?.Subtitulo}
                  </motion.p>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`button-${currentSlide}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-12 flex items-center justify-center lg:justify-start"
                  >
                    <a
                      href={slides[currentSlide].Enlace.Url}
                      className="cursor-pointer"
                    >
                      <Button className="cursor-pointer">
                        {slides[currentSlide]?.Enlace.Contenido}
                      </Button>
                    </a>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <div className="absolute inset-0 z-0 -mx-4 rounded-3xl p-3 lg:col-span-3 w-screen">
              <div className="relative overflow-hidden rounded-3xl w-screen">
                <div className="bg-radial-[at_75%_25%] to-background z-10 absolute -inset-0 from-12% to-40% w-screen"></div>

                {/* Slider Container */}
                <div
                  className="flex transition-transform duration-1000 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {slides.map((image, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <img
                        src={image.Fondo.url}
                        alt={`Background slide ${index + 1}`}
                        width={2796}
                        height={2008}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <LogosSection />
        </section>
      </main>
    </>
  );
}
