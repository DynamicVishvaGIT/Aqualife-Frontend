import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { User, LogIn, UserCircle2 } from "lucide-react";
import {useAuth} from "../context/AuthProvider" 

export default function AccountDropdown({ isWhiteText = false }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();


  console.log("user",isAuthenticated)
  console.log("user",user)

  const wrapperRef = useRef(null);
  const panelRef = useRef(null);
  const itemsRef = useRef([]);
  const closingRef = useRef(false);
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

  /* ── Open animation ── */
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
      0,
    ).fromTo(
      itemsRef.current,
      { opacity: 0, x: -8 },
      { opacity: 1, x: 0, duration: 0.25, stagger: 0.05, ease: "power2.out" },
      "-=0.12",
    );

    return () => tl.kill();
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

  /* ── Hover-intent handlers (desktop only — no-ops on touch) ── */
  const openDelay = 200;

  const handleMouseEnter = () => {
    if (!supportsHover()) return;
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    openTimeoutRef.current = setTimeout(() => {
      openTimeoutRef.current = null;
      openMenu();
    }, openDelay);
  };

  const handleMouseLeave = () => {
    if (!supportsHover()) return;
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    scheduleClose();
  };

  /* ── Outside click + Escape ── */
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

  /* ── Cleanup pending timeouts on unmount ── */
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


  // While the session check is still resolving, don't commit to either
  // menu — showing "Login" here is what caused the flash for users who
  // turn out to be authenticated once getCurrentUser resolves.
  const menuItems = isLoading
    ? []
    : isAuthenticated
      ? [
          { icon: UserCircle2, label: "Profile", onClick: () => go("/profile") },
          { icon: UserCircle2, label: "Wishlist", onClick: () => go("/wishlist") },
          { icon: UserCircle2, label: "Orders", onClick: () => go("/orders") },
        ]
      : [{ icon: LogIn, label: "Login", onClick: () => go("/login") }];

  const headerLabel = isLoading
    ? "..."
    : isAuthenticated
      ? `Hello ${user?.name || "Aqua User"}`
      : "Hello Aqua User";

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger button */}
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

          {/* Panel: compact menu anchored under the trigger, right-aligned,
              clamped so it can't overflow a narrow viewport */}
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
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-blue-50/60 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-[#0061C2] flex items-center justify-center shrink-0">
                <User size={16} className="text-white" />
              </div>
              <span className="text-sm font-semibold select-none text-[#191919] truncate">
                {headerLabel}
              </span>
            </div>

            <div className="py-2">
              {isLoading ? (
                <div className="px-4 py-3 text-sm text-slate-400">Loading…</div>
              ) : (
                menuItems.map(({ icon: Icon, label, onClick }) => (
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
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}