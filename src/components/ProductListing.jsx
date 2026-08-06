import { useState, useRef, useEffect, useCallback } from "react";
import { SlidersHorizontal, ChevronDown, ChevronRight, X } from "lucide-react";
import product1 from "../assets/Purifier_1.png";
import product2 from "../assets/Purifier_2.png";
import product3 from "../assets/Purifier_3.png";
import product4 from "../assets/Purifier_4.png";
import { WaterButton } from "../components/WaterButton";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FilterDrawer, { FILTER_GROUPS } from "../components/FilterDrawer";
import SortModal from "../components/SortModal";

gsap.registerPlugin(ScrollTrigger);

/* ── Brand color ── */
const BRAND = "#1A6FC4";

/* ── Category tabs ── */
const CATEGORIES = [
  { label: "All",           img: product1 },
  { label: "Just Launched", img: product2 },
  { label: "Copper Range",  img: product3 },
  { label: "UV",            img: product4 },
  { label: "RO",            img: product2 },
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

// [fix1] expanded to match FilterDrawer's full key set
const emptyFilters = {
  priceRange:   [],
  discount:     [],
  category:     [],
  purification: [],
  tds:          [],
  capacity:     [],
};

/* ── Product card ── */
function ProductCard({ product, setCardRef }) {
  const navigate  = useNavigate();
  const imgRef    = useRef(null);
  const cardRef   = useRef(null);
  const priceRef  = useRef(null);

  useEffect(() => {
    if (cardRef.current) setCardRef(cardRef.current);
  }, [setCardRef]); // safe now that setCardRef is stable (useCallback in parent)

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMouseEnter = () => {
    if (prefersReducedMotion()) return;
    gsap.to(cardRef.current, {
      y: -6,
      boxShadow: "0 20px 40px -12px rgba(15, 23, 42, 0.18)",
      duration: 0.35,
      ease: "power2.out",
    });
    gsap.to(imgRef.current, { scale: 1.08, duration: 0.5, ease: "power2.out" });
    gsap.fromTo(
      priceRef.current,
      { scale: 1 },
      { scale: 1.04, duration: 0.25, ease: "power2.out", yoyo: true, repeat: 1 },
    );
  };

  const handleMouseLeave = () => {
    if (prefersReducedMotion()) return;
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: "0 0px 0px 0px rgba(15, 23, 42, 0)",
      duration: 0.35,
      ease: "power2.out",
    });
    gsap.to(imgRef.current, { scale: 1, duration: 0.5, ease: "power2.out" });
  };

  return (
    <div
      ref={cardRef}
      className="bg-white cursor-pointer rounded-2xl border border-slate-100 p-3 sm:p-5 flex flex-col h-full select-none justify-between"
      onClick={() => navigate("/product-details")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative bg-white rounded-xl flex items-center justify-center h-25 sm:h-52 mb-3 sm:mb-4 overflow-hidden">
        {product.badge && (
          <span className="absolute top-1.5 left-1.5 z-10 bg-slate-100 text-slate-500 text-[10px] sm:text-[11px] font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
            {product.badge}
          </span>
        )}
        <img
          ref={imgRef}
          loading="lazy"
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain mix-blend-multiply will-change-transform"
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

        <div ref={priceRef} className="mb-3 sm:mb-4">
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

      <div className="flex gap-2 mt-auto">
        <WaterButton
          variant="primary"
          className="flex-1 py-1 px-2 sm:py-2.5 text-[11px] sm:text-sm"
        >
          Book Demo
        </WaterButton>
        <button
          className="flex-1 text-slate-500 text-[10px] sm:text-sm border border-[#F0F3F6]
          rounded-full cursor-pointer hover:text-blue-600 hover:border-[#155DFC] font-medium transition-colors
          py-1 sm:py-2.5 px-2 sm:px-3"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function WaterPurifierListing() {
  const [activeCategory, setActiveCategory] = useState("All");

  /* ── Filter + sort state ── */
  const [filters,    setFilters]    = useState(emptyFilters);
  const [sortBy,     setSortBy]     = useState("popularity");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen,   setSortOpen]   = useState(false);
  const sortBtnRef = useRef(null);

  const activeFilterCount = Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);

  const removeFilterChip = (groupKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [groupKey]: prev[groupKey].filter((v) => v !== value),
    }));
  };

  const clearAllFilters = () => setFilters(emptyFilters);

  /* ── Category tab animation refs ── */
  const tabRefs      = useRef({});
  const iconRefs     = useRef({});
  const indicatorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const activeTab = tabRefs.current[activeCategory];
    const indicator = indicatorRef.current;
    const container = containerRef.current;
    if (activeTab && indicator && container) {
      const tabRect       = activeTab.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      gsap.to(indicator, {
        x: tabRect.left - containerRect.left + container.scrollLeft,
        width: tabRect.width,
        duration: 0.45,
        ease: "power3.out",
      });
    }
    const activeIcon = iconRefs.current[activeCategory];
    if (activeIcon) {
      gsap.fromTo(
        activeIcon,
        { scale: 1 },
        { scale: 1.15, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.inOut" },
      );
    }
  }, [activeCategory]);

  /* ── Scroll-triggered staggered reveal: Category tabs ── */
  useEffect(() => {
    const tabs     = tabRefs.current;
    const elements = CATEGORIES.map((cat) => tabs[cat.label]).filter(Boolean);
    if (!elements.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  /* ── Product grid refs ── */
  const cardRefs = useRef([]);
  const gridRef  = useRef(null);

  // [fix3] stable ref so ProductCard's useEffect dep doesn't fire every render
  const addCardRef = useCallback((el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  }, []);

  /* ── Scroll-triggered staggered reveal: Product cards ── */
  useEffect(() => {
    // [fix4] clear stale refs from the previous category before collecting new ones
    cardRefs.current = [];
  }, [activeCategory]);

  useEffect(() => {
    if (!cardRefs.current.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 32, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 88%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    });

    return () => ctx.revert();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#fff7f6]">
      {/* ── Category tabs ── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <div className="primary-container lm-auto">
          <div
            ref={containerRef}
            className="relative flex items-end justify-start sm:justify-center gap-3 sm:gap-8 overflow-x-auto scrollbar-hide unique-scroll-container"
          >
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  ref={(el) => (tabRefs.current[cat.label] = el)}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`flex flex-col items-center gap-1.5 pt-4 sm:pt-7 cursor-pointer shrink-0
                  border-b-2 sm:border-b-3 duration-500 hover:scale-105 min-w-[90px] sm:min-w-[120px]
                  2xl:min-w-[160px] border-transparent`}
                >
                  <div
                    ref={(el) => (iconRefs.current[cat.label] = el)}
                    className="w-12 sm:w-16 h-14 sm:h-20 flex items-end justify-center"
                  >
                    <img
                      loading="lazy"
                      src={cat.img}
                      alt={cat.label}
                      className="max-h-full max-w-full object-contain transition-all duration-200"
                    />
                  </div>
                  <span
                    className={`text-[12px] sm:text-[13px] font-semibold whitespace-nowrap transition-colors pb-3 sm:pb-4 duration-200
                    ${active ? "text-[#1A6FC4]" : "text-slate-800 hover:text-slate-600"}`}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}

            <div
              ref={indicatorRef}
              className="absolute bottom-0 left-0 h-[2px] sm:h-[3px] rounded-full pointer-events-none"
              style={{ width: 0, background: BRAND }}
            />
          </div>
        </div>
      </div>

      {/* ── Page content ── */}
      <div className="primary-container py-6 sm:py-12">
        {/* Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl heading sm:text-[2rem] font-semibold text-slate-900 tracking-tight leading-tight">
            Aqualife UV Water Purifiers
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-md mx-auto">
            Choose a Water Purifier that best suits your needs &amp; budget
          </p>
        </div>

        {/* Filter / Sort bar */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
          <button
            onClick={() => setFilterOpen(true)}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm font-medium
              transition-all duration-150 cursor-pointer
              ${activeFilterCount > 0
                ? "border-[#1A6FC4] text-[#1A6FC4] bg-blue-50"
                : "border-[#D4D4D4] text-slate-700 hover:border-blue-300 hover:text-[#1A6FC4]"
              }`}
          >
            <SlidersHorizontal size={13} />
            Filters
            {activeFilterCount > 0 && (
              <span
                className="text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                style={{ background: BRAND }}
              >
                {activeFilterCount}
              </span>
            )}
            <ChevronDown size={13} />
          </button>

          <button
            ref={sortBtnRef}
            onClick={() => setSortOpen(true)}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm font-medium
              transition-all duration-150 cursor-pointer
              ${sortBy !== "popularity"
                ? "border-[#1A6FC4] text-[#1A6FC4] bg-blue-50"
                : "border-[#D4D4D4] text-slate-700 hover:border-blue-300 hover:text-[#1A6FC4]"
              }`}
          >
            Sort By
            <ChevronDown size={13} />
          </button>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6 sm:mb-8">
            {Object.entries(filters).flatMap(([groupKey, values]) => {
              // Look up the human-readable label from FILTER_GROUPS
              const group = FILTER_GROUPS.find((g) => g.key === groupKey);
              return values.map((value) => {
                const opt = group?.options.find((o) => o.value === value);
                const chipLabel = opt?.label ?? value.replace(/-/g, " ");
                return (
                  <span
                    key={`${groupKey}-${value}`}
                    className="flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-blue-50 text-[#1A6FC4] text-xs font-medium"
                  >
                    {chipLabel}
                    <button
                      onClick={() => removeFilterChip(groupKey, value)}
                      aria-label={`Remove ${chipLabel} filter`}
                      className="p-0.5 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      <X size={11} />
                    </button>
                  </span>
                );
              });
            })}
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors cursor-pointer px-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Product grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5"
        >
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} setCardRef={addCardRef} />
          ))}
        </div>

        {/* Count + Load more */}
        <div className="mt-8 sm:mt-12 flex flex-col items-center gap-3">
          <p className="text-xs sm:text-sm text-slate-500">
            Showing {PRODUCTS.length} of 49 results
          </p>
          <button
            className="flex items-center gap-2 px-8 sm:px-10 py-2.5 sm:py-3.5 rounded-full border cursor-pointer
            font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-95"
            style={{ borderColor: BRAND, color: BRAND }}
          >
            View more results
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Filter drawer + Sort modal ── */}
      <FilterDrawer
        isOpen={filterOpen}
        filters={filters}
        onApply={(f) => { setFilters(f); setFilterOpen(false); }}
        onClose={() => setFilterOpen(false)}
      />
      <SortModal
        isOpen={sortOpen}
        value={sortBy}
        onSelect={setSortBy}
        onClose={() => setSortOpen(false)}
        anchorRef={sortBtnRef}
      />

      <style>{`
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}