import { useState, useRef, useLayoutEffect } from "react";
import {
  Minus,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Zap,
  Plus as PlusIcon,
} from "lucide-react";
import gsap from "gsap";
import Breadcrumb from "../components/Breadcrumb";

const BRAND = "#0061C2";
const BRAND_DARK = "#004f9e";

const initialItems = [
  {
    id: 1,
    name: "Aqualife Ever LEGO+ Water Purifier",
    color: "Black",
    discount: "25% OFF",
    mrp: 23000,
    price: 12599,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Aqualife Ever LEGO+ Water Purifier",
    color: "Black",
    discount: "25% OFF",
    mrp: 23000,
    price: 12599,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Aqualife Ever LEGO+ Water Purifier",
    color: "Black",
    discount: "25% OFF",
    mrp: 23000,
    price: 12599,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop",
  },
]; 

// Extra items revealed by the "View More" toggle
const extraItems = [
  {
    id: 4,
    name: "Aqualife Ever LEGO+ Water Purifier",
    color: "White",
    discount: "25% OFF",
    mrp: 23000,
    price: 12599,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop",
  },
  {
    id: 5,
    name: "Aqualife Ever LEGO+ Water Purifier",
    color: "Silver",
    discount: "20% OFF",
    mrp: 21000,
    price: 12999,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop",
  },
];

