import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "swiper/css";
import homeBanner from "../assets/Home_Banner.png";

const SLIDES = [
  {
    id: 1,
    image: homeBanner,
    tag: "Mumbai's water purification specialists",
    heading: ["Your family deserves", "better than tap water"],
  },
  {
    id: 2,
    image: homeBanner,
    tag: "Trusted by 50,000+ Mumbai homes",
    heading: ["Pure water,", "delivered every day"],
  },
  {
    id: 3,
    image: homeBanner,
    tag: "Copper + Zinc enriched purification",
    heading: ["Healthier water,", "naturally enhanced"],
  },
];

export default function HomeSlider() {
  const swiperRef = useRef(null);
  const [lastDir, setLastDir] = useState(null); // "prev" | "next" | null

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
    setLastDir("prev");
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
    setLastDir("next");
  };

  const prevActive = lastDir === "prev";
  const nextActive = lastDir === "next" || lastDir === null; // next is default active

  return (
    <section className="relative w-full h-[900px] sm:h-[800px] md:h-[600px] lg:h-[720px] xl:h-[600px] 2xl:h-screen overflow-hidden">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        speed={800}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="w-full h-full"
      >
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.id} className="relative">
            <img
              src={slide.image}
              alt={slide.heading.join(" ")}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(270deg, rgba(48, 41, 35, 0) 24.78%, #302923 106.37%)",
              }}
            />

            <div className="absolute inset-0 flex items-center">
              <div className="max-w-xl px-6 sm:px-10 lg:px-16">
                <span className="inline-block bg-white/90 heading text-slate-800 text-xs sm:text-sm font-medium px-4 py-2 rounded-lg mb-4 sm:mb-6">
                  {slide.tag}
                </span>
                <h1 className="text-[clamp(1.75rem,4vw+0.75rem,2.25rem)] heading font-bold text-white leading-tight">
                  {slide.heading[0]}
                  <br />
                  {slide.heading[1]}
                </h1>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* "See All" link, bottom-left */}
      
      <a  href="/products"
        className="absolute bottom-7 sm:bottom-9 left-6 sm:left-10 lg:left-16 z-20 hidden sm:flex items-center gap-3 text-white text-sm font-medium group"
      >
        See All
        <span className="w-80 h-px bg-white/60 group-hover:w-100 transition-all duration-300" />
      </a>

      {/* Prev / Next arrows */}
      <div className="absolute bottom-7 sm:bottom-9 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        <button
          aria-label="Previous slide"
          onClick={handlePrev}
          className={`w-10 h-10  cursor-pointer  sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors shadow-lg ${
            prevActive
              ? "bg-[#0061C2] text-white"
              : "bg-white text-slate-900 hover:bg-slate-100"
          }`}
        >
          <ArrowLeft size={20} />
        </button>
        <button
          aria-label="Next slide"
          onClick={handleNext}
          className={`w-10 h-10 cursor-pointer sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors shadow-lg ${
            nextActive
              ? "bg-[#0061C2] text-white"
              : "bg-white text-slate-900 hover:bg-slate-100"
          }`}
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}