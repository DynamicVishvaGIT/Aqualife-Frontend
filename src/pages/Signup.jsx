// @refresh reset
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import sideBanner from "../assets/side_banner.png";
import { useNavigate } from "react-router-dom";
import { useSendLoginOtp } from "../features/hooks/authHooks";

const BRAND = "#1A6FC4";
const BRAND_DARK = "#155AA0";
const ORANGE = "#F07A1A";
const ERROR = "#EF4444";

const MOBILE_RE = /^[6-9]\d{9}$/;
const TOTAL_DIGITS = 10;

export default function Signup() {
  const [loginMobile, setLoginMobile] = useState("");
  const [loginErrors, setLoginErrors] = useState({ mobile: "" });
  const [btnVisible, setBtnVisible] = useState(false);

  const containerRef = useRef(null);
  const bannerRef = useRef(null);
  const formPanelRef = useRef(null);
  const tabsRef = useRef(null);
  const loginFieldsRef = useRef(null);
  const loginBtnRef = useRef(null);
  const btnWrapRef = useRef(null);
  const fillRef = useRef(null);
  const firstInputRef = useRef(null);

  const navigate = useNavigate();
  const { mutate: sendLoginOtp, isPending: loginPending } = useSendLoginOtp();

  const baseURL = import.meta.env.VITE_API_BASE_URL;


  console.log("base_url",baseURL);

  /* ── Mount animation ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        y: 40, opacity: 0, scale: 0.97,
        duration: 0.6, ease: "back.out(1.4)",
      });
      gsap.from(bannerRef.current, {
        x: -60, opacity: 0,
        duration: 0.7, ease: "power3.out", delay: 0.15,
      });
      gsap.from(formPanelRef.current, {
        x: 40, opacity: 0,
        duration: 0.65, ease: "power3.out", delay: 0.25,
      });
      gsap.from(tabsRef.current, {
        y: -18, opacity: 0,
        duration: 0.45, ease: "back.out(1.6)", delay: 0.5,
      });
      if (loginFieldsRef.current) {
        gsap.from(Array.from(loginFieldsRef.current.children), {
          y: 20, opacity: 0, stagger: 0.07,
          duration: 0.4, ease: "power2.out", delay: 0.55,
        });
      }
    });
    return () => ctx.revert();
  }, []);

  /* ── Focus first input on mount ── */
  useEffect(() => {
    const t = setTimeout(() => {
      firstInputRef.current?.focus({ preventScroll: true });
    }, 380);
    return () => clearTimeout(t);
  }, []);

  /* ── Water-fill button animation on every digit change ── */
  useEffect(() => {
    const digits = loginMobile.length;
    const pct = (digits / TOTAL_DIGITS) * 100;

    // Stop any in-flight tweens so rapid typing/deleting can't leave the
    // button in a half-collapsed / half-expanded state (race-condition fix).
    gsap.killTweensOf(btnWrapRef.current);

    if (digits === 0) {
      if (btnVisible) {
        gsap.to(btnWrapRef.current, {
          height: 0, opacity: 0, marginTop: 0,
          duration: 0.3, ease: "power2.in",
          onComplete: () => {
            setBtnVisible(false);
            gsap.set(fillRef.current, { width: "0%" });
          },
        });
      }
      return;
    }

    if (!btnVisible) {
      setBtnVisible(true);
      gsap.set(fillRef.current, { width: "0%" });
      gsap.fromTo(
        btnWrapRef.current,
        { height: 0, opacity: 0, marginTop: 0 },
        { height: 52, opacity: 1, marginTop: 16,
          duration: 0.45, ease: "back.out(1.6)" },
      );
    } else {
      // Make sure the wrapper is in its fully-open state even if a
      // collapse tween was interrupted mid-flight.
      gsap.to(btnWrapRef.current, {
        height: 52, opacity: 1, marginTop: 16,
        duration: 0.2, ease: "power2.out",
      });
    }

    // water fill advancing
    gsap.to(fillRef.current, {
      width: `${pct}%`,
      duration: 0.32,
      ease: digits === TOTAL_DIGITS ? "power2.out" : "power1.out",
    });

    // subtle ripple pop on every key
    gsap.fromTo(
      loginBtnRef.current,
      { scale: 1 },
      { scale: 1.022, duration: 0.1, ease: "power1.out", yoyo: true, repeat: 1 },
    );

    // glow pulse when full
    if (digits === TOTAL_DIGITS) {
      gsap.to(loginBtnRef.current, {
        boxShadow: `0 0 0 5px ${BRAND}35`,
        duration: 0.4, ease: "power2.out",
        yoyo: true, repeat: 1,
      });
    } else {
      gsap.set(loginBtnRef.current, { boxShadow: "none" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginMobile]);

  /* ── GSAP helpers ── */
  const pressBtn = (ref) => {
    gsap.timeline()
      .to(ref.current, { scale: 0.96, duration: 0.1, ease: "power1.in" })
      .to(ref.current, { scale: 1, duration: 0.35, ease: "elastic.out(1.2,0.5)" });
  };

  const shakeBtn = (ref) => {
    if (!ref.current) return;
    gsap.timeline()
      .to(ref.current, { x: -8, duration: 0.06 })
      .to(ref.current, { x:  8, duration: 0.06 })
      .to(ref.current, { x: -6, duration: 0.06 })
      .to(ref.current, { x:  6, duration: 0.06 })
      .to(ref.current, { x:  0, duration: 0.06 });
  };

  // Hover now animates a visible ring around the button instead of a
  // backgroundColor change that was mostly hidden under the fill overlay.
  const btnEnter = () => {
    if (loginMobile.length < TOTAL_DIGITS) return;
    gsap.to(loginBtnRef.current, {
      scale: 1.02,
      boxShadow: `0 0 0 4px ${BRAND_DARK}55`,
      duration: 0.2, ease: "power1.out",
    });
  };
  const btnLeave = () => {
    gsap.to(loginBtnRef.current, {
      scale: 1,
      boxShadow: "none",
      duration: 0.2, ease: "power1.in",
    });
  };

  /* ── Validation ── */
  const validateLogin = () => {
    const valid = MOBILE_RE.test(loginMobile.trim());
    setLoginErrors({ mobile: valid ? "" : "Enter a valid 10-digit mobile number" });
    return valid;
  };

  /* ── Submit ── */
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!validateLogin()) { shakeBtn(loginBtnRef); return; }
    pressBtn(loginBtnRef);
    sendLoginOtp(loginMobile, {
      onSuccess: () => navigate("/otp-verification", { state: { mobile: loginMobile } }),
      onError: (err) => {
        setLoginErrors({ mobile: err?.response?.data?.message || "Failed to send OTP, try again" });
        shakeBtn(loginBtnRef);
      },
    });
  };

  const mobileWrapClass = (hasError) =>
    `flex rounded-lg border overflow-hidden focus-within:ring-2 ${
      hasError ? "border-red-400 bg-red-50/40" : "border-gray-200 bg-gray-50"
    }`;

  const digits = loginMobile.length;
  const isComplete = digits === TOTAL_DIGITS;

  return (
    <>
    
      <div
        className="primary-container_2 px-0 flex items-center justify-center"
        style={{ marginTop: "80px", minHeight: "calc(100dvh - 80px)" }}
      >
        <div
          ref={containerRef}
          className="w-full min-h-[calc(100dvh-80px)] flex flex-col md:flex-row md:h-[calc(100dvh-80px)]"
        >
          {/* ── LEFT BANNER ── */}
          <div
            ref={bannerRef}
            className="relative shrink-0 w-full aspect-[9/10] sm:aspect-[16/10] md:aspect-auto md:w-[45%] lg:w-[50%] 2xl:w-[60%] md:h-full"
          >
            <img
              loading="lazy"
              src={sideBanner}
              alt="Aqualife-Ever – Pure Water. Pure Life."
              className="absolute inset-0 w-full h-full object-cover block"
              style={{ objectPosition: "top" }}
            />
          </div>

          {/* ── RIGHT PANEL ── */}
          <div
            ref={formPanelRef}
            className="flex-1 min-w-0 min-h-0 mx-auto w-full max-w-md md:max-w-lg bg-white flex flex-col justify-start md:justify-center px-5 py-8 sm:px-10"
          >
            {/* Tab pill */}
            <div ref={tabsRef} className="flex gap-3 sm:gap-4 mb-8 shrink-0">
              <div className="relative flex-1">
                <button
                  type="button"
                  className="w-full py-3 cursor-pointer rounded-full font-semibold text-sm sm:text-base border text-white shadow-md"
                  style={{ backgroundColor: BRAND, borderColor: BRAND }}
                >
                  Login
                </button>
                <span
                  className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                  style={{ bottom: "-6px", backgroundColor: BRAND }}
                />
              </div>
            </div>

            {/* ── LOGIN FORM ── */}
            <form
              onSubmit={handleLoginSubmit}
              noValidate
              className="flex flex-col w-full mx-auto"
            >
              <div ref={loginFieldsRef} className="flex flex-col gap-5">
                <div>
                  <label
                    htmlFor="login-mobile"
                    className="block text-sm font-medium text-gray-800 mb-1.5"
                  >
                    Mobile Number
                  </label>
                  <div
                    className={mobileWrapClass(!!loginErrors.mobile)}
                    style={{ "--tw-ring-color": loginErrors.mobile ? ERROR : BRAND }}
                  >
                    <span className="px-4 py-3 text-sm text-gray-600  border-gray-200 bg-gray-100 whitespace-nowrap select-none">
                      +91
                    </span>
                    <input
                      id="login-mobile"
                      ref={firstInputRef}
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      maxLength={10}
                      value={loginMobile}
                      aria-invalid={!!loginErrors.mobile}
                      aria-describedby={loginErrors.mobile ? "login-mobile-error" : undefined}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setLoginMobile(val);
                        setLoginErrors((prev) =>
                          prev.mobile ? { mobile: "" } : prev,
                        );
                      }}
                      placeholder="Enter Your Number"
                      className="flex-1 min-w-0 px-4 py-3 text-sm bg-transparent focus:outline-none"
                    />
                  </div>
                  {loginErrors.mobile && (
                    <p id="login-mobile-error" className="text-xs mt-1.5" style={{ color: ERROR }}>
                      {loginErrors.mobile}
                    </p>
                  )}
                </div>
              </div>

              {/* ── 10 dot progress track ── */}
              {digits > 0 && (
                <div className="flex justify-between gap-1 mt-4">
                  {Array.from({ length: TOTAL_DIGITS }).map((_, i) => (
                    <span
                      key={i}
                      style={{
                        flex: 1,
                        height: "4px",
                        borderRadius: "9999px",
                        backgroundColor: i < digits ? BRAND : "#E5E7EB",
                        transition: "background-color 0.3s ease",
                        display: "inline-block",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* ── WATER-FILL BUTTON ── */}
              <div
                ref={btnWrapRef}
                style={{ height: 0, opacity: 0, marginTop: 0, overflow: "hidden" }}
              >
                <button
                  ref={loginBtnRef}
                  type="submit"
                  aria-label={isComplete ? "Send OTP" : `${digits} of ${TOTAL_DIGITS} digits entered`}
                  className="relative w-full rounded-lg text-white font-semibold text-sm sm:text-base overflow-hidden"
                  style={{
                    height: "52px",
                    backgroundColor: `${BRAND}55`,
                    cursor: isComplete ? "pointer" : "default",
                  }}
                  onMouseEnter={btnEnter}
                  onMouseLeave={btnLeave}
                >
                  <span
                    ref={fillRef}
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: 0, top: 0,
                      height: "100%",
                      width: "0%",
                      backgroundColor: BRAND,
                      zIndex: 0,
                      pointerEvents: "none",
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="wave-runner"
                    style={{
                      position: "absolute",
                      top: 0,
                      height: "100%",
                      width: "30px",
                      zIndex: 1,
                      pointerEvents: "none",
                      overflow: "hidden",
                    }}
                  />
                  <span
                    style={{
                      position: "relative", zIndex: 2,
                      display: "flex", alignItems: "center",
                      justifyContent: "center", gap: "8px",
                      height: "100%",
                    }}
                  >
                    {isComplete ? (
                      <>
                        <svg
                          width="16" height="16" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor"
                          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        Send OTP
                      </>
                    ) : (
                      <span style={{ fontSize: "13px", letterSpacing: "0.03em", opacity: 0.92 }}>
                        {digits}&thinsp;/&thinsp;{TOTAL_DIGITS} digits
                      </span>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}