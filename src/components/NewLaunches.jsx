import { useRef, useState, useLayoutEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "swiper/css";

import product1 from "../assets/Purifier_1.png";
import product2 from "../assets/Purifier_2.png";
import product3 from "../assets/Purifier_3.png";
import product4 from "../assets/Purifier_4.png";

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
  {
    id: 1,
    image: product1,
    name: "Venus",
    description: "UV+UF+Cooper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
    bg: "#E9FEFF",
  },
  {
    id: 2,
    image: product2,
    name: "Venus",
    description: "UV+UF+Cooper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
    bg: "#FFEDED",
  },
  {
    id: 3,
    image: product3,
    name: "Venus",
    description: "UV+UF+Cooper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
    bg: "#FCFFED",
  },
  {
    id: 4,
    image: product4,
    name: "Venus",
    description: "UV+UF+Cooper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
    bg: "#EDEDFF",
  },
  {
    id: 5,
    image: product1,
    name: "Venus Pro",
    description: "UV+UF+Cooper & zinc water purifier",
    price: 32999,
    mrp: 44000,
    discount: 25,
    bg: "#EEF3FB",
  },
];

function ProductCard({ product, cardRef }) {
  return (
    <div
      ref={cardRef}
      className="rounded-2xl overflow-hidden flex flex-col h-full"
      style={{ background: product.bg }}
    >
      <div className="px-4 pt-4 pb-2">
        <span className="inline-block bg-blue-100 text-blue-500 text-[11px] font-medium px-3 py-1 rounded-full mb-3">
          New launch
        </span>
        <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
          {product.name}
        </h3>
        <p className="text-slate-400 text-[12px] mt-0.5 mb-3 leading-snug">
          {product.description}
        </p>
        <p className="text-[22px] font-bold text-slate-900 leading-none mb-1">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
        <div className="flex items-center gap-1.5 text-[12px]">
          <span className="text-slate-400">MRP</span>
          <span className="text-slate-400 line-through">
            ₹{product.mrp.toLocaleString("en-IN")}
          </span>
          <span className="text-green-500 font-semibold">
            ({product.discount}% OFF)
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-end justify-center px-4 pt-4 pb-4 min-h-[180px] sm:min-h-[200px]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full max-w-[180px] sm:max-w-[200px] h-auto object-contain drop-shadow-md"
          draggable={false}
        />
      </div>
    </div>
  );
}

export default function NewLaunches() {
  const swiperRef = useRef(null);
  const [lastDir, setLastDir] = useState(null);

  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  // cardRefs holds one entry per PRODUCTS index (stable across re-renders),
  // so ScrollTrigger animates only the real slides, not Swiper's loop clones.
  const cardRefs = useRef([]);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
    setLastDir("prev");
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
    setLastDir("next");
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);

      // Starting state — hidden, shifted down
      gsap.set(headingRef.current, { opacity: 0, y: 24 });
      gsap.set(cards, { opacity: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 5%",
          // "bottom top" = the trigger's end point is only reached once the
          // section has fully scrolled past the top of the viewport.
          // With the previous "bottom 20%" value, short sections would hit
          // that end point while still fully visible on screen, so the
          // "reverse" action fired mid-view and everything faded/blurred
          // back out even though it hadn't left the viewport yet.
          end: "bottom",
          // replays the animation every time the section fully re-enters
          // view, whether scrolling down into it or back up into it —
          // and only reverses once it has fully left the viewport
          toggleActions: "play none play none",
        },
      });

      tl.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      }).to(
        cards,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
        },
        "-=0.3"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-10 sm:py-12 lg:py-16">
      <div className="primary-container">

        {/* Heading row */}
        <div
          ref={headingRef}
          className="flex items-center justify-between mb-6 sm:mb-8"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold text-slate-900 heading">
            New Launches
          </h2>

          {/* Arrows — desktop top-right */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              aria-label="Previous"
              onClick={handlePrev}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${
                lastDir === "prev"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              aria-label="Next"
              onClick={handleNext}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${
                lastDir !== "prev"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          speed={600}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          slidesPerView={1}
          spaceBetween={14}
          breakpoints={{
            480:  { slidesPerView: 1.5, spaceBetween: 14 },
            640:  { slidesPerView: 2,   spaceBetween: 16 },
            900:  { slidesPerView: 3,   spaceBetween: 18 },
            1100: { slidesPerView: 4,   spaceBetween: 20 },
          }}
          className="!pb-1"
        >
          {PRODUCTS.map((product, index) => (
            <SwiperSlide key={product.id} className="h-auto self-stretch">
              <div className="h-full">
                <ProductCard
                  product={product}
                  cardRef={(el) => (cardRefs.current[index] = el)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Arrows — mobile bottom-center */}
        <div className="flex sm:hidden items-center justify-center gap-4 mt-6">
          <button
            aria-label="Previous"
            onClick={handlePrev}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              lastDir === "prev"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            aria-label="Next"
            onClick={handleNext}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              lastDir !== "prev"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>

      </div>
    </section>
  );
}