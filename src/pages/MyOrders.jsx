import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowLeft, SlidersHorizontal, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import product1 from "../assets/Purifier_1.png";
import product2 from "../assets/Purifier_2.png";
import product3 from "../assets/Purifier_3.png";
import product4 from "../assets/Purifier_4.png";

const BRAND = "#0061C2";
const BRAND_DARK = "#004a94";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const STATUS_OPTIONS = ["On the way", "Delivered", "Cancelled", "Returned"];
const TIME_OPTIONS = ["Last week", "Last 30 days", "2025", "2024", "Older"];

const STATUS_COLORS = {
  "On the way": BRAND,
  Delivered: "#16a34a",
  Cancelled: "#ef4444",
  Returned: "#f59e0b",
};

const STATUS_BG = {
  "On the way": "#eff6ff",
  Delivered: "#f0fdf4",
  Cancelled: "#fef2f2",
  Returned: "#fffbeb",
};

const ORDERS = [
  {
    id: "ord-1",
    name: "Aqualife Ever LEGO+ Water Purifier",
    img: product1,
    color: "Black",
    price: "12,599.00",
    status: "Cancelled",
    statusLabel: "Cancelled on 22 May",
    note: "Cancelled as requested during the order confirmation call.",
    date: "22 May 2025",
  },
  {
    id: "ord-2",
    name: "Aqualife Ever LEGO+ Water Purifier",
    img: product3,
    color: "Black",
    price: "12,599.00",
    status: "Delivered",
    statusLabel: "Delivered on 6 Jun",
    note: "Your item has been delivered successfully.",
    date: "6 Jun 2025",
  },
  {
    id: "ord-3",
    name: "Aqualife Ever LEGO+ Water Purifier Pro",
    img: product4,
    color: "Black",
    price: "12,599.00",
    status: "Cancelled",
    statusLabel: "Cancelled on 22 May",
    note: "Cancelled as requested during the order confirmation call.",
    date: "22 May 2025",
  },
  {
    id: "ord-4",
    name: "Aqualife Ever LEGO+ Water Purifier",
    img: product1,
    color: "Black",
    price: "12,599.00",
    status: "Cancelled",
    statusLabel: "Cancelled on 22 May",
    note: "Cancelled as requested during the order confirmation call.",
    date: "22 May 2025",
  },
  {
    id: "ord-5",
    name: "Aqualife Ever Water Softener",
    img: product2,
    color: "Black",
    price: "18,999.00",
    status: "On the way",
    statusLabel: "Arriving tomorrow",
    note: "Shipped and on its way to you.",
    date: "24 Jul 2025",
  },
  {
    id: "ord-6",
    name: "Aqualife Ever Compact Cooler",
    img: product3,
    color: "White",
    price: "9,499.00",
    status: "Returned",
    statusLabel: "Returned on 10 May",
    note: "Return picked up — refund is being processed.",
    date: "10 May 2025",
  },
  {
    id: "ord-7",
    name: "Aqualife Ever LEGO+ Water Purifier",
    img: product4,
    color: "Black",
    price: "12,599.00",
    status: "Delivered",
    statusLabel: "Delivered on 15 Apr",
    note: "Your item has been delivered successfully.",
    date: "15 Apr 2025",
  },
];

const PAGE_SIZE = 4;

// ── Icons ─────────────────────────────────────────────────────────────────────

const ChevronIcon = ({ open }) => (
  <svg
    className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300"
    style={{ transform: open ? "rotate(0deg)" : "rotate(-180deg)" }}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
  </svg>
);

// ── FilterGroup ────────────────────────────────────────────────────────────────

