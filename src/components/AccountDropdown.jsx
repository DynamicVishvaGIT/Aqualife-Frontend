import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { User, LogIn, UserCircle2 } from "lucide-react";

/**
 * AccountDropdown
 *
 * Drop-in replacement for the plain Account icon button.
 * - Desktop (hover-capable pointers): a solid-blue "flip card" tooltip
 *   previews immediately on hover (rotates open around its top edge).
 *   If the cursor lingers past `openDelay`, the full menu panel opens —
 *   same hover-intent pattern already used for the close delay, just
 *   mirrored for opening.
 * - The tooltip only EXISTS in the DOM while `tooltipOpen` is true — it's
 *   mounted on hover-enter and unmounted only after its own fade-out tween
 *   finishes (same mount/unmount pattern the menu panel already uses via
 *   `closingRef` + `onComplete`). It is NOT rendered up-front and hidden
 *   with opacity: 0, because that approach is fragile — anything that
 *   overrides that inline style makes it visible before any hover.
 * - The tooltip is rendered through a React portal straight into
 *   document.body, positioned with fixed coordinates computed from the
 *   trigger's bounding box. This is what makes it escape ANY parent
 *   `overflow-hidden`/`overflow-x-clip` clipping.
 * - Touch devices: opens/closes on tap only (hover/tooltip skipped entirely).
 * - On every breakpoint the panel is a small menu anchored directly under
 *   the trigger icon (right-aligned) — same "dropdown" shape on mobile as
 *   on desktop, just clamped so it never overflows the viewport edge.
 * - GSAP handles all open/close/tooltip choreography (respects
 *   prefers-reduced-motion)
 *
 * Menu only has two items by design:
 *  - Login   → /login
 *  - Profile → /profile
 *
 * Props:
 *  - isWhiteText: bool — pass the same flag your header uses to flip
 *                 icon color over hero/dark backgrounds vs a white header
 *  - isLoggedIn:  bool — flips the tooltip label between "Login" and
 *                 "My Account"
 */
