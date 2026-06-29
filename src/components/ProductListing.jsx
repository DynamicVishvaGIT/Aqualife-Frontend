import { useState } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import product1 from "../assets/Purifier_1.png";
import product2 from "../assets/Purifier_2.png";
import product3 from "../assets/Purifier_3.png";
import product4 from "../assets/Purifier_4.png";
import { WaterButton } from "../components/WaterButton";

/* ── Category tabs ── */
const CATEGORIES = [
  { label: "All", img: product1 },
  { label: "Just Launched", img: product2 },
  { label: "Copper Range", img: product3 },
  { label: "UV", img: product4 },
  { label: "RO", img: product2 },
];

/* ── Mock products ── */
const PRODUCTS = [
  {
    id: 1,
    image: product1,
    badge: "New launch",
    name: "Venus",
    description: "UV+UF+Copper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
  },
  {
    id: 2,
    image: product2,
    badge: null,
    name: "Venus",
    description: "UV+UF+Copper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
  },
  {
    id: 3,
    image: product3,
    badge: null,
    name: "Venus",
    description: "UV+UF+Copper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
  },
  {
    id: 4,
    image: product4,
    badge: null,
    name: "Venus",
    description: "UV+UF+Copper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
  },
  {
    id: 5,
    image: product1,
    badge: null,
    name: "Venus Pro",
    description: "UV+UF+Copper & zinc water purifier",
    price: 32999,
    mrp: 44000,
    discount: 25,
  },
];

/* ── Product card ── */
function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-3 sm:p-5 flex flex-col h-full select-none justify-between">
      <div>
        <div className="relative bg-white rounded-xl flex items-center justify-center h-25 sm:h-52 mb-3 sm:mb-4 overflow-hidden">
          {product.badge && (
            <span className="absolute top-1.5 left-1.5 z-10 bg-slate-100 text-slate-500 text-[10px] sm:text-[11px] font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
              {product.badge}
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain mix-blend-multiply"
            draggable={false}
          />
        </div>

        <div className="flex flex-col flex-1">
          <h3 className="text-[14px] sm:text-[15px] font-bold text-slate-900 leading-tight">
            {product.name}
          </h3>
          <p className="text-slate-400 text-[11px] sm:text-[13px] mt-0.5 mb-2 sm:mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="mb-3 sm:mb-4">
            <p className="text-lg sm:text-[22px] font-bold text-slate-900 leading-none mb-1">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[11px] sm:text-[13px]">
              <span className="text-slate-400">MRP</span>
              <span className="text-slate-400 line-through">
                ₹{product.mrp.toLocaleString("en-IN")}
              </span>
              <span className="text-green-500 font-semibold whitespace-nowrap">
                ({product.discount}% OFF)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action row — optimized touch target sizing on mobile */}
      <div className="flex  sm:flex-row gap-2 mt-auto">
        <WaterButton variant="primary" className="w-full sm:flex-1 py-2 sm:py-2 text-xs sm:text-sm">
          Book Demo
        </WaterButton>
        <button className="w-full sm:flex-1 text-slate-500 text-xs sm:text-sm border border-[#F0F3F6] rounded-full cursor-pointer hover:text-blue-600 font-medium transition-colors py-2 sm:py-2.5 px-3">
          Buy Now
        </button>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function WaterPurifierListing() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="min-h-screen bg-[#F6FAFF] font-sans pb-12">
      {/* ── Category tabs ── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end gap-3 sm:gap-8 overflow-x-auto scrollbar-hide unique-scroll-container">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`flex flex-col items-center gap-1.5 pt-4 sm:pt-6 cursor-pointer shrink-0
                  border-b-2 sm:border-b-3 transition-all duration-200 min-w-[80px] sm:min-w-[110px]
                  ${active ? "border-[#155DFC]" : "border-transparent"}`}
                >
                  {/* Image */}
                  <div className="w-12 sm:w-16 h-14 sm:h-20 flex items-end justify-center">
                    <img
                      src={cat.img}
                      alt={cat.label}
                      className="max-h-full max-w-full object-contain transition-all duration-200"
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[11px] sm:text-[13px] font-medium whitespace-nowrap transition-colors pb-3 sm:pb-4 duration-200
                  ${active ? "text-[#155DFC]" : "text-slate-800 hover:text-slate-600"}`}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Page content ── */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-12">
        {/* Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-[2rem] font-semibold text-slate-900 tracking-tight leading-tight">
            Aqualife UV Water Purifiers
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-md mx-auto">
            Choose a Water Purifier that best suits your needs &amp; budget
          </p>
        </div>

        {/* Filter / Sort bar */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <button
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#D4D4D4]
             text-slate-700 text-xs sm:text-sm font-medium hover:border-blue-300 hover:text-[#155DFC]
            transition-all duration-150 cursor-pointer"
          >
            <SlidersHorizontal size={13} />
            Filters
            <ChevronDown size={13} />
          </button>
          <button
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#D4D4D4]
             text-slate-700 text-xs sm:text-sm font-medium hover:border-blue-300 hover:text-[#155DFC]
            transition-all duration-150 cursor-pointer"
          >
            Sort By
            <ChevronDown size={13} />
          </button>
        </div>

        {/* Product grid — 2 columns on mobile, scaling up smoothly */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Count + Load more */}
        <div className="mt-8 sm:mt-12 flex flex-col items-center gap-3">
          <p className="text-xs sm:text-sm text-slate-500">
            Showing {PRODUCTS.length} of 49 results
          </p>
          <button
            className="flex items-center gap-2 px-8 sm:px-10 py-2.5 sm:py-3.5 rounded-full border cursor-pointer border-[#0061C2]
            text-[#0061C2] font-semibold text-xs sm:text-sm
            hover:border-[#155DFC] hover:shadow-[0_0_20px_rgba(21,93,252,0.15)]
            transition-all duration-200 active:scale-95"
          >
            View more results
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Scoped CSS Fallback */}
      <style>{`
        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}