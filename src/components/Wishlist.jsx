import { useState, useRef, useEffect, useCallback } from "react";
import { Heart, ShoppingBag, Trash2, ChevronRight } from "lucide-react";
import product1 from "../assets/Purifier_1.png";
import product2 from "../assets/Purifier_2.png";
import product3 from "../assets/Purifier_3.png";
import product4 from "../assets/Purifier_4.png";
import { WaterButton } from "../components/WaterButton";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Brand color ── */
const BRAND = "#1A6FC4";

/* ── Mock wishlist data ── */
const INITIAL_WISHLIST = [
  {
    id: 1,
    image: product1,
    badge: "New launch",
    name: "Venus",
    description: "UV+UF+Copper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
    inStock: true,
  },
  {
    id: 2,
    image: product2,
    badge: null,
    name: "Venus Pro",
    description: "UV+UF+Copper & zinc water purifier",
    price: 32999,
    mrp: 44000,
    discount: 25,
    inStock: true,
  },
  {
    id: 3,
    image: product3,
    badge: null,
    name: "Copper Elite",
    description: "RO+UV+Copper mineral water purifier",
    price: 26499,
    mrp: 35000,
    discount: 24,
    inStock: false,
  },
  {
    id: 4,
    image: product4,
    badge: null,
    name: "Zenith UV",
    description: "UV+UF water purifier, 8L storage",
    price: 21999,
    mrp: 28000,
    discount: 21,
    inStock: true,
  },
];

/* ── Wishlist card ── */
function WishlistCard({ product, onRemove, setCardRef }) {
  const navigate  = useNavigate();
  const imgRef    = useRef(null);
  const cardRef   = useRef(null);
  const heartRef  = useRef(null);

  useEffect(() => {
    if (cardRef.current) setCardRef(cardRef.current);
  }, [setCardRef]);

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

  const handleRemove = (e) => {
    e.stopPropagation();
    if (prefersReducedMotion()) {
      onRemove(product.id);
      return;
    }
    // little "pop" on the heart, then the whole card collapses away
    gsap.timeline()
      .to(heartRef.current, { scale: 1.3, duration: 0.12, ease: "power1.out" })
      .to(heartRef.current, { scale: 1, duration: 0.12, ease: "power1.in" })
      .to(cardRef.current, {
        opacity: 0,
        scale: 0.9,
        height: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => onRemove(product.id),
      }, "+=0.05");
  };

  return (
    <div
      ref={cardRef}
      className="bg-white cursor-pointer rounded-2xl border border-slate-100 p-3 sm:p-5 flex flex-col h-full select-none justify-between relative overflow-hidden"
      onClick={() => navigate("/product-details")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={heartRef}
        onClick={handleRemove}
        aria-label={`Remove ${product.name} from wishlist`}
        className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10 w-7 h-7 sm:w-8 sm:h-8
        rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm
        cursor-pointer hover:bg-red-50 group/heart transition-colors"
      >
        <Heart
          size={15}
          className="fill-red-500 text-red-500 group-hover/heart:scale-90 transition-transform"
        />
      </button>

      <div className="relative bg-white rounded-xl flex items-center justify-center h-25 sm:h-52 mb-3 sm:mb-4 overflow-hidden">
        {product.badge && (
          <span className="absolute top-1.5 left-1.5 z-10 bg-slate-100 text-slate-500 text-[10px] sm:text-[11px] font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
            {product.badge}
          </span>
        )}
        {!product.inStock && (
          <span className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-[5] flex items-center justify-center">
            <span className="bg-slate-800 text-white text-[10px] sm:text-[11px] font-semibold px-3 py-1 rounded-full">
              Out of stock
            </span>
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

      <div className="flex gap-2 mt-auto">
        <WaterButton
          variant="primary"
          disabled={!product.inStock}
          className={`flex-1 py-1 px-2 sm:py-2.5 text-[11px] sm:text-sm flex items-center justify-center gap-1.5
          ${!product.inStock ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}`}
        >
          {product.inStock ? "Add to Cart" : "Notify Me"}
        </WaterButton>
        <button
          onClick={handleRemove}
          aria-label={`Remove ${product.name}`}
          className="text-slate-500 text-[10px] sm:text-sm border border-[#F0F3F6]
          rounded-full cursor-pointer hover:text-red-500 hover:border-red-200 font-medium transition-colors
          py-1 sm:py-2.5 px-2.5 sm:px-3 flex items-center justify-center shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

/* ── Empty state ── */
function EmptyWishlist() {
  const navigate = useNavigate();
  const heartRef = useRef(null);
  const wrapRef  = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      );
      gsap.to(heartRef.current, {
        y: -8,
        duration: 1.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="flex flex-col items-center justify-center text-center py-16 sm:py-24">
      <div
        ref={heartRef}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-5 sm:mb-6"
        style={{ background: "#EAF3FC" }}
      >
        <Heart size={36} style={{ color: BRAND }} strokeWidth={1.75} />
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5">
        Your wishlist is empty
      </h2>
      <p className="text-slate-500 text-xs sm:text-sm max-w-xs mb-6">
        Save purifiers you love here and come back to them whenever you're ready.
      </p>
      <button
        onClick={() => navigate("/water-purifiers")}
        className="flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-white cursor-pointer
        font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-95"
        style={{ background: BRAND }}
      >
        Browse Purifiers
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

/* ── Main page ── */
export default function Wishlist() {
  const [items, setItems] = useState(INITIAL_WISHLIST);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  /* ── Card refs for scroll reveal ── */
  const cardRefs = useRef([]);
  const gridRef  = useRef(null);

  const addCardRef = useCallback((el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  }, []);

  useEffect(() => {
    cardRefs.current = [];
  }, [items.length === INITIAL_WISHLIST.length]);

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
  }, []);

  return (
    <div className="min-h-screen mt-[80px] bg-[#fff7f6]">
      <div className="primary-container py-6 sm:py-12">
        {/* Heading */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-xl heading sm:text-[2rem] font-semibold text-slate-900 tracking-tight leading-tight">
            My Wishlist
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-md mx-auto">
            {items.length > 0
              ? `${items.length} ${items.length === 1 ? "item" : "items"} saved for later`
              : "Nothing saved yet"}
          </p>
        </div>

        {items.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5"
          >
            {items.map((product) => (
              <WishlistCard
                key={product.id}
                product={product}
                onRemove={removeItem}
                setCardRef={addCardRef}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}