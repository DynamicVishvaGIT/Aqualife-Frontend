// @refresh reset
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Info } from "lucide-react";
import gsap from "gsap";
import sideBanner from "../assets/side_banner.png";

const BRAND      = "#1A6FC4";
const BRAND_DARK = "#155AA0";
const NAVY       = "#1A3A6C";
const ORANGE     = "#F07A1A";

export default function SignUp() {
  const [activeTab, setActiveTab] = useState("login");
  const [purpose, setPurpose]     = useState("residential");
  const [agreed, setAgreed]       = useState(true);
  const [loginMobile, setLoginMobile] = useState("");
  const [form, setForm] = useState({ firstName: "", mobile: "", city: "", referral: "" });

  const containerRef    = useRef(null);
  const bannerRef       = useRef(null);
  const formPanelRef    = useRef(null);
  const tabsRef         = useRef(null);
  const loginFieldsRef  = useRef(null);
  const signupFieldsRef = useRef(null);
  const loginBtnRef     = useRef(null);
  const signupBtnRef    = useRef(null);

  const update = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow";

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
  }, [activeTab]);

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

  const onFocusAnim = (e) => gsap.to(e.currentTarget, { scale: 1.012, duration: 0.18, ease: "power1.out" });
  const onBlurAnim  = (e) => gsap.to(e.currentTarget, { scale: 1,     duration: 0.18, ease: "power1.in"  });
  const onRadioEnter = (e) => gsap.to(e.currentTarget, { scale: 1.03, duration: 0.2, ease: "power1.out" });
  const onRadioLeave = (e) => gsap.to(e.currentTarget, { scale: 1,    duration: 0.2, ease: "power1.in"  });

  const pressBtn = (ref) => {
    gsap.timeline()
      .to(ref.current, { scale: 0.96, duration: 0.1, ease: "power1.in" })
      .to(ref.current, { scale: 1,    duration: 0.35, ease: "elastic.out(1.2, 0.5)" });
  };

  const btnEnter = (ref) => (e) => {
    e.currentTarget.style.backgroundColor = BRAND_DARK;
    gsap.to(ref.current, { scale: 1.02, duration: 0.2, ease: "power1.out" });
  };
  const btnLeave = (ref) => (e) => {
    e.currentTarget.style.backgroundColor = BRAND;
    gsap.to(ref.current, { scale: 1, duration: 0.2, ease: "power1.in" });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    pressBtn(loginBtnRef);
    console.log("Login", { loginMobile });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    pressBtn(signupBtnRef);
    console.log("Signup", { ...form, purpose, agreed });
  };

  return (
    /*
      Page wrapper: full viewport, centered
      On mobile → column card scrolls naturally
      On desktop → card is fixed height, internal form scrolls if needed
    */
    <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center pt-14 sm:p-6 lg:pt-30">

      {/*
        CARD
        Mobile  : full width, auto height (stacked column)
        Desktop : max-w-4xl, fixed 680px height so both tabs = same card size
                  680px fits signup comfortably; login is centered inside
      */}
      <div
        ref={containerRef}
       className="
  w-full 
  flex flex-col md:flex-row
   md:h-[580px] lg:h-[720px] 2xl:h-[1100px]
"
      >

        {/*
          BANNER
          Mobile  : 240px tall, full width
          Desktop : 46% wide, height = 100% of card (stretch fills the 680px)
        */}
        <div
          ref={bannerRef}
          className="relative shrink-0 w-full h-[400px] md:h-auto md:w-[50%]"
        >
          <img
            src={sideBanner}
            alt="Aqualife-Ever – Pure Water. Pure Life."
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              display: "block",
            }}
          />
        </div>

        {/*
          FORM PANEL
          Takes remaining width.
          Uses overflow-y-auto so signup can scroll on short viewports.
          justify-center keeps login fields vertically centered in the 680px card.
        */}
        <div
          ref={formPanelRef}
          className="
            flex-1 min-w-0
            flex flex-col justify-center
            px-6 py-8 sm:px-10 sm:py-10
          "
        >

          {/* ── Tabs ── */}
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
                  style={{
                    bottom: "-6px",
                    backgroundColor: activeTab === tab ? BRAND : "transparent",
                  }}
                />
              </div>
            ))}
          </div>

          {/* ══════════ LOGIN TAB ══════════ */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
              <div ref={loginFieldsRef} className="flex flex-col gap-5">

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1.5">
                    Mobile Number
                  </label>
                  <div
                    className="flex rounded-lg border border-gray-200 bg-gray-50 overflow-hidden focus-within:ring-2"
                    style={{ "--tw-ring-color": BRAND }}
                  >
                    <span className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200 bg-gray-100 whitespace-nowrap">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={loginMobile}
                      onChange={(e) => setLoginMobile(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter Your Number"
                      className="flex-1 min-w-0 px-4 py-3 text-sm bg-gray-50 focus:outline-none"
                    />
                  </div>
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

          {/* ══════════ SIGNUP TAB ══════════ */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignupSubmit} className="flex flex-col gap-5">
              <div ref={signupFieldsRef} className="flex flex-col gap-5">

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1.5">First Name</label>
                  <input
                    type="text"
                    placeholder="Enter Your First Name"
                    value={form.firstName}
                    onChange={update("firstName")}
                    onFocus={onFocusAnim}
                    onBlur={onBlurAnim}
                    className={inputClass}
                    style={{ "--tw-ring-color": BRAND }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1.5">Mobile Number</label>
                  <div
                    className="flex rounded-lg border border-gray-200 bg-gray-50 overflow-hidden focus-within:ring-2"
                    style={{ "--tw-ring-color": BRAND }}
                  >
                    <span className="px-4 py-3 text-sm text-gray-600 border-r border-gray-200 bg-gray-100 whitespace-nowrap">+91</span>
                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={update("mobile")}
                      className="flex-1 min-w-0 px-4 py-3 text-sm bg-gray-50 focus:outline-none"
                      placeholder="Enter Mobile Number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1.5">City</label>
                  <div className="relative">
                    <select
                      value={form.city}
                      onChange={update("city")}
                      onFocus={onFocusAnim}
                      onBlur={onBlurAnim}
                      className={`${inputClass} appearance-none pr-10 ${form.city === "" ? "text-gray-400" : "text-gray-800"}`}
                      style={{ "--tw-ring-color": BRAND }}
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

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
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