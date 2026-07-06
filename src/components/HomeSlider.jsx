import { useRef, useState, useLayoutEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "swiper/css";
import homeBanner from "../assets/Home_Banner.png";
import gsap from "gsap";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  const sectionRef = useRef(null);
  const [lastDir, setLastDir] = useState(null); // "prev" | "next" | null

  // Per-slide refs, keyed by slide id
  const tagRefs = useRef({});
  const headingRefs = useRef({}); // { [id]: [line1El, line2El] }
  const imageRefs = useRef({});

  const setTagRef = (id) => (el) => {
    if (el) tagRefs.current[id] = el;
  };
  const setHeadingLineRef = (id, lineIdx) => (el) => {
    if (!el) return;
    if (!headingRefs.current[id]) headingRefs.current[id] = [];
    headingRefs.current[id][lineIdx] = el;
  };
  const setImageRef = (id) => (el) => {
    if (el) imageRefs.current[id] = el;
  };

  const animateSlide = useCallback((id) => {
    if (prefersReducedMotion()) return;

    const tag = tagRefs.current[id];
    const lines = headingRefs.current[id] || [];
    const img = imageRefs.current[id];
    if (!tag || !lines.length) return;

    // Reset to hidden state before animating in
    gsap.set(tag, { y: 20, opacity: 0 });
    gsap.set(lines, { y: 32, opacity: 0 });
    if (img) gsap.set(img, { scale: 1.1 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(tag, { y: 0, opacity: 1, duration: 0.6 })
      .to(lines, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 }, "-=0.35");

    if (img) {
      // Slow Ken Burns drift synced roughly to the autoplay delay
      gsap.to(img, { scale: 1, duration: 5.5, ease: "none" });
    }
  }, []);

  // Entrance for the whole banner on mount, then animate the first slide's content
  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      animateSlide(SLIDES[0].id);
      return;
    }

    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" }
    );

    animateSlide(SLIDES[0].id);
  }, [animateSlide]);

  const handleSlideChange = useCallback(
    (swiper) => {
      const activeSlide = SLIDES[swiper.realIndex];
      if (activeSlide) animateSlide(activeSlide.id);
    },
    [animateSlide]
  );

  const bumpButton = (el) => {
    if (prefersReducedMotion() || !el) return;
    gsap.fromTo(
      el,
      { scale: 0.85 },
      { scale: 1, duration: 0.35, ease: "back.out(4)" }
    );
  };

  const handlePrev = (e) => {
    swiperRef.current?.slidePrev();
    setLastDir("prev");
    bumpButton(e.currentTarget);
  };

  const handleNext = (e) => {
    swiperRef.current?.slideNext();
    setLastDir("next");
    bumpButton(e.currentTarget);
  };

  const prevActive = lastDir === "prev";
  const nextActive = lastDir === "next" || lastDir === null; 

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[680px] sm:h-[900px] md:h-[600px] lg:h-[720px] xl:h-[600px] 2xl:h-screen overflow-hidden"
    >
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        speed={800}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={handleSlideChange}
        className="w-full h-full"
      >
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.id} className="relative">
            <div className="absolute inset-0 overflow-hidden">
              <img
                ref={setImageRef(slide.id)}
                src={slide.image}
                alt={slide.heading.join(" ")}
                className="absolute inset-0 w-full h-full object-cover will-change-transform"
              />
            </div>

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(270deg, rgba(48, 41, 35, 0) 24.78%, #302923 106.37%)",
              }}
            />

            <div className="absolute inset-0 flex items-center">
              <div className="max-w-xl px-6 sm:px-10 lg:px-16">
                <span
                  ref={setTagRef(slide.id)}
                  className="inline-block bg-white/90 heading text-slate-800 text-xs sm:text-sm font-medium px-4 py-2 rounded-lg mb-4 sm:mb-6"
                >
                  {slide.tag}
                </span>
                <h1 className="text-[clamp(1.75rem,4vw+0.75rem,2.25rem)] heading font-bold text-white leading-tight">
                  <span
                    ref={setHeadingLineRef(slide.id, 0)}
                    className="block overflow-hidden"
                  >
                    {slide.heading[0]}
                  </span>
                  <span
                    ref={setHeadingLineRef(slide.id, 1)}
                    className="block overflow-hidden"
                  >
                    {slide.heading[1]}
                  </span>
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
          className={`w-10 h-10 cursor-pointer sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors shadow-lg ${
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