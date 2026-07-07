import { useRef, useState, useLayoutEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "swiper/css";

import product1 from "../assets/Purifier_1.png";
import product2 from "../assets/Purifier_2.png";
import product3 from "../assets/Purifier_3.png";
import product4 from "../assets/Purifier_4.png";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

function ProductCard({ product }) {
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const priceRef = useRef(null);

  const handleEnter = () => {
    if (prefersReducedMotion()) return;
    gsap.to(cardRef.current, {
      boxShadow: "0 20px 40px -12px rgba(15, 23, 42, 0.18)",
      duration: 0.35,
      ease: "power2.out",
    });
    gsap.to(imgRef.current, {
      scale: 1.08,
      duration: 0.5,
      ease: "power2.out",
    });
    gsap.fromTo(
      priceRef.current,
      { scale: 1 },
      { scale: 1.04, duration: 0.25, ease: "power2.out", yoyo: true, repeat: 1 }
    );
  };

  const handleLeave = () => {
    if (prefersReducedMotion()) return;
    gsap.to(cardRef.current, {
      boxShadow: "0 0px 0px 0px rgba(15, 23, 42, 0)",
      duration: 0.35,
      ease: "power2.out",
    });
    gsap.to(imgRef.current, {
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
  <div
  ref={cardRef}
  onMouseEnter={handleEnter}
  onMouseLeave={handleLeave}
  className="product-card rounded-2xl overflow-hidden flex flex-col h-[420px] w-full select-none"
  style={{ background: product.bg }}
>
  {/* Content */}
  <div className="px-4 pt-4 pb-2 flex-shrink-0">
    <span className="inline-block bg-blue-100 text-[#0061C2] text-[11px] font-medium px-3 py-1 rounded-full mb-3">
      New launch
    </span>

    <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
      {product.name}
    </h3>

    <p className="text-slate-400 text-[12px] mt-1 mb-3 leading-snug ">
      {product.description}
    </p>

    <p
      ref={priceRef}
      className="text-[22px] font-bold text-slate-900 leading-none mb-1"
    >
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

  {/* Fixed Image Area */}
  <div className="flex-1 flex items-center justify-center px-4">
    <div className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] flex items-center justify-center">
      <img
        ref={imgRef}
        src={product.image}
        alt={product.name}
        className="w-full h-full object-contain drop-shadow-md will-change-transform"
        draggable={false}
      />
    </div>
  </div>
</div>
  );
}

export default function NewLaunches() {
  const swiperRef = useRef(null);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const swiperWrapRef = useRef(null);
  const [lastDir, setLastDir] = useState(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
        },
      });

      // Animate only the currently-rendered (non-cloned) card wrappers
      const cards = swiperWrapRef.current
        ? gsap.utils.toArray(
            swiperWrapRef.current.querySelectorAll(
              ".swiper-slide:not(.swiper-slide-duplicate) .product-card"
            )
          )
        : [];

      gsap.from(cards, {
        y: 40,
        opacity: 0,
        scale: 0.96,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: swiperWrapRef.current,
          start: "top 82%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const bumpButton = (el) => {
    if (prefersReducedMotion() || !el) return;
    gsap.fromTo(
      el,
      { scale: 0.85 },
      { scale: 1, duration: 0.3, ease: "back.out(4)" }
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
                prevActive
                  ? "bg-[#0061C2] text-white hover:bg-[#0061C2]"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              aria-label="Next"
              onClick={handleNext}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${
                nextActive
                  ? "bg-[#0061C2] text-white hover:bg-[#0061C2]"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div ref={swiperWrapRef}>
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
            speed={600}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            slidesPerView={1}
            spaceBetween={14}
            breakpoints={{
              480: { slidesPerView: 1.5, spaceBetween: 14 },
              640: { slidesPerView: 2, spaceBetween: 16 },
              900: { slidesPerView: 3, spaceBetween: 18 },
              1100: { slidesPerView: 4, spaceBetween: 20 },
            }}
            className="!pb-1"
          >
            {PRODUCTS.map((product) => (
              <SwiperSlide key={product.id} className="h-auto self-stretch">
                <div className="h-full">
                  <ProductCard product={product} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Arrows — mobile bottom-center */}
        <div className="flex sm:hidden items-center justify-center gap-4 mt-6">
          <button
            aria-label="Previous"
            onClick={handlePrev}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              prevActive
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          <button
            aria-label="Next"
            onClick={handleNext}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              nextActive
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}