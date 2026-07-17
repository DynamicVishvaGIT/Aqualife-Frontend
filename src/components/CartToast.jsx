/**
 * CartToast — animated "added to cart" pop-over
 *
 * Usage
 * -----
 * 1. Copy this file to src/components/CartToast.jsx
 * 2. In ProductDetail.jsx, import and render <CartToast /> + wire up the trigger (see diff below)
 *
 * Props
 * -----
 * toast   : { image, name, price, qty } | null   – set to null to hide
 * onClose : () => void
 */

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ShoppingCart, Check, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function CartToast({ toast, onClose }) {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const imgRef = useRef(null);
  const autoCloseTimer = useRef(null);

  /* ── Enter / exit animation ── */
  useEffect(() => {
    if (!toast || !panelRef.current) return;

    // Kill any pending auto-close from a previous toast
    clearTimeout(autoCloseTimer.current);

    const panel = panelRef.current;

    // Slide + fade in from the right
    gsap.fromTo(
      panel,
      { opacity: 0, x: 60, scale: 0.94 },
      { opacity: 1, x: 0, scale: 1, duration: 0.42, ease: "back.out(1.8)" }
    );

    // Product image "pops" in with a little bounce
    if (imgRef.current) {
      gsap.fromTo(
        imgRef.current,
        { scale: 0.5, opacity: 0, rotate: -8 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.55, ease: "back.out(2.5)", delay: 0.1 }
      );
    }

    // Auto-dismiss after 4 s
    autoCloseTimer.current = setTimeout(() => {
      dismiss();
    }, 4000);

    return () => clearTimeout(autoCloseTimer.current);
  }, [toast]);

  const dismiss = () => {
    if (!panelRef.current) return;
    gsap.to(panelRef.current, {
      opacity: 0,
      x: 60,
      scale: 0.94,
      duration: 0.28,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  const goToCart = () => {
    dismiss();
    // replace "/cart" with your actual cart route
    navigate("/cart");
  };

  if (!toast) return null;

  return createPortal(
    <div
      ref={panelRef}
      className="fixed top-20 right-4 z-[9999] w-[320px] sm:w-[360px]
                 bg-white rounded-2xl shadow-2xl border border-slate-100
                 overflow-hidden pointer-events-auto"
      style={{ willChange: "transform, opacity" }}
    >
      {/* ── Accent bar at top ── */}
      <div className="h-1 w-full bg-gradient-to-r from-[#0061C2] to-[#00B4D8]" />

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          {/* Animated check badge */}
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
            <Check size={13} strokeWidth={3} className="text-green-600" />
          </span>
          <span className="text-[13px] font-semibold text-slate-700">
            Added to Cart
          </span>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="w-6 h-6 flex items-center justify-center rounded-full
                     text-slate-400 hover:text-slate-700 hover:bg-slate-100
                     transition-colors active:scale-90"
        >
          <X size={14} />
        </button>
      </div>

      {/* ── Product row ── */}
      <div className="flex items-center gap-3 px-4 pb-3">
        {/* Thumbnail */}
        <div
          ref={imgRef}
          className="flex-shrink-0 w-[64px] h-[64px] rounded-xl border border-slate-100
                     bg-slate-50 flex items-center justify-center overflow-hidden"
        >
          <img
            src={toast.image}
            alt={toast.name}
            className="w-full h-full object-contain mix-blend-multiply p-1"
            draggable={false}
          />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-slate-900 leading-snug line-clamp-2">
            {toast.name}
          </p>
          <p className="text-[12px] text-slate-500 mt-0.5">
            ₹{toast.price}&ensp;·&ensp;Qty: {toast.qty}
          </p>
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex gap-2 px-4 pb-4">
        <button
          onClick={dismiss}
          className="flex-1 text-[12px] font-medium text-slate-600
                     border border-slate-200 rounded-xl py-2 px-3
                     hover:border-slate-400 hover:text-slate-900
                     active:scale-95 transition-all duration-150"
        >
          Continue Shopping
        </button>
        <button
          onClick={goToCart}
          className="flex-1 flex items-center justify-center gap-1.5
                     bg-[#0061C2] hover:bg-[#004EA0] text-white
                     text-[12px] font-semibold rounded-xl py-2 px-3
                     active:scale-95 transition-all duration-150"
        >
          <ShoppingCart size={13} />
          View Cart
          <ArrowRight size={12} />
        </button>
      </div>

      {/* ── Progress bar (auto-dismiss countdown) ── */}
      <ProgressBar duration={4000} key={toast?.name + toast?.qty} />
    </div>,
    document.body
  );
}

/* Thin progress bar that drains over `duration` ms */
function ProgressBar({ duration }) {
  const barRef = useRef(null);

  useEffect(() => {
    if (!barRef.current) return;
    gsap.fromTo(
      barRef.current,
      { scaleX: 1 },
      { scaleX: 0, duration: duration / 1000, ease: "none", transformOrigin: "left center" }
    );
  }, [duration]);

  return (
    <div className="h-[3px] w-full bg-slate-100">
      <div
        ref={barRef}
        className="h-full w-full bg-[#0061C2]/40 origin-left"
      />
    </div>
  );
}