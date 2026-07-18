// components/FilterDrawer.jsx
import { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import gsap from "gsap";

export const FILTER_GROUPS = [
  {
    key: "priceRange",
    label: "Price",
    options: [
      { value: "5k-10k",    label: "₹5,000 – ₹10,000",  sub: "5000-10000" },
      { value: "10k-15k",   label: "₹10,000 – ₹15,000", sub: "10000-15000" },
      { value: "15k-20k",   label: "₹15,000 – ₹20,000", sub: "15000-20000" },
      { value: "above-20k", label: "₹20,000+",           sub: ">20000" },
    ],
  },
  {
    key: "purification",
    label: "Purification Technology",
    options: [
      { value: "ro",          label: "RO",             sub: "Reverse Osmosis" },
      { value: "uv",          label: "UV",             sub: "Ultra Violet" },
      { value: "uf",          label: "UF",             sub: "Ultra Filtration" },
      { value: "copper-zinc", label: "Copper & Zinc",  sub: "Mineral Boost" },
    ],
  },

  {
    key: "capacity",
    label: "Tank Capacity",
    options: [
      { value: "under-6l",  label: "Under 6L",  sub: "Compact" },
      { value: "6-10l",     label: "6L – 10L",  sub: "Standard" },
      { value: "above-10l", label: "Above 10L", sub: "Large" },
    ],
  },
];

const emptyFilters = {
  priceRange:   [],
  discount:     [],
  category:     [],
  purification: [],
  tds:          [],
  capacity:     [],
};

export default function FilterDrawer({ isOpen, filters = emptyFilters, onApply, onClose }) {
  const [mounted,   setMounted]   = useState(false);
  const [closing,   setClosing]   = useState(false);
  const [pending,   setPending]   = useState(filters);
  const [activeTab, setActiveTab] = useState(0);

  const overlayRef   = useRef(null);
  const panelRef     = useRef(null);
  const optionsRef   = useRef(null);
  const isClosingRef = useRef(false); // guard: prevents double-fire of requestClose
  const isMobileRef  = useRef(false);

  // ── mount / sync ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      isClosingRef.current = false;
      isMobileRef.current  = window.innerWidth < 640;
      setPending(filters);
      setClosing(false);
      setActiveTab(0);
      setMounted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // scroll-lock while open
  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [mounted]);

  // ── open animation ────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    if (!mounted || closing) return;
    const reduced  = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = isMobileRef.current;

    if (reduced) {
      gsap.set([overlayRef.current, panelRef.current], { opacity: 1, scale: 1, y: 0 });
      return;
    }

    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(panelRef.current, isMobile ? { y: "100%" } : { scale: 0.96, opacity: 0, y: 12 });

    gsap.timeline()
      .to(overlayRef.current, { opacity: 1, duration: 0.22, ease: "power2.out" })
      .to(
        panelRef.current,
        isMobile
          ? { y: "0%", duration: 0.42, ease: "power4.out" }
          : { scale: 1, opacity: 1, y: 0, duration: 0.38, ease: "power3.out" },
        "-=0.1",
      );
  }, [mounted, closing]);

  // ── requestClose — ref-based so all callers share the same guard ──────────
  // Pattern mirrors SortModal: isClosingRef blocks double-fires, setMounted(false)
  // lives only in onComplete so the element stays alive during the exit animation.
  const requestCloseRef = useRef(null);
  requestCloseRef.current = () => {
    if (isClosingRef.current) return; // already closing — ignore
    isClosingRef.current = true;

    const reduced  = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = isMobileRef.current;

    const finish = () => {
      isClosingRef.current = false;
      setClosing(false);
      setMounted(false);
      onClose();
    };

    if (reduced || !overlayRef.current || !panelRef.current) { finish(); return; }

    setClosing(true);

    gsap.timeline({ onComplete: finish })
      .to(
        panelRef.current,
        isMobile
          ? { y: "100%", duration: 0.32, ease: "power3.in" }
          : { scale: 0.96, opacity: 0, y: 12, duration: 0.28, ease: "power3.in" },
      )
      .to(overlayRef.current, { opacity: 0, duration: 0.18, ease: "power2.in" }, "-=0.2");
  };

  const requestClose = useCallback(() => requestCloseRef.current(), []);

  // ── ESC key ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;
    const handler = (e) => { if (e.key === "Escape") requestCloseRef.current(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [mounted]);

  // ── tab switch animation ───────────────────────────────────────────────────
  const switchTab = (idx) => {
    if (idx === activeTab) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && optionsRef.current) {
      gsap.fromTo(
        optionsRef.current,
        { opacity: 0, x: 8 },
        { opacity: 1, x: 0, duration: 0.22, ease: "power2.out" },
      );
    }
    setActiveTab(idx);
  };

  // ── checkbox toggle ────────────────────────────────────────────────────────
  const toggleOption = (groupKey, value) => {
    setPending((prev) => {
      const cur  = prev[groupKey] || [];
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      return { ...prev, [groupKey]: next };
    });
  };

  // ── clear ──────────────────────────────────────────────────────────────────
  const clearAll = () => setPending(emptyFilters);

  // ── apply — only calls requestClose once; parent's onApply is separate ────
  // Parent should NOT also call setFilterOpen(false) inside onApply — onClose
  // handles that after the exit animation completes.
  const handleApply = () => {
    onApply(pending);       // update parent filter state
    requestCloseRef.current(); // run exit animation then call onClose
  };

  const activeCount  = Object.values(pending).reduce((sum, arr) => sum + arr.length, 0);
  const currentGroup = FILTER_GROUPS[activeTab];

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/40"
        onClick={requestClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className="relative w-full sm:w-[660px] max-h-[88vh] sm:max-h-[560px]
          bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 shrink-0">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Filter</h2>
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close filters"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Body: two columns ── */}
        <div className="flex flex-1 min-h-0">
          {/* Left: tab list */}
          <div className="w-[160px] sm:w-[180px] shrink-0 border-r border-slate-200 overflow-y-auto bg-slate-50">
            {FILTER_GROUPS.map((group, idx) => {
              const groupCount = (pending[group.key] || []).length;
              const isActive   = idx === activeTab;
              return (
                <button
                  key={group.key}
                  type="button"
                  onClick={() => switchTab(idx)}
                  className={`w-full text-left px-4 py-3.5 text-sm font-medium transition-colors relative cursor-pointer
                    ${isActive
                      ? "text-[#1A6FC4] bg-white border-l-3 border-l-[#1A6FC4] -mr-px font-semibold"
                      : "text-slate-600 hover:bg-white hover:text-slate-900"
                    }`}
                >
                  <span className="flex items-center justify-between gap-1">
                    <span className="leading-snug">{group.label}</span>
                    {groupCount > 0 && (
                      <span className="shrink-0 text-[10px] font-bold bg-[#1A6FC4] text-white rounded-full w-4 h-4 flex items-center justify-center">
                        {groupCount}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: options pane */}
          <div ref={optionsRef} className="flex-1 overflow-y-auto">
            {currentGroup.options.map((opt, i) => {
              const checked = (pending[currentGroup.key] || []).includes(opt.value);
              const isLast  = i === currentGroup.options.length - 1;
              return (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 px-5 py-4 cursor-pointer select-none
                    hover:bg-slate-50 transition-colors
                    ${!isLast ? "border-b border-slate-100" : ""}`}
                >
                  <span
                    className={`relative w-[18px] h-[18px] rounded border-2 shrink-0 transition-all duration-150 flex items-center justify-center
                      ${checked ? "bg-[#1A6FC4] border-[#1A6FC4]" : "border-slate-300 hover:border-slate-400"}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleOption(currentGroup.key, opt.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    {checked && (
                      <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white" fill="none">
                        <path
                          d="M2 6.2 4.8 9 10 3"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>

                  <span className="flex flex-col">
                    <span className={`text-sm font-semibold leading-tight ${checked ? "text-[#1A6FC4]" : "text-slate-800"}`}>
                      {opt.label}
                    </span>
                    {opt.sub && (
                      <span className="text-xs text-slate-400 mt-0.5">{opt.sub}</span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-200 shrink-0">
          <button
            type="button"
            onClick={clearAll}
            className="px-5 py-2.5 rounded-full border border-slate-300 text-sm font-semibold text-slate-700
              hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Clear filters
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={activeCount === 0}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all
              ${activeCount > 0
                ? "bg-[#1A6FC4] text-white hover:bg-[#155AA0] active:scale-95 cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
          >
            Apply{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}