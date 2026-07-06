import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "https://cdn.skypack.dev/gsap";
import { ArrowLeft } from "lucide-react";
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

const ORDERS = [
  {
    id: "ord-1",
    name: "Aqualife Ever LEGO+ Water Purifier Aqualife",
    img: product1,
    color: "Black",
    price: "12,599.00",
    status: "Cancelled",
    statusLabel: "Cancelled by 22 May",
    note: "Your order has been canceled as requested during the automated order confirmation call.",
  },
  {
    id: "ord-2",
    name: "Aqualife Ever LEGO+ Water Purifier",
    img: product3,
    color: "Black",
    price: "12,599.00",
    status: "Delivered",
    statusLabel: "Delivered by 6 Jun",
    note: "Your item has been delivered.",
  },
  {
    id: "ord-3",
    name: "Aqualife Ever LEGO+ Water Purifier",
    img: product4,
    color: "Black",
    price: "12,599.00",
    status: "Cancelled",
    statusLabel: "Cancelled by 22 May",
    note: "Your order has been canceled as requested during the automated order confirmation call.",
  },
  {
    id: "ord-4",
    name: "Aqualife Ever LEGO+ Water Purifier",
    img: product1,
    color: "Black",
    price: "12,599.00",
    status: "Cancelled",
    statusLabel: "Cancelled by 22 May",
    note: "Your order has been canceled as requested during the automated order confirmation call.",
  },
  {
    id: "ord-5",
    name: "Aqualife Ever LEGO+ Water Softener",
    img: product2,
    color: "Black",
    price: "18,999.00",
    status: "On the way",
    statusLabel: "Arriving tomorrow",
    note: "Your order has been shipped and is on its way.",
  },
  {
    id: "ord-6",
    name: "Aqualife Ever Compact Cooler",
    img: product3,
    color: "White",
    price: "9,499.00",
    status: "Returned",
    statusLabel: "Returned on 10 May",
    note: "Your return has been picked up and refund is being processed.",
  },
  {
    id: "ord-7",
    name: "Aqualife Ever LEGO+ Water Purifier",
    img: product4,
    color: "Black",
    price: "12,599.00",
    status: "Delivered",
    statusLabel: "Delivered by 15 Apr",
    note: "Your item has been delivered.",
  },
];

const PAGE_SIZE = 4;

const ChevronIcon = ({ open }) => (
  <svg
    className="w-4 h-4 text-gray-500 flex-shrink-0"
    style={{
      transform: open ? "rotate(0deg)" : "rotate(-180deg)",
      transition: "transform 0.3s",
    }}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const SearchIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    viewBox="0 0 24 24"
  >
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
  </svg>
);



// Reusable collapsible filter card (Orders status / Orders Time)
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

    const targetHeight = inner.scrollHeight;
    gsap.killTweensOf(panel);

    if (open) {
      gsap.fromTo(
        panel,
        { height: 0 },
        {
          height: targetHeight,
          duration: 0.35,
          ease: "power2.out",
          onComplete: () => {
            panel.style.height = "auto";
          },
        },
      );
    } else {
      gsap.to(panel, { height: 0, duration: 0.3, ease: "power2.in" });
    }
  }, [open]);

  return (
    <div
      ref={itemRef}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-4"
      >
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <ChevronIcon open={open} />
      </button>
      <div ref={panelRef} className="overflow-hidden select-none " style={{ height: 0 }}>
        <div ref={innerRef} className="px-5 pb-4 flex flex-col gap-3 font-semibold">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center heading select-none gap-2.5 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => onToggle(option)}
                className="w-4 h-4 rounded cursor-pointer"
                style={{ accentColor: BRAND }}
              />
              {option}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

