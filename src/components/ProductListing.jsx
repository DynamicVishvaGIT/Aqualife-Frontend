import { useState } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  BadgePercent,
} from "lucide-react";
import product1 from "../assets/Purifier_1.png";
import product2 from "../assets/Purifier_2.png";
import product3 from "../assets/Purifier_3.png";
import product4 from "../assets/Purifier_4.png";
import {WaterButton} from "../components/WaterButton"


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



/* ── Product card ── */
function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 flex flex-col h-full select-none">
      <div className="relative bg-white rounded-xl flex items-center justify-center h-44 sm:h-52 mb-4 overflow-hidden">
        {product.badge && (
          <span className="absolute top-2 left-2 z-10 bg-slate-100 text-slate-500 text-[11px] font-medium px-3 py-1 rounded-full">
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
        <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
          {product.name}
        </h3>
        <p className="text-slate-400 text-[13px] mt-0.5 mb-3">
          {product.description}
        </p>

        <div className="mb-4">
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

        {/* Action row — was a fixed flex-row with no width control, so on a
            base 2-col mobile grid (~150-160px card width) "Book Demo" +
            "Buy Now" had nowhere to go but overflow/crush. Now stacks
            vertically below sm, then sits side-by-side once cards have
            real room (sm+ still 2-col but viewport ≥640px gives each card
            more width). Also fixed "border-1" (not a real Tailwind class —
            the Buy Now button had an invisible border on every screen) and
            removed the duplicate "rounded-full". */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto">
          <WaterButton variant="primary" className="w-full sm:flex-1">
            Book Demo
          </WaterButton>
          <button className="w-full sm:flex-1 text-slate-500 text-[14px] border border-[#F0F3F6] rounded-full cursor-pointer hover:text-blue-600 text-sm font-medium transition-colors px-5 py-2">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function WaterPurifierListing() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="min-h-screen bg-[#F6FAFF] font-sans">
      {/* ── Category tabs ── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          {/* min-w and gap tightened at base so the scrollable row on a
              320-375px phone isn't ~700px of scroll before reaching the
              last tab. scrollbar-hide class below + inline <style> fallback
              guarantees the scrollbar is actually hidden on every browser/
              screen, since "scrollbar-none" isn't a default Tailwind utility
              unless a plugin is configured for it. */}
          <div className="flex items-end gap-5 sm:gap-10 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`flex flex-col items-center m-auto gap-2 pt-[30px] cursor-pointer shrink-0
              border-b-3 transition-all duration-200 min-w-[100px] sm:min-w-[120px]
              ${active ? "border-[#155DFC]" : "border-transparent"}`}
                >
                  {/* Image — no box, just floating product photo */}
                  <div className="w-16 h-20 flex items-end justify-center">
                    <img
                      src={cat.img}
                      alt={cat.label}
                      className={`max-h-full max-w-full object-contain transition-all duration-200  `}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[13px] heading font-medium whitespace-nowrap transition-colors pb-6 duration-200
              ${active ? "text-[#155DFC]" : "black hover:text-slate-700"}`}
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
      <div className="primary-container py-8 sm:py-12">
        {/* Heading */}
        <div className="text-center mb-7">
          <h1 className="text-2xl sm:text-[2rem] heading font-semibold text-slate-900 tracking-tight">
            Aqualife UV Water Purifiers
          </h1>
          <p className="text-slate-500 text-sm mt-2 heading">
            Choose Water Purifier that best suits your needs &amp; budget
          </p>
        </div>

        {/* Filter / Sort bar */}
        <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4D4D4]
             text-slate-700 text-sm font-medium hover:border-blue-300 hover:text-[#155DFC]
            transition-all duration-150 cursor-pointer"
          >
            <SlidersHorizontal size={15} />
            All Filters
            <ChevronDown size={14} />
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4D4D4]
             text-slate-700 text-sm font-medium hover:border-blue-300 hover:text-[#155DFC]
            transition-all duration-150 cursor-pointer"
          >
            Sort By
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Count + Load more */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-sm text-slate-500">
            Showing {PRODUCTS.length} of 49 results
          </p>
          <button
            className="flex items-center gap-2 px-10 py-3.5 rounded-full border-1 cursor-pointer border-[#0061C2]
            text-[#0061C2] font-semibold text-sm heading
            hover:border-[#155DFC] hover:shadow-[0_0_20px_rgba(21,93,252,0.15)]
            transition-all duration-200 active:scale-95"
          >
            View more results
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Fallback for hiding the category-tab scrollbar across all browsers,
          since Tailwind has no built-in "scrollbar-none" utility by default. */}
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