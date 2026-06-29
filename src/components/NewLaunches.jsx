import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";

import product1 from "../assets/Purifier_1.png";
import product2 from "../assets/Purifier_2.png";
import product3 from "../assets/Purifier_3.png";
import product4 from "../assets/Purifier_4.png";

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
  return (
    <div
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

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
    setLastDir("prev");
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
    setLastDir("next");
  };

  return (
    <section className="bg-white py-10 sm:py-12 lg:py-16">
      <div className="primary-container">

        {/* Heading row */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
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
          {PRODUCTS.map((product) => (
            <SwiperSlide key={product.id} className="h-auto self-stretch">
              <div className="h-full">
                <ProductCard product={product} />
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