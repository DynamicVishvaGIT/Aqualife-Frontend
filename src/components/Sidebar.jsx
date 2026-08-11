import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import {
  Package,
  PackageCheck,
  ShoppingBag,
  Receipt,
  ClipboardList
} from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import { useLogout } from "../features/hooks/authHooks";

const BRAND = "#0061C2";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Sidebar = ({ activeTab, setActiveTab }) => {
  const sidebarRef = useRef(null);
  const itemsRef = useRef([]);
  const indicatorRef = useRef(null);
  const navButtonRefs = useRef({});

  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutate: logout, isPending: loggingOut } = useLogout();

const handleLogout = () => {
  logout(undefined, {
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
};

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sidebarRef.current,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.55, ease: "power3.out" }
      );

      gsap.fromTo(
        itemsRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.15,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Sliding indicator bar tracking the active sub-nav item
  useLayoutEffect(() => {
    const activeEl = navButtonRefs.current[activeTab];
    const indicator = indicatorRef.current;
    if (!activeEl || !indicator) return;

    if (prefersReducedMotion()) {
      indicator.style.top = `${activeEl.offsetTop}px`;
      indicator.style.height = `${activeEl.offsetHeight}px`;
      indicator.style.opacity = 1;
      return;
    }

    gsap.to(indicator, {
      top: activeEl.offsetTop,
      height: activeEl.offsetHeight,
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
    });
  }, [activeTab]);

  const addItem = (el) => {
    if (el && !itemsRef.current.includes(el)) {
      itemsRef.current.push(el);
    }
  };

  const setNavRef = (key) => (el) => {
    navButtonRefs.current[key] = el;
  };

  const handleHover = (e, enter) => {
    if (prefersReducedMotion()) return;
    gsap.to(e.currentTarget, {
      x: enter ? 4 : 0,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const navItems = [
    { key: "profile", label: "Profile Information" },
    { key: "address", label: "Manage Addresses" },
    { key: "track", label: "Track Status" },
  ];

  return (
    <aside ref={sidebarRef} style={{ opacity: 0 }}>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-shadow duration-300 hover:shadow-md">
        {/* User greeting */}
        <div
          ref={addItem}
          className="flex items-center gap-3 px-5 py-5 border-b border-gray-100"
        >
          <div
            className="w-10 h-10 rounded-full border-2 flex items-center justify-center bg-gray-50 flex-shrink-0"
            style={{ borderColor: `${BRAND}33` }}
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-400 leading-none mb-0.5">Hello,</p>
            <p className="text-sm font-semibold text-gray-800">{user?.name || "Aqua User"}</p>
          </div>
        </div>

        {/* My Orders — links out to the full orders list, not one of the three tabs */}
        <div
          ref={addItem}
          className="flex items-center justify-between px-5 py-4 border-b border-gray-100 cursor-pointer group transition-colors hover:bg-gray-50"
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
          onClick={() => navigate("/orders")}

        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: BRAND }}
            >
        <Package className="w-5 h-5 text-white" />
            </div>
            <span
              className="text-sm font-semibold text-gray-800 transition-colors"
              onMouseEnter={(e) => (e.currentTarget.style.color = BRAND)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "")}
            >
              My Orders
            </span>
          </div>
          <svg
            className="w-4 h-4 text-gray-400 transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.color = BRAND)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Account Setting */}
        <div ref={addItem} className="px-5 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-800">Account Setting</span>
          </div>

          <div className="pl-11 flex flex-col gap-1.5 relative">
            <span
              ref={indicatorRef}
              className="absolute left-0 rounded-full"
              style={{ top: 0, height: 0, width: "3px", backgroundColor: BRAND, opacity: 0 }}
            />
            {navItems.map((item) => (
              <button
                key={item.key}
                ref={setNavRef(item.key)}
                onClick={() => setActiveTab(item.key)}
                className={`text-sm cursor-pointer text-left transition-colors rounded-md px-2 py-1.5 -mx-2 ${
                  activeTab === item.key ? "font-medium" : "text-gray-500 hover:text-gray-700"
                }`}
                style={
                  activeTab === item.key
                    ? { color: BRAND, backgroundColor: `${BRAND}0D` }
                    : undefined
                }
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Log Out */}
        <button
          type="button"
          ref={addItem}
          disabled={loggingOut}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-5 py-4 border-t border-gray-100 cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed"
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-800 group-hover:text-red-500 transition-colors">
            {loggingOut ? "Logging out..." : "Log Out"}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;