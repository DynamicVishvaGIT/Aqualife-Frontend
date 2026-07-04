// components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import {
  Mail,
  Phone,
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import whiteLogo from "../assets/White_Logo.png";
import blueLogo from "../assets/Blue_Logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import SearchOverlay from "./SearchOverlay";

const NAV_LINKS = [
  { label: "Water Purifiers", to: "/water-purifiers" },
  { label: "Water Cooler", to: "/water-cooler" },
  { label: "Water Softeners", to: "/water-softeners" },
  { label: "RO Plant", to: "/ro-plant" },
  { label: "About Us", to: "/about-us" },
];

export default function Navbar({ cartCount = 0 }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  /* ── refs ── */
  const utilBarRef = useRef(null);
  const utilItemsRef = useRef([]);
  const overlayRef = useRef(null);
  const drawerRef = useRef(null);
  const drawerLinksRef = useRef([]);
  const drawerFooterRef = useRef(null);

  /* ── scroll detection ── */
  useEffect(() => {
    const heroEl = document.getElementById("home-banner");
    if (!heroEl) {
      const onScroll = () => setScrolled(window.scrollY > 40);
      onScroll();
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" },
    );
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  /* ── utility bar GSAP ── */
  useEffect(() => {
    const bar = utilBarRef.current;
    const items = utilItemsRef.current.filter(Boolean);
    if (!bar) return;

    if (scrolled) {
      gsap
        .timeline()
        .to(items, {
          y: -8,
          opacity: 0,
          duration: 0.25,
          stagger: 0.05,
          ease: "power2.in",
        })
        .to(
          bar,
          {
            maxHeight: 0,
            paddingTop: 0,
            paddingBottom: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power3.inOut",
          },
          "-=0.05",
        );
    } else {
      gsap
        .timeline()
        .to(bar, {
          maxHeight: 80,
          opacity: 1,
          duration: 0.35,
          ease: "power3.out",
        })
        .fromTo(
          items,
          { y: -10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.3,
            stagger: 0.06,
            ease: "power2.out",
          },
          "-=0.1",
        );
    }
  }, [scrolled]);

  /* ── body lock (drawer only; SearchOverlay handles its own) ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* ── drawer GSAP ── */
  useEffect(() => {
    const overlay = overlayRef.current;
    const drawer = drawerRef.current;
    const links = drawerLinksRef.current.filter(Boolean);
    const footer = drawerFooterRef.current;
    if (!overlay || !drawer) return;

    if (mobileOpen) {
      gsap.set(drawer, { x: "100%" });
      gsap.set(links, { x: 30, opacity: 0 });
      gsap.set(footer, { y: 16, opacity: 0 });

      gsap
        .timeline()
        .to(overlay, { opacity: 1, duration: 0.3, ease: "power2.out" })
        .to(drawer, { x: "0%", duration: 0.55, ease: "power4.out" }, "-=0.2")
        .to(
          links,
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.06,
            ease: "power3.out",
          },
          "-=0.25",
        )
        .to(
          footer,
          { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
          "-=0.2",
        );
    } else {
      gsap
        .timeline()
        .to([...links].reverse(), {
          x: 20,
          opacity: 0,
          duration: 0.2,
          stagger: 0.04,
          ease: "power2.in",
        })
        .to(
          footer,
          { y: 12, opacity: 0, duration: 0.18, ease: "power2.in" },
          "<",
        )
        .to(drawer, { x: "100%", duration: 0.4, ease: "power4.in" }, "-=0.05")
        .to(
          overlay,
          { opacity: 0, duration: 0.25, ease: "power2.in" },
          "-=0.3",
        );
    }
  }, [mobileOpen]);

  const openDrawer = () => setMobileOpen(true);
  const closeDrawer = () => setMobileOpen(false);

  const HERO_PAGES = ["/", "/about-us"];
  const hasHeroBanner = HERO_PAGES.includes(location.pathname);

  // white text only on hero pages, and only while still over the hero (not scrolled)
  const isWhiteText = hasHeroBanner && !scrolled;
  // solid white header background once scrolled, OR always on non-hero pages
  const showSolidHeader = scrolled || !hasHeroBanner;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
          showSolidHeader ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        {/* ── Utility bar ── */}
        <div
          ref={utilBarRef}
          className="hidden lg:block overflow-hidden"
          style={{ maxHeight: 80, opacity: 1 }}
        >
          <div className="primary-container">
            <div
              className={`flex items-center justify-end gap-6 text-xs py-2 ${
                isWhiteText ? "text-white" : "text-slate-600"
              }`}
            >
              <Link
                ref={(el) => (utilItemsRef.current[0] = el)}
                to="mailto:info@aqualifeever.com"
                className={`flex items-center gap-1.5 transition-colors duration-200 ${
                  isWhiteText ? "hover:text-blue-200" : "hover:text-[#0061C2]"
                }`}
              >
                <Mail size={13} />
                info@aqualifeever.com
              </Link>
              <Link
                ref={(el) => (utilItemsRef.current[1] = el)}
                to="tel:18005701000"
                className={`flex items-center gap-1.5 transition-colors duration-200 ${
                  isWhiteText ? "hover:text-blue-200" : "hover:text-[#0061C2]"
                }`}
              >
                <Phone size={13} />
                Customer Support: 1800-570-1000
              </Link>
              <Link
                ref={(el) => (utilItemsRef.current[2] = el)}
                to="/contact-us"
                className={`transition-colors duration-200 ${
                  isWhiteText ? "hover:text-blue-200" : "hover:text-[#0061C2]"
                }`}   
              >
                Contact Us
              </Link>
            </div>
          </div>
          <hr
            className={isWhiteText ? "border-white/30" : "border-slate-200"}
          />
        </div>

        {/* ── Main nav row ── */}
        <nav className="primary-container">
          <div className="flex items-center justify-between">
            {/* Logo — crossfade */}
            <Link to="/" className="block w-28 h-20 shrink-0 relative">
              <img
                src={whiteLogo}
                alt="AquaLife"
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
                  isWhiteText ? "opacity-100" : "opacity-0"
                }`}
              />
              <img
                src={blueLogo}
                alt="AquaLife"
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
                  isWhiteText ? "opacity-0" : "opacity-100"
                }`}
              />
            </Link>

            {/* ── Desktop nav links ── */}
            <ul className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className={`relative py-1 group text-[14px] inline-block transition-colors duration-200 ${
                        isWhiteText
                          ? isActive
                            ? "text-white"
                            : "text-white/75 hover:text-white"
                          : isActive
                            ? "text-[#0061C2]"
                            : "text-slate-700 hover:text-[#0061C2]"
                      }`}
                    >
                      {link.label}
                      {/* center-out underline */}
                      <span
                        className={`absolute -bottom-0.5 h-[2px] rounded-full
                          transition-all duration-300 ease-out
                          ${isWhiteText ? "bg-white" : "bg-[#0061C2]"}
                          ${
                            isActive
                              ? "left-0 right-0"
                              : "left-1/2 right-1/2 group-hover:left-0 group-hover:right-0"
                          }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* ── Desktop right icons ── */}
            <div
              className={`hidden lg:flex items-center gap-5 transition-colors duration-300 ${
                isWhiteText ? "text-white" : "text-slate-700"
              }`}
            >
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`flex items-center gap-2 text-sm font-medium px-2 py-1.5 rounded-lg
                  transition-all duration-200 cursor-pointer active:scale-95
                  [&>svg]:transition-transform [&>svg]:duration-200 hover:[&>svg]:scale-110
                  ${
                    isWhiteText
                      ? "hover:text-white hover:bg-white/10"
                      : "hover:text-[#0061C2] hover:bg-blue-50"
                  }`}
              >
                <Search size={18} />
                Search
              </button>

              <div className="flex items-center">
                {/* Account */}
                <button
                  onClick={() => navigate("/signup")}

                  aria-label="Account"
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

                {/* Divider */}
                <div
                  className={`mx-2 h-6  border-l-1  ${
                    isWhiteText ? "bg-white/50" : "bg-slate-400"
                  }`}
                />

                {/* Cart */}
                <button
                  onClick={() => navigate("/cart")}
                  aria-label="Cart"
                  className={`relative p-1.5 rounded-lg transition-all duration-200 cursor-pointer active:scale-95
      [&>svg]:transition-transform [&>svg]:duration-200 hover:[&>svg]:scale-110
      ${
        isWhiteText
          ? "hover:text-white hover:bg-white/10"
          : "hover:text-[#0061C2] hover:bg-blue-50"
      }`}
                >
                  <ShoppingCart size={20} />
                  <span
                    key={cartCount}
                    className="absolute -top-2 -right-4 bg-[#0061C2] text-white text-[12px]
        leading-none w-6 h-6 rounded-full flex items-center justify-center
        font-medium animate-[badge-pop_0.4s_cubic-bezier(0.36,0.07,0.19,0.97)]"
                  >
                    {cartCount}
                  </span>
                </button>
              </div>
            </div>

            {/* ── Mobile icons ── */}
            <div
              className={`flex items-center gap-4 lg:hidden ${
                isWhiteText ? "text-white" : "text-slate-800"
              }`}
            >
              <button
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className="p-1 rounded-lg transition-all hover:bg-white/10 active:scale-90"
              >
                <Search size={20} />
              </button>
              <button
                aria-label="Cart"
                className="relative p-1 rounded-lg transition-all hover:bg-white/10 active:scale-90"
              >
                <ShoppingCart size={20} />
                <span
                  className="absolute -top-2 -right-2 bg-[#0061C2] text-white text-[10px]
                  leading-none w-4 h-4 rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </span>
              </button>
              <button
                aria-label="Open menu"
                onClick={openDrawer}
                className="p-1 rounded-lg transition-all hover:bg-white/10 active:scale-90"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </nav>

        {/* ── Mobile drawer ── */}
        <div
          className={`fixed inset-0 z-50 lg:hidden ${
            mobileOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          {/* Overlay */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            style={{ opacity: 0 }}
            onClick={closeDrawer}
          />

          {/* Drawer panel */}
          <div
            ref={drawerRef}
            className="absolute top-0 right-0 h-full w-[80%] max-w-sm bg-white shadow-2xl flex flex-col"
            style={{ transform: "translateX(100%)" }}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 border-b border-slate-100 shrink-0">
              <Link to="/" className="block w-20 h-20" onClick={closeDrawer}>
                <img
                  src={blueLogo}
                  alt="AquaLife"
                  className="w-full h-full object-contain"
                />
              </Link>
              <button
                aria-label="Close menu"
                onClick={closeDrawer}
                className="text-slate-400 hover:text-slate-800 p-1.5 rounded-lg
                  transition-all duration-200 hover:rotate-90 hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            {/* Drawer nav links */}
            <ul className="flex flex-col px-2 overflow-y-auto flex-1">
              {NAV_LINKS.map((link, i) => {
                const isActive = location.pathname === link.to;
                return (
                  <li
                    key={link.label}
                    ref={(el) => (drawerLinksRef.current[i] = el)}
                    className="border-b border-slate-100 last:border-none"
                  >
                    <Link
                      to={link.to}
                      onClick={closeDrawer}
                      className={`flex items-center justify-between px-4 py-3.5 text-[15px]
                        font-medium transition-all duration-200 group hover:pl-6
                        ${
                          isActive
                            ? "text-[#0061C2] bg-blue-50/60"
                            : "text-slate-800 hover:text-[#0061C2] hover:bg-blue-50/40"
                        }`}
                    >
                      <span className="flex items-center gap-2.5">
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0061C2] shrink-0" />
                        )}
                        {link.label}
                      </span>
                      <ChevronRight
                        size={16}
                        className={`transition-all duration-200 group-hover:translate-x-1
                          ${isActive ? "text-blue-400" : "text-slate-300 group-hover:text-[#0061C2]"}`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Drawer footer */}
            <div
              ref={drawerFooterRef}
              className="px-5 py-5 border-t border-slate-100 space-y-3 text-sm text-slate-500 shrink-0"
            >
              <Link
                to="mailto:info@aqualifeever.com"
                className="flex items-center gap-2 hover:text-[#0061C2] transition-colors duration-200"
              >
                <Mail size={14} />
                info@aqualifeever.com
              </Link>
              <Link
                to="tel:18005701000"
                className="flex items-center gap-2 hover:text-[#0061C2] transition-colors duration-200"
              >
                <Phone size={14} />
                1800-570-1000
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Search overlay (separate component) ── */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
