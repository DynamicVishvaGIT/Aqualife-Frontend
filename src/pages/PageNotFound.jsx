import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { WaterButton } from "../components/WaterButton";

// NOTE: navigation below uses plain <a> / window.location so this file has
// zero dependency on your router. If you're on React Router, swap the
// primary button's onClick for <Link to="/"> and the "Browse Purifiers"
// <a> for <Link to="/products">, for client-side nav without a full reload.

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The droplet stands in for the middle "0" in "404" — a single, considered
// signature moment rather than a generic icon-plus-heading treatment.
function DropletMark({ className }) {
  const dropRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const tween = gsap.to(dropRef.current, {
      y: -8,
      rotate: -4,
      duration: 1.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      transformOrigin: "50% 100%",
    });
    return () => tween.kill();
  }, []);

  return (
    <svg
      ref={dropRef}
      viewBox="0 0 64 72"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="dropletFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4B9FE8" />
          <stop offset="100%" stopColor="#0061C2" />
        </linearGradient>
      </defs>
      <path
        d="M32 4 C20 20, 8 34, 8 46 C8 58, 19 68, 32 68 C45 68, 56 58, 56 46 C56 34, 44 20, 32 4 Z"
        fill="url(#dropletFill)"
      />
      <ellipse cx="23" cy="30" rx="5" ry="8" fill="#FFFFFF" opacity="0.35" />
    </svg>
  );
}

// Quiet ambient bubbles drifting behind the content. Kept low-opacity and
// slow so they read as atmosphere, not decoration competing with the copy.
function Bubbles() {
  const bubbleRefs = useRef([]);
  bubbleRefs.current = [];

  const addRef = (el) => {
    if (el && !bubbleRefs.current.includes(el)) {
      bubbleRefs.current.push(el);
    }
  };

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const tweens = bubbleRefs.current.map((el, i) =>
      gsap.to(el, {
        y: -18 - i * 4,
        duration: 2.4 + i * 0.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: i * 0.15,
      })
    );
    return () => tweens.forEach((t) => t.kill());
  }, []);

  const positions = [
    { left: "10%", top: "18%", size: 20, opacity: 0.25 },
    { left: "86%", top: "14%", size: 28, opacity: 0.18 },
    { left: "18%", top: "74%", size: 16, opacity: 0.3 },
    { left: "90%", top: "68%", size: 22, opacity: 0.2 },
    { left: "50%", top: "8%", size: 12, opacity: 0.28 },
  ];

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {positions.map((p, i) => (
        <span
          key={i}
          ref={addRef}
          className="absolute rounded-full bg-[#0061C2]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

export default function NotFound() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(contentRef.current.querySelectorAll("[data-animate]"), {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100vh] lg:pt-30 bg-[#EEF3F8] flex items-center overflow-hidden"
    >
      <Bubbles />

      <div className="primary-container relative z-10">
        <div
          ref={contentRef}
          className="max-w-xl mx-auto text-center flex flex-col items-center"
        >
          <div
            data-animate
            role="img"
            aria-label="404"
            className="flex items-center justify-center gap-1 sm:gap-2 mb-4"
          >
            <span
              aria-hidden="true"
              className="text-[5.5rem] sm:text-[7.5rem] lg:text-[9rem] heading font-bold leading-none text-[#0061C2]"
            >
              4
            </span>
            <DropletMark className="h-[4.25rem] w-auto sm:h-[5.75rem] lg:h-[6.75rem]" />
            <span
              aria-hidden="true"
              className="text-[5.5rem] sm:text-[7.5rem] lg:text-[9rem] heading font-bold leading-none text-[#0061C2]"
            >
              4
            </span>
          </div>

          <h1
            data-animate
            className="text-2xl sm:text-3xl heading font-semibold text-slate-900 mb-3"
          >
            Looks like this page ran dry.
          </h1>

          <p
            data-animate
            className="text-slate-400 text-[15px] sm:text-base mb-8 max-w-md"
          >
            This page doesn&apos;t exist, or it&apos;s been moved. Head back
            home or take a look at our purifiers instead.
          </p>

          <div
            data-animate
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <WaterButton
              variant="primary"
              onClick={() => (window.location.href = "/")}
              className="py-2.5 px-8 text-[15px]"
            >
              Back to Home
            </WaterButton>

            <a
              href="/products"
              className="text-slate-500 text-[14px] sm:text-sm border border-[#F0F3F6]
                rounded-full cursor-pointer hover:text-[#0061C2] hover:border-[#0061C2]
                font-medium transition-colors py-2.5 px-8
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-[#0061C2] focus-visible:ring-offset-2"
            >
              Browse Purifiers
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}