const FilterGroup = ({ title, options, selected, onToggle, itemRef }) => {
  const [open, setOpen] = useState(true);
  const panelRef = useRef(null);
  const innerRef = useRef(null);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const inner = innerRef.current;
    if (!panel || !inner) return;

    if (prefersReducedMotion()) {
      panel.style.height = open ? "auto" : "0px";
      return;
    }

    gsap.killTweensOf(panel);
    if (open) {
      gsap.fromTo(panel, { height: 0 }, {
        height: inner.scrollHeight,
        duration: 0.32,
        ease: "power2.out",
        onComplete: () => { panel.style.height = "auto"; },
      });
    } else {
      gsap.to(panel, { height: 0, duration: 0.28, ease: "power2.in" });
    }
  }, [open]);

  return (
    <div ref={itemRef} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-sm heading font-semibold text-gray-700">{title}</h3>
        <ChevronIcon open={open} />
      </button>
      <div ref={panelRef} className="overflow-hidden" style={{ height: 0 }}>
        <div ref={innerRef} className="px-5 pb-4 flex flex-col gap-2.5">
          {options.map((option) => {
            const active = selected.includes(option);
            return (
              <label key={option} className="flex items-center gap-3 cursor-pointer group select-none">
                <div
                  className="w-4 h-4 heading font-semibold rounded flex-shrink-0 border-2 flex items-center justify-center transition-all duration-150"
                  style={{
                    borderColor: active ? BRAND : "#D1D5DB",
                    backgroundColor: active ? BRAND : "white",
                  }}
                >
                  {active && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => onToggle(option)}
                    className="sr-only"
                  />
                </div>
                <span className={`text-sm heading font-semibold transition-colors ${active ? "text-gray-800 font-medium" : "text-gray-500 group-hover:text-gray-700"}`}>
                  {option}
                </span>
                {STATUS_COLORS[option] && (
                  <span
                    className="ml-auto w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: STATUS_COLORS[option] }}
                  />
                )}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── OrderCard ─────────────────────────────────────────────────────────────────

const OrderCard = ({ order, cardRef }) => (
  <div
    ref={cardRef}
    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200"
  >
    <div className="flex flex-col sm:flex-row">
      {/* Image */}
      <div className="flex-shrink-0 w-full sm:w-28 h-40 sm:h-auto bg-gray-50 flex items-center justify-center p-3 sm:border-r border-b sm:border-b-0 border-gray-100">
        <img
          src={order.img}
          loading="lazy"
          alt={order.name}
          className="w-24 h-24 object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <p className="text-sm heading font-semibold text-gray-900 leading-snug line-clamp-2 mb-1">
            {order.name}
          </p>
          <p className="text-xs text-gray-400">Color: {order.color}</p>
          <p className="text-xs text-gray-400 mt-0.5">{order.date}</p>
        </div>

        {/* Price */}
        <div className="sm:w-32 flex-shrink-0">
          <p className="text-base heading font-bold text-gray-900">₹{order.price}</p>
        </div>

        {/* Status */}
        <div className="sm:w-56 flex-shrink-0">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-1.5"
            style={{
              backgroundColor: STATUS_BG[order.status],
              color: STATUS_COLORS[order.status],
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: STATUS_COLORS[order.status] }}
            />
            {order.statusLabel}
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{order.note}</p>
        </div>

        {/* Action */}
        <div className="sm:w-24 flex-shrink-0 flex sm:flex-col gap-2 sm:items-end">
          <button
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap"
          >
            View details
          </button>
          {order.status === "Delivered" && (
            <button
              className="text-xs font-semibold px-4 py-1.5 rounded-lg text-white transition-all cursor-pointer whitespace-nowrap"
              style={{ backgroundColor: BRAND }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND_DARK)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND)}
            >
              Buy again
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

// ── Mobile Filter Drawer ───────────────────────────────────────────────────────

const MobileFilterDrawer = ({ open, onClose, children }) => {
  const overlayRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!overlayRef.current || !drawerRef.current) return;
    if (open) {
      document.body.style.overflow = "hidden";
      if (!prefersReducedMotion()) {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
        gsap.fromTo(drawerRef.current, { x: "-100%" }, { x: "0%", duration: 0.3, ease: "power3.out" });
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        ref={drawerRef}
        className="absolute left-0 top-0 h-full w-[min(320px,85vw)] bg-white flex flex-col"
        style={{ transform: prefersReducedMotion() ? "none" : "translateX(-100%)" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Filters</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {children}
        </div>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-colors cursor-pointer"
            style={{ backgroundColor: BRAND }}
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
};

// ── OrdersPage ────────────────────────────────────────────────────────────────

const OrdersPage = () => {
  const sidebarRef = useRef(null);
  const sidebarItemsRef = useRef([]);
  const mainRef = useRef(null);
  const cardRefs = useRef([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(sidebarRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" });
      gsap.fromTo(
        sidebarItemsRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: "power2.out", delay: 0.12 }
      );
      gsap.fromTo(mainRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out", delay: 0.1 });
    });
    return () => ctx.revert();
  }, []);

  const addSidebarItem = (el) => {
    if (el && !sidebarItemsRef.current.includes(el)) sidebarItemsRef.current.push(el);
  };

  const toggleStatus = (opt) => {
    setSelectedStatuses((p) => p.includes(opt) ? p.filter((o) => o !== opt) : [...p, opt]);
    setVisibleCount(PAGE_SIZE);
  };

  const toggleTime = (opt) => {
    setSelectedTimes((p) => p.includes(opt) ? p.filter((o) => o !== opt) : [...p, opt]);
  };

  const filteredOrders = useMemo(() => {
    return ORDERS.filter((order) => {
      const matchesSearch = order.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(order.status);
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatuses]);

  const visibleOrders = filteredOrders.slice(0, visibleCount);
  const allShown = visibleCount >= filteredOrders.length;
  const activeFilterCount = selectedStatuses.length + selectedTimes.length;

  cardRefs.current = [];
  const addCardRef = (el) => { if (el) cardRefs.current.push(el); };

  const visibleIdsKey = visibleOrders.map((o) => o.id).join(",");
  useEffect(() => {
    if (prefersReducedMotion() || !cardRefs.current.length) return;
    gsap.fromTo(
      cardRefs.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.38, stagger: 0.06, ease: "power2.out" }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleIdsKey]);

  const clearAllFilters = () => {
    setSelectedStatuses([]);
    setSelectedTimes([]);
    setSearchQuery("");
    setVisibleCount(PAGE_SIZE);
  };

  const filterPanels = (
    <>
      <FilterGroup
        title="Order Status"
        options={STATUS_OPTIONS}
        selected={selectedStatuses}
        onToggle={toggleStatus}
        itemRef={addSidebarItem}
      />
      <FilterGroup
        title="Order Time"
        options={TIME_OPTIONS}
        selected={selectedTimes}
        onToggle={toggleTime}
        itemRef={addSidebarItem}
      />
      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors text-left px-1 cursor-pointer"
        >
          Clear all filters
        </button>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-[#F7FAFF] font-sans overflow-x-clip">
      {/* Mobile filter drawer */}
      <MobileFilterDrawer open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
        {filterPanels}
      </MobileFilterDrawer>

      {/* Back button */}
      {/* <div className="absolute top-22 lg:top-30 left-0 w-full z-10">
        <div className="primary-container">
          <button
            onClick={() => navigate(-1)}
            className="group cursor-pointer w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-white hover:text-[#0061C2] hover:shadow-sm transition-all duration-200 active:scale-90"
          >
            <ArrowLeft size={20} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          </button>
        </div>
      </div> */}

      <div className="primary-container pb-10 pt-[100px] lg:pt-[131px]">
    
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5 items-start">
          {/* ── Desktop sidebar ── */}
          <aside
            ref={sidebarRef}
            style={{ opacity: 0 }}
            className="hidden lg:flex flex-col gap-3 lg:sticky lg:top-28"
          >
            <div ref={addSidebarItem} className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold heading text-gray-800 tracking-wide uppercase">Filters</h2>
              {activeFilterCount > 0 && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: BRAND }}
                >
                  {activeFilterCount}
                </span>
              )}
            </div>
            {filterPanels}
          </aside>

          {/* ── Main ── */}
          <main ref={mainRef} style={{ opacity: 0 }}>
            {/* Search + mobile filter trigger */}
            <div className="flex gap-2 mb-4">
              <div className="flex flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors focus-within:border-[#0061C2] focus-within:shadow-[0_0_0_3px_rgba(0,97,194,0.1)]">
                <div className="flex items-center pl-4 text-gray-400">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  placeholder="Search your orders…"
                  className="flex-1 px-3 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(""); setVisibleCount(PAGE_SIZE); }}
                    className="pr-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer relative"
              >
                <SlidersHorizontal size={15} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                    style={{ backgroundColor: BRAND }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Active filter chips */}
            {(selectedStatuses.length > 0 || selectedTimes.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {[...selectedStatuses, ...selectedTimes].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => {
                      if (selectedStatuses.includes(chip)) toggleStatus(chip);
                      else toggleTime(chip);
                    }}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all cursor-pointer"
                    style={{
                      borderColor: STATUS_COLORS[chip] ? STATUS_COLORS[chip] + "40" : "#E5E7EB",
                      backgroundColor: STATUS_COLORS[chip] ? STATUS_BG[chip] : "#F9FAFB",
                      color: STATUS_COLORS[chip] || "#374151",
                    }}
                  >
                    {chip}
                    <X size={11} />
                  </button>
                ))}
              </div>
            )}

            {/* Orders */}
            {visibleOrders.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 px-6 py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <SearchIcon />
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-1">No orders found</p>
                <p className="text-xs text-gray-400 mb-4">Try adjusting your search or filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="text-sm font-semibold cursor-pointer transition-colors"
                  style={{ color: BRAND }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {visibleOrders.map((order) => (
                  <OrderCard key={order.id} order={order} cardRef={addCardRef} />
                ))}
              </div>
            )}

            {/* View more / less */}
            {filteredOrders.length > PAGE_SIZE && (
              <div className="flex justify-center mt-5">
                <button
                  onClick={() =>
                    setVisibleCount((prev) =>
                      allShown ? PAGE_SIZE : Math.min(prev + PAGE_SIZE, filteredOrders.length)
                    )
                  }
                  className="flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-full border transition-all cursor-pointer hover:shadow-sm"
                  style={{ color: BRAND, borderColor: BRAND + "40" }}
                >
                  {allShown ? "Show less" : `Show more (${filteredOrders.length - visibleCount} remaining)`}
                  <ChevronIcon open={!allShown} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;