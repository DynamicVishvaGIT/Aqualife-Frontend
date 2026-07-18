// components/SortModal.jsx
import { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Check } from "lucide-react";
import gsap from "gsap";

export const SORT_OPTIONS = [
  { key: "popularity",     label: "Popularity" },
  { key: "price-low-high", label: "Price: Low to High" },
  { key: "price-high-low", label: "Price: High to Low" },
  { key: "newest",         label: "Newest First" },
  { key: "discount",       label: "Discount: High to Low" },
];

const BRAND    = "#1A6FC4";
// [fix5] removed unused BRAND_DK = "#155AA0"
const BRAND_BG = "#EBF4FF";

export default function SortModal({ isOpen, value, onSelect, onClose, anchorRef }) {
  const [mounted,  setMounted]  = useState(false);
  const [closing,  setClosing]  = useState(false);
  const [rect,     setRect]     = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const overlayRef   = useRef(null);
  const panelRef     = useRef(null);
  const itemRefs     = useRef([]);
  const isMobileRef  = useRef(false);
  const isClosingRef = useRef(false);

  useEffect(() => { isMobileRef.current = isMobile; }, [isMobile]);

  // ── Mount ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      isClosingRef.current = false;
      // [fix6] reset stale item refs from previous open before collecting new ones
      itemRefs.current = [];
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      isMobileRef.current = mobile;
      setRect(
        !mobile && anchorRef?.current
          ? anchorRef.current.getBoundingClientRect()
          : null,
      );
      setClosing(false);
      setMounted(true);
    }
  }, [isOpen, anchorRef]);

  // scroll-lock — mobile only
  useEffect(() => {
    if (mounted && isMobile) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [mounted, isMobile]);

  // ── requestClose ──────────────────────────────────────────────────────────
  // setMounted(false) lives only in onComplete so the element stays in the DOM
  // for the full exit animation before React unmounts it.
  const requestCloseRef = useRef(null);
  requestCloseRef.current = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile  = isMobileRef.current;

    const finish = () => {
      isClosingRef.current = false;
      setClosing(false);
      setMounted(false);
      onClose();
    };

    if (reduced || !panelRef.current) { finish(); return; }

    setClosing(true);

    const tl = gsap.timeline({ onComplete: finish });

    if (mobile) {
      tl.to(panelRef.current, { y: "100%", duration: 0.28, ease: "power3.in" });
      if (overlayRef.current)
        tl.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" }, "-=0.15");
    } else {
      tl.to(panelRef.current, {
        opacity: 0,
        scale:   0.96,
        y:       -6,
        duration: 0.2,
        ease:    "power2.in",
      });
    }
  };

  const requestClose = useCallback(() => requestCloseRef.current(), []);

  // ── Close on scroll (desktop) ─────────────────────────────────────────────
  useEffect(() => {
    if (!mounted || isMobile) return;
    const h = () => requestCloseRef.current();
    window.addEventListener("scroll", h, { capture: true, passive: true });
    return () => window.removeEventListener("scroll", h, { capture: true });
  }, [mounted, isMobile]);

  // ── Open animation ────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    if (!mounted || closing) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items   = itemRefs.current.filter(Boolean);
    const panel   = panelRef.current;
    const overlay = overlayRef.current;

    if (reduced) {
      gsap.set([panel, overlay, ...items].filter(Boolean), { opacity: 1, y: 0, scale: 1 });
      return;
    }

    if (isMobile) {
      if (overlay) gsap.set(overlay, { opacity: 0 });
      gsap.set(panel, { y: "100%" });
      gsap.set(items, { opacity: 0, x: -6 });

      gsap.timeline()
        .to(overlay, { opacity: 1, duration: 0.22, ease: "power2.out" })
        .to(panel,   { y: "0%",   duration: 0.36, ease: "power4.out" }, "-=0.1")
        .to(items,   { opacity: 1, x: 0, duration: 0.2,
                       stagger: 0.04, ease: "power2.out" }, "-=0.18");
    } else {
      gsap.set(panel, { opacity: 0, scale: 0.96, y: -6 });
      gsap.set(items, { opacity: 0, y: -4 });

      gsap.timeline()
        .to(panel, { opacity: 1, scale: 1, y: 0, duration: 0.24, ease: "power3.out" })
        .to(items, { opacity: 1, y: 0, duration: 0.18,
                     stagger: 0.03, ease: "power2.out" }, "-=0.1");
    }
  }, [mounted, closing, isMobile]);

  // ── Escape ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;
    const h = (e) => { if (e.key === "Escape") requestCloseRef.current(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [mounted]);

  // ── Click-outside (desktop) ───────────────────────────────────────────────
  useEffect(() => {
    if (!mounted || isMobile) return;
    const h = (e) => {
      if (
        panelRef.current  && !panelRef.current.contains(e.target) &&
        (!anchorRef?.current || !anchorRef.current.contains(e.target))
      ) requestCloseRef.current();
    };
    const id = setTimeout(() => document.addEventListener("mousedown", h), 80);
    return () => { clearTimeout(id); document.removeEventListener("mousedown", h); };
  }, [mounted, isMobile, anchorRef]);

  const handlePick = (key) => {
    onSelect(key);
    requestCloseRef.current();
  };

  if (!mounted) return null;

  // ── Mobile — bottom sheet ─────────────────────────────────────────────────
  if (isMobile) {
    return createPortal(
      <>
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[100] bg-slate-900/40"
          onClick={requestClose}
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Sort by"
          className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-2xl shadow-2xl overflow-hidden"
        >
          <SheetContent itemRefs={itemRefs} value={value} onPick={handlePick} />
        </div>
      </>,
      document.body,
    );
  }

  // ── Desktop — anchored dropdown ───────────────────────────────────────────
  const top      = rect ? rect.bottom + 6 : "50%";
  const left     = rect ? rect.left       : "50%";
  const minWidth = rect ? Math.max(rect.width, 200) : 200;

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Sort by"
      style={{ position: "fixed", top, left, minWidth, zIndex: 1000 }}
      className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden"
    >
      <SheetContent itemRefs={itemRefs} value={value} onPick={handlePick} />
    </div>,
    document.body,
  );
}

// ── Shared inner content ──────────────────────────────────────────────────────
function SheetContent({ itemRefs, value, onPick }) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100">
        <span
          className="w-[3px] h-4 rounded-full shrink-0"
          style={{ background: BRAND }}
        />
        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 select-none">
          Sort By
        </span>
      </div>

      {/* Options */}
      <div className="py-1.5">
        {SORT_OPTIONS.map((opt, i) => {
          const active = value === opt.key;
          return (
            <button
              key={opt.key}
              ref={(el) => (itemRefs.current[i] = el)}
              type="button"
              onClick={() => onPick(opt.key)}
              className={`w-full flex items-center justify-between px-5 py-3 text-sm font-medium
                text-left cursor-pointer transition-colors duration-100 select-none
                ${active
                  ? "text-[#1A6FC4] bg-[#EBF4FF]"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              <span>{opt.label}</span>
              {active && (
                <Check size={15} strokeWidth={2.5} className="text-[#1A6FC4] shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}