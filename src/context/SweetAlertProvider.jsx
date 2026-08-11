import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

/* ------------------------------------------------------------------ */
/*  Aqualife SweetAlert — reusable, theme-matched, GSAP animated      */
/*                                                                    */
/*  Usage:                                                            */
/*    1. Wrap your app once:                                          */
/*         <SweetAlertProvider><App /></SweetAlertProvider>           */
/*    2. Anywhere in the tree:                                        */
/*         const alert = useSweetAlert();                             */
/*         alert.success({ title: "Order Placed!", text: "..." });    */
/*         const ok = await alert.confirm({ title: "Remove item?" }); */
/* ------------------------------------------------------------------ */

const THEME = {
  success: { ring: "#16A34A", soft: "#ECFDF3" },
  error: { ring: "#DC2626", soft: "#FEF2F2" },
  warning: { ring: "#F59E0B", soft: "#FFFBEB" },
  info: { ring: "#14274E", soft: "#EEF2F8" },
  question: { ring: "#F97316", soft: "#FFF4EC" },
};

const DEFAULTS = {
  type: "info", // success | error | warning | info | question
  title: "",
  text: "",
  confirmText: "OK",
  cancelText: "Cancel",
  showCancel: false,
  allowOutsideClick: true,
};

function Icon({ type }) {
  const stroke = THEME[type].ring;
  const common = {
    className: "sa-draw",
    fill: "none",
    stroke,
    strokeWidth: 3.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  return (
    <svg viewBox="0 0 52 52" width="56" height="56">
      <circle
        className="sa-ring"
        cx="26"
        cy="26"
        r="23"
        fill="none"
        stroke={stroke}
        strokeWidth="3"
      />
      {type === "success" && <path {...common} d="M15 27l7 7 15-15" />}
      {type === "error" && (
        <>
          <path {...common} d="M17 17l18 18" />
          <path {...common} d="M35 17L17 35" />
        </>
      )}
      {type === "warning" && (
        <>
          <path {...common} d="M26 15v13" />
          <path {...common} d="M26 34v.5" />
        </>
      )}
      {type === "info" && (
        <>
          <path {...common} d="M26 24v10" />
          <path {...common} d="M26 16v.5" />
        </>
      )}
      {type === "question" && (
        <>
          <path {...common} d="M20 20c0-4 3-6.5 6.5-6.5S33 15.5 33 19c0 4.5-6 5-6 11" />
          <path {...common} d="M27 35v.5" />
        </>
      )}
    </svg>
  );
}

const SweetAlertContext = createContext(null);

export function SweetAlertProvider({ children }) {
  const [alert, setAlert] = useState(null);
  const backdropRef = useRef(null);
  const modalRef = useRef(null);
  const resolveRef = useRef(null);

  const fire = useCallback((opts = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setAlert({ ...DEFAULTS, ...opts });
    });
  }, []);

  const closeWith = useCallback((result) => {
    const tl = gsap.timeline({
      onComplete: () => {
        resolveRef.current?.(result);
        resolveRef.current = null;
        setAlert(null);
      },
    });
    tl.to(modalRef.current, {
      y: 14,
      scale: 0.92,
      opacity: 0,
      duration: 0.22,
      ease: "power2.in",
    }, 0).to(backdropRef.current, {
      opacity: 0,
      duration: 0.22,
      ease: "power2.in",
    }, 0);
  }, []);

  useEffect(() => {
    if (!alert) return;
    const root = modalRef.current;

    const ctx = gsap.context(() => {
      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.set(root, { opacity: 0, y: 28, scale: 0.88 });

      const tl = gsap.timeline();
      tl.to(backdropRef.current, { opacity: 1, duration: 0.2, ease: "power2.out" })
        .to(root, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" }, "-=0.05");

      const ring = root.querySelector(".sa-ring");
      if (ring) {
        const len = ring.getTotalLength();
        gsap.set(ring, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(ring, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, "-=0.45");
      }

      root.querySelectorAll(".sa-draw").forEach((el, i) => {
        const len = el.getTotalLength();
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(el, { strokeDashoffset: 0, duration: 0.35, ease: "power2.out" }, i === 0 ? "-=0.25" : "-=0.25");
      });

      const btns = root.querySelectorAll(".sa-btn");
      tl.from(btns, { y: 10, opacity: 0, duration: 0.3, stagger: 0.06, ease: "power2.out" }, "-=0.1");
    }, root);

    const onKey = (e) => {
      if (e.key === "Escape" && alert.allowOutsideClick) closeWith(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      ctx.revert();
      window.removeEventListener("keydown", onKey);
    };
  }, [alert, closeWith]);

  const value = {
    fire,
    success: (opts) => fire({ type: "success", confirmText: "Great!", ...opts }),
    error: (opts) => fire({ type: "error", confirmText: "Try Again", ...opts }),
    warning: (opts) => fire({ type: "warning", ...opts }),
    info: (opts) => fire({ type: "info", ...opts }),
    confirm: (opts) =>
      fire({ type: "question", showCancel: true, confirmText: "Yes", cancelText: "No", ...opts }),
  };

  return (
    <SweetAlertContext.Provider value={value}>
      {children}
      {alert &&
        createPortal(
          <div
            ref={backdropRef}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget && alert.allowOutsideClick) closeWith(false);
            }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-[#0B1930]/60 backdrop-blur-sm px-4"
          >
            <div
              ref={modalRef}
              className="w-full max-w-sm rounded-3xl bg-white px-7 py-8 text-center shadow-2xl"
            >
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: THEME[alert.type].soft }}
              >
                <Icon type={alert.type} />
              </div>

              {alert.title && (
                <h3 className="mb-1.5 text-lg font-semibold text-[#14274E]">{alert.title}</h3>
              )}
              {alert.text && <p className="mb-6 text-sm leading-relaxed text-gray-500">{alert.text}</p>}

              <div className="flex items-center justify-center gap-3">
                {alert.showCancel && (
                  <button
                    className="sa-btn rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                    onClick={() => closeWith(false)}
                  >
                    {alert.cancelText}
                  </button>
                )}
                <button
                  className="sa-btn rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95"
                  style={{ background: alert.type === "question" ? "#F97316" : "#14274E" }}
                  onClick={() => closeWith(true)}
                >
                  {alert.confirmText}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </SweetAlertContext.Provider>
  );
}

export const useSweetAlert = () => useContext(SweetAlertContext);