const formatINR = (n) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export default function CartComponent() {
  const [items, setItems] = useState(initialItems);
  const [moreItems, setMoreItems] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [displaySubtotal, setDisplaySubtotal] = useState(
    initialItems.reduce((sum, it) => sum + it.price * it.qty, 0),
  );

  const containerRef = useRef(null);
  const itemRefs = useRef({});
  const qtyRefs = useRef({});
  const badgeRef = useRef(null);
  const subtotalBoxRef = useRef(null);
  const subtotalProxy = useRef({ val: displaySubtotal });

  const allItems = [...items, ...moreItems];
  const subtotal = allItems.reduce((sum, it) => sum + it.price * it.qty, 0);
  const mrpTotal = allItems.reduce((sum, it) => sum + it.mrp * it.qty, 0);

  // ---- Entrance animation on mount ----
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cart-panel",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      );
      gsap.fromTo(
        ".bill-panel",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.1 },
      );
      gsap.fromTo(
        ".cart-item-card",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.08,
          delay: 0.2,
        },
      );
      // ambient breathing animation on "Add something else" icon
      gsap.to(".add-else-icon", {
        scale: 1.12,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Reveal / hide extra items when "View More" is toggled ----
  useLayoutEffect(() => {
    if (!showMore) return;
    const nodes = extraItems
      .map((it) => itemRefs.current[it.id])
      .filter(Boolean);
    if (!nodes.length) return;
    gsap.fromTo(
      nodes,
      { opacity: 0, y: 20, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        ease: "power2.out",
        stagger: 0.08,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMore]);

  // ---- Count-up / count-down animation on the bill total ----
  useLayoutEffect(() => {
    const tween = gsap.to(subtotalProxy.current, {
      val: subtotal,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => setDisplaySubtotal(Math.round(subtotalProxy.current.val)),
    });
    if (subtotalBoxRef.current) {
      gsap.fromTo(
        subtotalBoxRef.current,
        { scale: 1.06 },
        { scale: 1, duration: 0.35, ease: "back.out(3)" },
      );
    }
    return () => tween.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  // ---- Badge bounce whenever item count changes ----
  useLayoutEffect(() => {
    if (!badgeRef.current) return;
    gsap.fromTo(
      badgeRef.current,
      { scale: 1.4 },
      { scale: 1, duration: 0.35, ease: "back.out(4)" },
    );
  }, [items.length, moreItems.length]);

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it,
      ),
    );
    setMoreItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it,
      ),
    );
    const qtyEl = qtyRefs.current[id];
    if (qtyEl) {
      gsap.fromTo(
        qtyEl,
        { scale: 1.35 },
        { scale: 1, duration: 0.3, ease: "back.out(3)" },
      );
    }
  };

  const removeItem = (id) => {
    const el = itemRefs.current[id];
    if (!el) {
      setItems((prev) => prev.filter((it) => it.id !== id));
      setMoreItems((prev) => prev.filter((it) => it.id !== id));
      return;
    }
    const startHeight = el.scrollHeight;
    gsap.set(el, { height: startHeight, overflow: "hidden" });
    gsap.to(el, {
      height: 0,
      opacity: 0,
      scale: 0.97,
      marginBottom: 0,
      duration: 0.35,
      ease: "power2.inOut",
      onComplete: () => {
        setItems((prev) => prev.filter((it) => it.id !== id));
        setMoreItems((prev) => prev.filter((it) => it.id !== id));
        delete itemRefs.current[id];
        delete qtyRefs.current[id];
      },
    });
  };

  const toggleShowMore = () => {
    if (!showMore) {
      setMoreItems(extraItems);
      setShowMore(true);
      return;
    }
    const nodes = extraItems
      .map((it) => itemRefs.current[it.id])
      .filter(Boolean);
    if (!nodes.length) {
      setMoreItems([]);
      setShowMore(false);
      return;
    }
    gsap.to(nodes, {
      opacity: 0,
      y: -12,
      scale: 0.97,
      duration: 0.25,
      ease: "power1.in",
      stagger: 0.05,
      onComplete: () => {
        setMoreItems([]);
        setShowMore(false);
      },
    });
  };

  const bounceButton = (e) => {
    gsap.fromTo(
      e.currentTarget,
      { scale: 0.94 },
      { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" },
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:pt-44 ">
      {/* Breadcrumb */}
      <div className="absolute top-2 lg:top-34 left-0 w-full z-10">
        <div className="primary-container">
          <Breadcrumb />
        </div>
      </div>

      <div
        ref={containerRef}
        className="primary-container mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6 items-start"
      >
        {/* Cart items panel */}
        <div className="cart-panel w-full lg:flex-1 bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Header */}
          <button
            onClick={() => setExpanded((e) => !e)}
            className="w-full flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                🛒
              </span>
              <span className="font-medium text-gray-900 text-sm sm:text-base">
                Item in your cart
              </span>
              <span
                ref={badgeRef}
                className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-medium"
                style={{ backgroundColor: BRAND }}
              >
                {allItems.length}
              </span>
            </div>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {expanded && (
            <div className="px-4 sm:px-5 py-4">
              {allItems.map((item) => (
                <div
                  key={item.id}
                  ref={(el) => {
                    if (el) itemRefs.current[item.id] = el;
                  }}
                  className="cart-item-card border border-gray-200 rounded-xl overflow-hidden mb-4"
                >
                  <div className="flex gap-3 p-3 sm:p-4">
                    {/* Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md bg-black overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover opacity-90"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm sm:text-[15px] font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Color: {item.color}
                          </p>
                          <p className="text-xs text-green-600 font-medium mt-1">
                            ({item.discount})
                          </p>
                        </div>

                        {/* Qty stepper */}
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden shrink-0 h-7">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="w-7 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span
                            ref={(el) => {
                              if (el) qtyRefs.current[item.id] = el;
                            }}
                            className="w-6 text-center text-xs font-medium inline-block"
                          >
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="w-7 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-400 line-through">
                          {formatINR(item.mrp)}
                        </span>
                        <span className="text-sm sm:text-[15px] font-semibold text-gray-900">
                          {formatINR(item.price)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-red-400 hover:text-red-500"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={bounceButton}
                    className="w-full text-white text-sm font-medium py-2.5 flex items-center justify-center gap-1.5 transition-colors"
                    style={{ backgroundColor: BRAND }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = BRAND_DARK)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = BRAND)
                    }
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    Buy This Now
                  </button>
                </div>
              ))}

              <button
                onClick={toggleShowMore}
                className="w-full text-center text-sm font-medium py-1 flex items-center justify-center gap-1"
                style={{ color: BRAND }}
              >
                {showMore ? "View Less" : "View More"}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    showMore ? "rotate-180" : ""
                  }`}
                />
              </button>

              <button className="w-full border border-dashed border-gray-300 rounded-lg py-4 mt-4 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50">
                <span className="add-else-icon w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <PlusIcon className="w-3.5 h-3.5" />
                </span>
                <span className="text-sm">Add Something else.......</span>
              </button>
            </div>
          )}
        </div>

        {/* Bill summary panel */}
        <div className="bill-panel w-full lg:w-[340px] shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 lg:sticky lg:top-25">
          <h2 className="font-semibold text-gray-900 text-base">
            Bill Summary
          </h2>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Delivery to: Address 1 - 703, Gayatridham Towers, Gayatridham Tower,
            Dadar, Mumbai.
          </p>

          <div className="mt-4 border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">MRP</span>
              <span className="text-gray-400 line-through">
                {formatINR(mrpTotal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900 font-medium">
                {formatINR(displaySubtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Shiping Worth</span>
              <span className="text-green-600">
                <span className="line-through text-gray-400 mr-1">₹0</span>
                Free
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Installation Worth</span>
              <span className="text-green-600">
                <span className="line-through text-gray-400 mr-1">₹0</span>
                Free
              </span>
            </div>

            <div className="border-t border-gray-200 pt-3 flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  Bill Summary
                </p>
                <p className="text-xs text-gray-500">Include GST</p>
              </div>
              <div ref={subtotalBoxRef} className="text-right">
                <p className="font-semibold text-gray-900 text-base">
                  {formatINR(displaySubtotal)}
                </p>
                <p className="text-xs text-gray-500">
                  No-cost EMI from ₹4,000/mo
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={bounceButton}
            className="w-full mt-4 text-white font-medium py-3 rounded-lg text-sm transition-colors"
            style={{ backgroundColor: BRAND }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = BRAND_DARK)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = BRAND)
            }
          >
            Continue To Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
