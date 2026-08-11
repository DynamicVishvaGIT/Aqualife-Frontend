/**
 * useCartFly — fires a "fly to cart" animation
 *
 * Call flyToCart({ image, name, buttonEl, onLand }) when Add to Cart is clicked.
 * The image + name clone lifts off from the button and arcs to the visible
 * cart icon in the navbar. Real cart-count state should be updated via the
 * `onLand` callback (see CartContext) — this hook only handles the motion.
 *
 * Usage
 * -----
 *   import useCartFly from "../hooks/useCartFly";
 *   const flyToCart = useCartFly();
 *   flyToCart({
 *     image: images[mainImg],
 *     name: product.title,
 *     buttonEl: e.currentTarget,
 *     onLand: () => addToCart(qty),
 *   });
 *
 * Requires a cart icon in the DOM with id="navbar-cart-desktop" or
 * "navbar-cart-mobile" (whichever is currently visible is targeted).
 *
 * Options
 * -------
 * flyToCart({ image, name, buttonEl, speed, onLand })
 *   speed — duration multiplier, default 1. Pass 0.4-0.5 for a snappier
 *   feel, or push past 1.5 for an even slower flight.
 *
 * Interactive touches
 * --------------------
 * - Hover the flying clone mid-air to pause it, move away to resume
 * - Click the flying clone to skip straight to the cart
 * - Cart icon bumps + ripples on touchdown
 */

import { useCallback } from "react";
import gsap from "gsap";

function getVisibleCartIcon() {
  const ids = ["navbar-cart-desktop", "navbar-cart-mobile"];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el && el.offsetParent !== null) return el;
  }
  return null;
}

export default function useCartFly() {
  const flyToCart = useCallback(({ image, name, buttonEl, speed = 1, onLand }) => {
    const cartIcon = getVisibleCartIcon();

    // ── Launch origin — center of the clicked button, or screen center ──
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;
    if (buttonEl) {
      const r = buttonEl.getBoundingClientRect();
      startX = r.left + r.width / 2;
      startY = r.top + r.height / 2;
    }

    // ── Landing target — cart icon, or top-right corner as fallback ──
    let endX = window.innerWidth - 32;
    let endY = 24;
    if (cartIcon) {
      const r = cartIcon.getBoundingClientRect();
      endX = r.left + r.width / 2;
      endY = r.top + r.height / 2;
      if (getComputedStyle(cartIcon).position === "static") {
        cartIcon.style.position = "relative";
      }
    }

    // ── Build the flying clone ──────────────────────────────────────────
    // pointer-events start disabled so the clone never blocks a click on the
    // page mid-launch; re-enabled briefly after it's airborne so hover/click
    // interactivity below actually works.
    const clone = document.createElement("div");
    clone.style.cssText = `
      position: fixed;
      z-index: 99999;
      left: ${startX - 40}px;
      top: ${startY - 40}px;
      width: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      pointer-events: none;
      cursor: pointer;
    `;

    const imgWrap = document.createElement("div");
    imgWrap.style.cssText = `
      width: 60px;
      height: 60px;
      border-radius: 16px;
      background: #fff;
      border: 1.5px solid #e2e8f0;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.15s ease;
    `;
    const img = document.createElement("img");
    img.src = image;
    img.style.cssText = "width:100%;height:100%;object-fit:contain;padding:6px;mix-blend-mode:multiply;";
    imgWrap.appendChild(img);

    const pill = document.createElement("div");
    pill.textContent = "Added to Cart";
    pill.style.cssText = `
      background: #0061C2;
      color: #fff;
      font-size: 10px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 20px;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,97,194,0.35);
      font-family: inherit;
    `;

    clone.appendChild(imgWrap);
    clone.appendChild(pill);
    document.body.appendChild(clone);

    // ── Animate ──────────────────────────────────────────────────────────
    const dx = endX - startX;
    const dy = endY - startY;

    // Direction controls for the arc
    const curveX = dx * 0.35; // positive = curve right, negative = curve left
    const curveY = -220;      // more negative = higher arc

    const popDur = 0.45 * speed;

    const tl = gsap.timeline({
      onComplete: () => {
        // Cart icon bump
        if (cartIcon) {
          gsap.fromTo(
            cartIcon,
            { scale: 1 },
            { scale: 1.35, duration: 0.22, ease: "back.out(3)", yoyo: true, repeat: 1 }
          );

          // Ripple to mark the touchdown
          const ripple = document.createElement("div");
          ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            margin: -5px 0 0 -5px;
            border-radius: 50%;
            border: 2px solid #0061C2;
            pointer-events: none;
          `;
          cartIcon.appendChild(ripple);
          gsap.fromTo(
            ripple,
            { scale: 0.6, opacity: 0.8 },
            {
              scale: 6,
              opacity: 0,
              duration: 0.6,
              ease: "power2.out",
              onComplete: () => ripple.remove(),
            }
          );
        }

        // Let the caller update real cart state now that the item "landed"
        onLand?.();

        clone.remove();
      },
    });

    // Let hover/click reach the clone once it's airborne
    gsap.delayedCall(0.25, () => {
      if (document.body.contains(clone)) {
        clone.style.pointerEvents = "auto";
      }
    });
 
    // Pop up from button
    tl.fromTo(clone, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: popDur, ease: "back.out(2.5)" });

    tl.to(clone, {
      x: curveX,
      y: curveY,
      scale: 0.95,
      duration: 0.40,
      ease: "power2.out",
    })
      .to(clone, {
        x: dx ,
        y: dy ,
        ease: "power1.inOut",
      })
    

    // ── Interactivity on the flying clone ────────────────────────────────
    const pause = () => {
      tl.pause();
      imgWrap.style.transform = "scale(1.08)";
    };
    const resume = () => {
      tl.play();
      imgWrap.style.transform = "scale(1)";
    };

    clone.addEventListener("mouseenter", pause);
    clone.addEventListener("mouseleave", resume);
    clone.addEventListener("click", () => tl.progress(1));
  }, []);

  return flyToCart;
}