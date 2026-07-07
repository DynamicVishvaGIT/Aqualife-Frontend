import { useRef, useState, useLayoutEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "swiper/css";
import { WaterButton } from "../components/WaterButton";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    badge: "New launch",
    name: "Venus",
    description: "UV+UF+Cooper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
  },
  {
    id: 2,
    image: product2,
    badge: null,
    name: "Venus",
    description: "UV+UF+Cooper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
  },
  {
    id: 3,
    image: product3,
    badge: null,
    name: "Venus",
    description: "UV+UF+Cooper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
  },
  {
    id: 4,
    image: product4,
    badge: null,
    name: "Venus",
    description: "UV+UF+Cooper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
  },
  {
    id: 5,
    image: product1,
    badge: null,
    name: "Venus Pro",
    description: "UV+UF+Cooper & zinc water purifier",
    price: 32999,
    mrp: 44000,
    discount: 25,
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
      y: 0,
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
      className="product-card bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 flex flex-col h-full select-none"
    >
      <div className="relative bg-white rounded-xl flex items-center justify-center h-44 sm:h-52 mb-4 overflow-hidden">
        {product.badge && (
          <span className="absolute top-2 left-2 z-10 bg-slate-100 text-slate-500 text-[11px] font-medium px-3 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        <img
          ref={imgRef}
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain mix-blend-multiply will-change-transform"
          draggable={false}
        />
      </div>

      <div className="flex flex-col flex-1">
        <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
          {product.name}
        </h3>
        <p className="text-slate-400 text-[13px] mt-0.5 mb-3">
          {product.description}
        </p>

        <div ref={priceRef} className="mb-4">
          <p className="text-[22px] font-bold text-slate-900 leading-none mb-1">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-slate-400">MRP</span>
            <span className="text-slate-400 line-through">
              ₹{product.mrp.toLocaleString("en-IN")}
            </span>
            <span className="text-green-500 font-semibold">
              ({product.discount}% OFF)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-auto">
          <WaterButton
            variant="primary"
            textClassName="text-[13px] sm:text-[9px] lg:text-[14px]"
            className="py-1 px-2 text-[18px] lg:px-4 lg:py-2.5 sm:py-2 sm:text-sm"
          >
            Book Demo
          </WaterButton>
          <button
            className="text-slate-500 text-[14px] sm:text-sm border border-[#F0F3F6]
    rounded-full cursor-pointer hover:text-blue-600 hover:border-[#155DFC] font-medium transition-colors
     py-2 px-7 sm:py-2.5 lg:px-6 px-2 sm:px-3"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TopRecommendations() {
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
    <section ref={sectionRef} className="bg-[#EEF3F8] py-10 sm:py-14 lg:py-16">
      <div className="primary-container">
        <h2
          ref={headingRef}
          className="text-2xl sm:text-3xl heading lg:text-4xl font-semibold text-slate-900 mb-6 sm:mb-8"
        >
          <span className="text-[#0061C2]">Top Recommendations</span> - Water
          Purifiers
        </h2>

        <div ref={swiperWrapRef}>
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
            speed={600}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            slidesPerView={1}
            spaceBetween={16}
            breakpoints={{
              480: { slidesPerView: 1.4, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              900: { slidesPerView: 3, spaceBetween: 20 },
              1100: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="!pb-2"
          >
            {PRODUCTS.map((product) => (
              <SwiperSlide key={product.id} className="h-auto">
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            aria-label="Previous"
            onClick={handlePrev}
            className={`w-11 h-11 cursor-pointer rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm ${
              prevActive
                ? "bg-[#0061C2] text-white "
                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          <button
            aria-label="Next"
            onClick={handleNext}
            className={`w-11 h-11 cursor-pointer rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm ${
              nextActive
                ? "bg-[#0061C2] text-white "
                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}