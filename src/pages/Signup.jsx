// @refresh reset
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Info } from "lucide-react";
import gsap from "gsap";
import sideBanner from "../assets/side_banner.png";

const BRAND      = "#1A6FC4";
const BRAND_DARK = "#155AA0";
const NAVY       = "#1A3A6C";
const ORANGE     = "#F07A1A";
const ERROR      = "#EF4444";

const MOBILE_RE = /^[6-9]\d{9}$/;
const NAME_RE   = /^[A-Za-z][A-Za-z ]{1,49}$/;

export default function SignUp() {
  const [activeTab, setActiveTab] = useState("login");
  const [purpose, setPurpose]     = useState("residential");
  const [agreed, setAgreed]       = useState(true);
  const [loginMobile, setLoginMobile] = useState("");
  const [form, setForm] = useState({ firstName: "", mobile: "", city: "", referral: "" });

  const [loginErrors, setLoginErrors]   = useState({ mobile: "" });
  const [signupErrors, setSignupErrors] = useState({ firstName: "", mobile: "", city: "", agreed: "" });

  const containerRef    = useRef(null);
  const bannerRef       = useRef(null);
  const formPanelRef    = useRef(null);
  const tabsRef         = useRef(null);
  const loginFieldsRef  = useRef(null);
  const signupFieldsRef = useRef(null);
  const loginBtnRef     = useRef(null);
  const signupBtnRef    = useRef(null);
  const firstInputRef   = useRef(null); // ← points to first input of active tab

  const update = (key) => (e) => {
    const { value } = e.target;
    setForm((p) => ({ ...p, [key]: value }));
    setSignupErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
  };

  const updateMobile = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm((p) => ({ ...p, mobile: digits }));
    setSignupErrors((prev) => (prev.mobile ? { ...prev, mobile: "" } : prev));
  };

  const fieldClass = (hasError) =>
    `w-full px-4 py-3 rounded-lg border text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow ${
      hasError ? "border-red-400 bg-red-50/40" : "border-gray-200 bg-gray-50"
    }`;

  const mobileWrapClass = (hasError) =>
    `flex rounded-lg border overflow-hidden focus-within:ring-2 ${
      hasError ? "border-red-400 bg-red-50/40" : "border-gray-200 bg-gray-50"
    }`;

  // ── Mount animation (runs once) ──
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
    });
    return () => ctx.revert();
  }, []);

  // ── Field stagger + scroll/focus on tab change ──
  useEffect(() => {
    const fieldsRef = activeTab === "login" ? loginFieldsRef : signupFieldsRef;
    const btnRef    = activeTab === "login" ? loginBtnRef    : signupBtnRef;
    if (!fieldsRef.current) return;

    gsap.fromTo(
      Array.from(fieldsRef.current.children),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.07, duration: 0.4, ease: "power2.out", delay: 0.05 }
    );

    if (btnRef.current) {
      gsap.fromTo(
        btnRef.current,
        { y: 16, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)", delay: 0.38 }
      );
    }

    // Scroll card to center for signup (tall form),
    // scroll input to center for login (short form)
  const timer = setTimeout(() => {
  if (activeTab === "signup") {
    tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    firstInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  firstInputRef.current?.focus({ preventScroll: true });
}, 300);

    return () => clearTimeout(timer);
  }, [activeTab]);

  // ── Tab switch with GSAP slide-out ──
  const handleTabSwitch = (tab) => {
    if (tab === activeTab) return;
    const outRef = activeTab === "login" ? loginFieldsRef : signupFieldsRef;
    const dir    = tab === "signup" ? -1 : 1;
    if (outRef.current) {
      gsap.to(Array.from(outRef.current.children), {
        x: dir * 30, opacity: 0,
        stagger: 0.04, duration: 0.18, ease: "power1.in",
        onComplete: () => setActiveTab(tab),
      });
    } else {
      setActiveTab(tab);
    }
  };

  const onFocusAnim  = (e) => gsap.to(e.currentTarget, { scale: 1.012, duration: 0.18, ease: "power1.out" });
  const onBlurAnim   = (e) => gsap.to(e.currentTarget, { scale: 1,     duration: 0.18, ease: "power1.in"  });
  const onRadioEnter = (e) => gsap.to(e.currentTarget, { scale: 1.03,  duration: 0.2,  ease: "power1.out" });
  const onRadioLeave = (e) => gsap.to(e.currentTarget, { scale: 1,     duration: 0.2,  ease: "power1.in"  });

  const pressBtn = (ref) => {
    gsap.timeline()
      .to(ref.current, { scale: 0.96, duration: 0.1,  ease: "power1.in" })
      .to(ref.current, { scale: 1,    duration: 0.35, ease: "elastic.out(1.2, 0.5)" });
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

  const btnEnter = (ref) => (e) => {
    e.currentTarget.style.backgroundColor = BRAND_DARK;
    gsap.to(ref.current, { scale: 1.02, duration: 0.2, ease: "power1.out" });
  };
  const btnLeave = (ref) => (e) => {
    e.currentTarget.style.backgroundColor = BRAND;
    gsap.to(ref.current, { scale: 1, duration: 0.2, ease: "power1.in" });
  };

  const validateLogin = () => {
    const mobile = loginMobile.trim();
    const valid  = MOBILE_RE.test(mobile);
    setLoginErrors({ mobile: valid ? "" : "Enter a valid 10-digit mobile number" });
    return valid;
  };

  const validateSignup = () => {
    const errs = { firstName: "", mobile: "", city: "", agreed: "" };
    if (!NAME_RE.test(form.firstName.trim()))  errs.firstName = "Enter a valid first name";
    if (!MOBILE_RE.test(form.mobile.trim()))   errs.mobile    = "Enter a valid 10-digit mobile number";
    if (!form.city)                            errs.city      = "Please select your city";
    if (!agreed)                               errs.agreed    = "Please accept the terms to continue";
    setSignupErrors(errs);
    return !errs.firstName && !errs.mobile && !errs.city && !errs.agreed;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!validateLogin()) { shakeBtn(loginBtnRef); return; }
    pressBtn(loginBtnRef);
    console.log("Login", { loginMobile });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!validateSignup()) { shakeBtn(signupBtnRef); return; }
    pressBtn(signupBtnRef);
    console.log("Signup", { ...form, purpose, agreed });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FBFBFB] flex items-center justify-center pt-14 sm:p-6 lg:pt-30">

      <div
        ref={containerRef}
        className="w-full flex flex-col md:flex-row md:h-[580px] lg:h-[790px] 2xl:h-[1100px]"
      >

        {/* ── Banner ── */}
        <div
          ref={bannerRef}
          className="relative shrink-0 w-full h-[400px] md:h-auto md:w-[50%]"
        >
          <img
          loading="lazy"
            src={sideBanner}
            alt="Aqualife-Ever – Pure Water. Pure Life."
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "top center",
              display: "block",
            }}
          />
        </div>

        {/* ── Form Panel ── */}
        <div
          ref={formPanelRef}
          className="flex-1 min-w-0 flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10"
        >

          {/* Tabs */}
          <div ref={tabsRef} className="flex gap-3 sm:gap-4 mb-8 shrink-0">
            {["login", "signup"].map((tab) => (
              <div key={tab} className="relative flex-1">
                <button
                  type="button"
                  onClick={() => handleTabSwitch(tab)}
                  className={`w-full py-3 cursor-pointer rounded-full font-semibold text-sm sm:text-base border transition-all duration-300 ${
                    activeTab === tab ? "text-white shadow-md" : "bg-white"
                  }`}
                  style={
                    activeTab === tab
                      ? { backgroundColor: BRAND, borderColor: BRAND }
                      : { color: BRAND, borderColor: BRAND }
                  }
                >
                  {tab === "login" ? "Login" : "Sign Up"}
                </button>
                <span
                  className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 transition-all duration-300"
                  style={{ bottom: "-6px", backgroundColor: activeTab === tab ? BRAND : "transparent" }}
                />
              </div>
            ))}
          </div>

          {/* ══ LOGIN TAB ══ */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} noValidate className="flex flex-col gap-5">
              <div ref={loginFieldsRef} className="flex flex-col gap-5">

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1.5">
                    Mobile Number
                  </label>
                  <div
                    className={mobileWrapClass(!!loginErrors.mobile)}
                    style={{ "--tw-ring-color": loginErrors.mobile ? ERROR : BRAND }}
                  >
                    <span className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200 bg-gray-100 whitespace-nowrap">
                      +91
                    </span>
                    <input
                      ref={firstInputRef}          // ← anchor for login
                      type="tel"
                      maxLength={10}
                      value={loginMobile}
                      // autoFocus removed
                      onChange={(e) => {
                        setLoginMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                        setLoginErrors((prev) => (prev.mobile ? { mobile: "" } : prev));
                      }}
                      placeholder="Enter Your Number"
                      className="flex-1 min-w-0 px-4 py-3 text-sm bg-transparent focus:outline-none"
                    />
                  </div>
                  {loginErrors.mobile && (
                    <p className="text-xs mt-1.5" style={{ color: ERROR }}>{loginErrors.mobile}</p>
                  )}
                </div>

              </div>

              <button
                ref={loginBtnRef}
                type="submit"
                className="w-full py-3.5 rounded-lg text-white font-semibold text-sm sm:text-base"
                style={{ backgroundColor: BRAND }}
                onMouseEnter={btnEnter(loginBtnRef)}
                onMouseLeave={btnLeave(loginBtnRef)}
              >
                Send OTP
              </button>

              <p className="text-center text-sm text-gray-500 mt-1">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="font-semibold"
                  style={{ color: ORANGE }}
                  onClick={() => handleTabSwitch("signup")}
                >
                  Register Now
                </button>
              </p>
            </form>
          )}

          {/* ══ SIGNUP TAB ══ */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignupSubmit} noValidate className="flex flex-col gap-5">
              <div ref={signupFieldsRef} className="flex flex-col gap-5">

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1.5">First Name</label>
                  <input
                    ref={firstInputRef}            // ← anchor for signup
                    type="text"
                    placeholder="Enter Your First Name"
                    value={form.firstName}
                    onChange={update("firstName")}
                    onFocus={onFocusAnim}
                    onBlur={onBlurAnim}
                    className={fieldClass(!!signupErrors.firstName)}
                    style={{ "--tw-ring-color": signupErrors.firstName ? ERROR : BRAND }}
                  />
                  {signupErrors.firstName && (
                    <p className="text-xs mt-1.5" style={{ color: ERROR }}>{signupErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1.5">Mobile Number</label>
                  <div
                    className={mobileWrapClass(!!signupErrors.mobile)}
                    style={{ "--tw-ring-color": signupErrors.mobile ? ERROR : BRAND }}
                  >
                    <span className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200 bg-gray-100 whitespace-nowrap">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={form.mobile}
                      onChange={updateMobile}
                      className="flex-1 min-w-0 px-4 py-3 text-sm bg-transparent focus:outline-none"
                      placeholder="Enter Mobile Number"
                    />
                  </div>
                  {signupErrors.mobile && (
                    <p className="text-xs mt-1.5" style={{ color: ERROR }}>{signupErrors.mobile}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1.5">City</label>
                  <div className="relative">
                    <select
                      value={form.city}
                      onChange={update("city")}
                      onFocus={onFocusAnim}
                      onBlur={onBlurAnim}
                      className={`${fieldClass(!!signupErrors.city)} appearance-none pr-10 ${form.city === "" ? "text-gray-400" : "text-gray-800"}`}
                      style={{ "--tw-ring-color": signupErrors.city ? ERROR : BRAND }}
                    >
                      <option value="" disabled>Select City</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="delhi">Delhi</option>
                      <option value="bengaluru">Bengaluru</option>
                      <option value="pune">Pune</option>
                      <option value="hyderabad">Hyderabad</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {signupErrors.city && (
                    <p className="text-xs mt-1.5" style={{ color: ERROR }}>{signupErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Purpose</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["residential", "commercial"].map((opt) => (
                      <label
                        key={opt}
                        onMouseEnter={onRadioEnter}
                        onMouseLeave={onRadioLeave}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-3 rounded-lg border cursor-pointer text-sm capitalize transition-colors ${
                          purpose === opt ? "border-2" : "border-gray-200 text-gray-700"
                        }`}
                        style={
                          purpose === opt
                            ? { borderColor: BRAND, color: BRAND, backgroundColor: "#EFF6FC" }
                            : {}
                        }
                      >
                        <input
                          type="radio"
                          name="purpose"
                          value={opt}
                          checked={purpose === opt}
                          onChange={() => setPurpose(opt)}
                          className="w-4 h-4 shrink-0"
                          style={{ accentColor: BRAND }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-sm font-medium text-gray-800">Referral Code (If Any)</span>
                    <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  </div>
                  <input
                    type="text"
                    value={form.referral}
                    onChange={update("referral")}
                    className="w-full pb-2 bg-transparent border-b border-gray-300 text-sm text-gray-800 focus:outline-none"
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = BRAND;
                      gsap.to(e.currentTarget, { scaleX: 1.01, duration: 0.15 });
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#D1D5DB";
                      gsap.to(e.currentTarget, { scaleX: 1, duration: 0.15 });
                    }}
                  />
                </div>

                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => {
                        setAgreed(e.target.checked);
                        setSignupErrors((prev) => (prev.agreed ? { ...prev, agreed: "" } : prev));
                      }}
                      className="mt-0.5 w-4 h-4 rounded shrink-0"
                      style={{ accentColor: NAVY }}
                    />
                    <span className="text-xs sm:text-[13px] text-gray-600 leading-relaxed">
                      By creating an account on Aqualife ever, you agree to our{" "}
                      <span className="font-medium" style={{ color: ORANGE }}>Terms of Use,</span>{" "}
                      receive WhatsApp, SMS notifications or Call and consent to our{" "}
                      <span className="font-medium" style={{ color: ORANGE }}>cookie policy.</span>
                    </span>
                  </label>
                  {signupErrors.agreed && (
                    <p className="text-xs mt-1.5" style={{ color: ERROR }}>{signupErrors.agreed}</p>
                  )}
                </div>

              </div>

              <button
                ref={signupBtnRef}
                type="submit"
                className="w-full py-3.5 rounded-lg text-white font-semibold text-sm sm:text-base"
                style={{ backgroundColor: BRAND }}
                onMouseEnter={btnEnter(signupBtnRef)}
                onMouseLeave={btnLeave(signupBtnRef)}
              >
                Sign Up &amp; Get 7 Days Trial
              </button>

              <p className="text-center text-sm text-gray-500 mt-1">
                Already have an account?{" "}
                <button
                  type="button"
                  className="font-semibold"
                  style={{ color: ORANGE }}
                  onClick={() => handleTabSwitch("login")}
                >
                  Login
                </button>
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}