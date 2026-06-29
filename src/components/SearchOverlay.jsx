import { useEffect, useRef, useState } from "react";
import { Search, X, Droplets, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  /* ── GSAP open / close ── */
  useEffect(() => {
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;

    if (isOpen) {
      gsap.set(backdrop, { display: "flex" });
      gsap.set(panel, { y: -60, opacity: 0, scale: 0.96 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(backdrop, { opacity: 1, duration: 0.2 })
        .to(panel, { y: 0, opacity: 1, scale: 1, duration: 0.45 }, "-=0.1");

      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      gsap
        .timeline({ defaults: { ease: "power3.in" } })
        .to(panel, { y: -30, opacity: 0, scale: 0.97, duration: 0.3 })
        .to(backdrop, { opacity: 0, duration: 0.2 }, "-=0.15")
        .set(backdrop, { display: "none" });
      setQuery("");
    }
  }, [isOpen]);

  /* Escape key */
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  /* body lock */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[60] bg-slate-900/75 backdrop-blur-sm
        items-start justify-center px-4 pt-20 sm:pt-28"
      style={{ opacity: 0, display: "none" }}
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* ── Input bar ── */}
        <div
          className={`flex items-center gap-3 px-5 py-4 transition-all duration-200 ${
            focused ? "border-b-2 border-blue-500" : "border-b border-slate-100"
          }`}
        >
          <Search
            size={20}
            className={`shrink-0 transition-colors duration-200 ${
              focused ? "text-blue-500" : "text-slate-400"
            }`}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => e.key === "Enter" && query && onClose()}
            placeholder="Search water purifiers, RO plants…"
            className="flex-1 text-[15px] text-slate-800 placeholder:text-slate-400
              outline-none bg-transparent"
          />
          {!query && (
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* ── Body ── */}
        <div className="px-5 py-6">
          {/* Has query — show results or no-match */}
          {query && (
            <div className="py-4 text-center">
              <Droplets size={28} className="text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">
                Press{" "}
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono">
                  ↵
                </kbd>{" "}
                to search for{" "}
                <span className="font-medium text-slate-700">"{query}"</span>
              </p>
            </div>
          )}

          {/* No query — neutral empty state */}
          {!query && (
            <div className="py-8 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Search size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-[14px] font-medium text-slate-600">
                  What are you looking for?
                </p>
                <p className="text-[12px] text-slate-400 mt-1">
                  Search products, categories, and more
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          className="px-5 py-3 border-t border-slate-100 flex items-center
          justify-between bg-slate-50/60"
        >
          <p className="text-[11px] text-slate-400">
            Press{" "}
            <kbd
              className="px-1.5 py-0.5 bg-white border border-slate-200
              rounded text-[10px] font-mono mx-0.5"
            >
              ↵
            </kbd>
            to search
          </p>
          <button
            onClick={onClose}
            className="text-[11px] text-slate-400 hover:text-slate-600
              flex items-center gap-1 transition-colors"
          >
            <kbd
              className="px-1.5 py-0.5 bg-white border border-slate-200
              rounded text-[10px] font-mono"
            >
              Esc
            </kbd>
            to close
          </button>
        </div>
      </div>
    </div>
  );
}