const OrdersPage = () => {
  const sidebarRef = useRef(null);
  const sidebarItemsRef = useRef([]);
  const mainRef = useRef(null);
  const cardRefs = useRef([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const navigate = useNavigate();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sidebarRef.current,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.55, ease: "power3.out" },
      );
      gsap.fromTo(
        sidebarItemsRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.15,
        },
      );
      gsap.fromTo(
        mainRef.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.55, ease: "power3.out", delay: 0.1 },
      );
    });
    return () => ctx.revert();
  }, []);

  const addSidebarItem = (el) => {
    if (el && !sidebarItemsRef.current.includes(el)) {
      sidebarItemsRef.current.push(el);
    }
  };

  const toggleStatus = (option) => {
    setSelectedStatuses((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option],
    );
    setVisibleCount(PAGE_SIZE);
  };

  const toggleTime = (option) => {
    // Time filtering is UI-only here — wire this up to real order timestamps
    // once order data comes from the API.
    setSelectedTimes((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option],
    );
  };

  const filteredOrders = useMemo(() => {
    return ORDERS.filter((order) => {
      const matchesSearch = order.name
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());
      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(order.status);
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, selectedStatuses]);

  const visibleOrders = filteredOrders.slice(0, visibleCount);
  const allShown = visibleCount >= filteredOrders.length;

  const bumpButton = (el) => {
    if (!el || prefersReducedMotion()) return;
    gsap.fromTo(
      el,
      { scale: 1 },
      { scale: 0.95, duration: 0.1, ease: "power2.out", yoyo: true, repeat: 1 },
    );
  };

  // reset the card ref list each render, populated as cards mount below
  cardRefs.current = [];
  const addCardRef = (el) => {
    if (el) cardRefs.current.push(el);
  };

  const visibleIdsKey = visibleOrders.map((o) => o.id).join(",");
  useEffect(() => {
    if (prefersReducedMotion() || !cardRefs.current.length) return;
    gsap.fromTo(
      cardRefs.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleIdsKey]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-x-clip">
      <div className="absolute top-22 lg:top-30 left-0 w-full z-10">
        <div className="primary-container">
          <button
            onClick={() => navigate(-1)}
            className="group cursor-pointer w-10 h-10 flex items-center justify-center rounded-full text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-[#0061C2] active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0061C2]/30"
          >
            <ArrowLeft
              size={22}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
          </button>
        </div>
      </div>
      <div className="primary-container  pt-33 pb-5 lg:pt-[170px]">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 items-start">
          {/* Sidebar filters */}
          <aside
            ref={sidebarRef}
            style={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            <div
              ref={addSidebarItem}
              className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4"
            >
              <h2 className="heading text-lg font-semibold text-gray-800">Filters</h2>
            </div>

            <FilterGroup
              title="Orders status"
              options={STATUS_OPTIONS}
              selected={selectedStatuses}
              onToggle={toggleStatus}
              itemRef={addSidebarItem}
            />

            <FilterGroup
              title="Orders Time"
              options={TIME_OPTIONS}
              selected={selectedTimes}
              onToggle={toggleTime}
              itemRef={addSidebarItem}
            />
          </aside>

          {/* Main content */}
          <main ref={mainRef} style={{ opacity: 0 }}>
            {/* Search bar */}
            <div className="flex flex-col sm:flex-row rounded-xl border border-gray-200 overflow-hidden bg-white mb-5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                placeholder="Search Your order here"
                className="flex-1 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
              <button
                className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: BRAND }}
                onClick={(e) => bumpButton(e.currentTarget)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = BRAND_DARK)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = BRAND)
                }
              >
                <SearchIcon />
                Search
              </button>
            </div>

            {/* Order list */}
            {visibleOrders.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-12 text-center">
                <p className="text-sm text-gray-500">
                  No orders match your filters.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {visibleOrders.map((order) => (
                  <div
                    key={order.id}
                    ref={addCardRef}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm px-5 py-4 transition-shadow hover:shadow-md flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    {/* Thumbnail + details */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-15 h-15 lg:h-24 lg:w-22">
                       <img src={order.img} className="w-full h-full" alt="order_img" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm heading font-semibold text-gray-800 truncate max-w-[240px] sm:max-w-[280px]">
                          {order.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Color: {order.color}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="sm:w-28  flex-shrink-0 heading font-semibold">
                      <p className="text-sm font-semibold text-gray-800">
                        ₹ {order.price}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="sm:w-72 flex-shrink-0 ">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: STATUS_COLORS[order.status],
                          }}
                        />
                        <p className="text-sm heading font-semibold font-semibold text-gray-800">
                          {order.statusLabel}
                        </p>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{order.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View more / view less */}
            {filteredOrders.length > PAGE_SIZE && (
              <div className="flex justify-center mt-5">
                <button
                  onClick={() =>
                    setVisibleCount((prev) =>
                      allShown
                        ? PAGE_SIZE
                        : Math.min(prev + PAGE_SIZE, filteredOrders.length),
                    )
                  }
                  className="flex items-center gap-1 text-sm font-medium transition-colors"
                  style={{ color: BRAND }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = BRAND_DARK)
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.color = BRAND)}
                >
                  {allShown ? "View Less" : "View More"}
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