export default function AccountDropdown({ isWhiteText = false, isLoggedIn = false }) {
  const [open, setOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, right: 0 });
  const navigate = useNavigate();

  const wrapperRef = useRef(null);
  const panelRef = useRef(null);
  const tooltipRef = useRef(null);
  const arrowRef = useRef(null);
  const itemsRef = useRef([]);
  const closingRef = useRef(false);
  const tooltipClosingRef = useRef(false);
  const closeTimeoutRef = useRef(null);
  const openTimeoutRef = useRef(null);

  itemsRef.current = [];
  const addItemRef = (el) => {
    if (el && !itemsRef.current.includes(el)) itemsRef.current.push(el);
  };

  const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const supportsHover = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Recompute the tooltip's fixed screen position from the trigger's
     current bounding box — called right before it's shown, and kept in
     sync on scroll/resize while it's open. */
  const updateTooltipPos = () => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setTooltipPos({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
  };

  useEffect(() => {
    if (!tooltipOpen) return;
    const handler = () => updateTooltipPos();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [tooltipOpen]);

  /* ── Open animation (panel) ── */
  useEffect(() => {
    if (!open || !panelRef.current) return;

    if (prefersReducedMotion()) {
      gsap.set(panelRef.current, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    gsap.set(panelRef.current, { transformOrigin: "top right" });

    const tl = gsap.timeline();

    tl.fromTo(
      panelRef.current,
      { opacity: 0, y: -8, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.7)" },
      0
    ).fromTo(
      itemsRef.current,
      { opacity: 0, x: -8 },
      {
        opacity: 1,
        x: 0,
        duration: 0.25,
        stagger: 0.05,
        ease: "power2.out",
      },
      "-=0.12"
    );

    return () => tl.kill();
  }, [open]);

  /* ── Tooltip flip-in animation ──
     Runs the moment the tooltip mounts. Solid blue "flip card" — rotates
     open around its top edge like a card lid. */
  useEffect(() => {
    if (!tooltipOpen || !tooltipRef.current) return;

    const targets = [tooltipRef.current, arrowRef.current].filter(Boolean);

    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: 1 });
      return;
    }

    gsap.set(tooltipRef.current, {
      transformPerspective: 400,
      transformOrigin: "top center",
    });

    gsap.fromTo(
      targets,
      { opacity: 0, rotateX: -90, scale: 0.92 },
      {
        opacity: 1,
        rotateX: 0,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
      }
    );
  }, [tooltipOpen]);

  /* ── Tooltip close: fade out, THEN unmount ── */
  const closeTooltip = () => {
    if (!tooltipOpen || tooltipClosingRef.current) return;

    if (prefersReducedMotion() || !tooltipRef.current) {
      setTooltipOpen(false);
      return;
    }

    tooltipClosingRef.current = true;

    gsap.to([tooltipRef.current, arrowRef.current].filter(Boolean), {
      opacity: 0,
      duration: 0.15,
      ease: "power2.in",
      onComplete: () => {
        tooltipClosingRef.current = false;
        setTooltipOpen(false);
      },
    });
  };

  const openTooltip = () => {
    updateTooltipPos();
    setTooltipOpen(true);
  };

  /* Hide the tooltip the moment the full panel opens */
  useEffect(() => {
    if (open) closeTooltip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* ── Close animation, then actually unmount ── */
  const closeMenu = () => {
    if (!open || closingRef.current) return;

    if (prefersReducedMotion() || !panelRef.current) {
      setOpen(false);
      return;
    }

    closingRef.current = true;

    gsap.to(panelRef.current, {
      opacity: 0,
      y: -6,
      scale: 0.97,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        closingRef.current = false;
        setOpen(false);
      },
    });
  };

  const openMenu = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (!open) setOpen(true);
  };

  const scheduleClose = (delay = 220) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      closeTimeoutRef.current = null;
      closeMenu();
    }, delay);
  };

  const toggleMenu = () => (open ? closeMenu() : openMenu());

  /* ── Hover-intent handlers (desktop only — no-ops on touch) ──
     Tooltip mounts instantly; the full panel only opens if the cursor
     lingers past `openDelay`. */
  const openDelay = 300;

  const handleMouseEnter = () => {
    if (!supportsHover()) return;

    openTooltip();

    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    openTimeoutRef.current = setTimeout(() => {
      openTimeoutRef.current = null;
      openMenu();
    }, openDelay);
  };

  const handleMouseLeave = () => {
    if (!supportsHover()) return;

    closeTooltip();

    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    scheduleClose();
  };

  /* ── Outside click + Escape (covers touch/keyboard) ── */
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        closeMenu();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeMenu();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* ── Cleanup any pending timeouts on unmount ── */
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    };
  }, []);

  const go = (path) => {
    closeMenu();
    navigate(path);
  };

  const menuItems = [
    {
      icon: LogIn,
      label: "Login",
      onClick: () => go("/login"),
    },
    {
      icon: UserCircle2,
      label: "Profile",
      onClick: () => go("/profile"),
    },
    // {
    //   icon: LogOut,
    //   label: "Logout",
    // },
  ];

  const tooltipLabel = isLoggedIn ? "My Account" : "Login";

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <button
        onClick={toggleMenu}
        aria-label="Account"
        aria-haspopup="menu"
        aria-expanded={open}
        className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer active:scale-95
          [&>svg]:transition-transform [&>svg]:duration-200 hover:[&>svg]:scale-110
          ${
            isWhiteText
              ? "hover:text-white hover:bg-white/10"
              : "hover:text-[#0061C2] hover:bg-blue-50"
          }`}
      >
        <User size={20} />
      </button>

   

      {open && (
        <>
          {/* Invisible bridge so the cursor can travel from the icon down to
              the panel without the gap being read as "left the dropdown"
              (desktop hover only — irrelevant on touch) */}
          <div className="hidden sm:block absolute right-0 top-full w-full h-2" />

          {/* Panel: a compact menu anchored under the trigger, right-aligned,
              on every breakpoint — clamped so it can't run off a narrow
              viewport. No full-screen sheet, no backdrop. */}
          <div
            ref={panelRef}
            role="menu"
            className="
              absolute right-0 top-full mt-2 z-50
              w-52 max-w-[calc(100vw-2rem)]
              bg-white rounded-2xl shadow-xl border border-slate-100
              overflow-hidden
            "
          >
            <div className="py-2">
              {menuItems.map(({ icon: Icon, label, onClick }) => (
                <button
                  key={label}
                  ref={addItemRef}
                  role="menuitem"
                  onClick={onClick}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#191919]
                    cursor-pointer transition-colors duration-150
                    hover:bg-blue-50 hover:text-[#0061C2] active:scale-[0.98]"
                >
                  <Icon size={17} className="text-[#0061C2] shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}