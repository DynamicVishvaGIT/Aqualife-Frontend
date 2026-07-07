// @refresh reset
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import sideBanner from "../assets/side_banner.png";

const PHONE      = "+91-8345678930";
const OTP_LENGTH = 4;
const BRAND      = "#1A6FC4";
const BRAND_DARK = "#155AA0";
const ORANGE     = "#F07A1A";

export default function OtpVerification() {
  const [otp, setOtp]             = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);
  const [resent, setResent]       = useState(false);
  const [shake, setShake]         = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timer, setTimer]         = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs    = useRef([]);
  const containerRef = useRef(null);
  const bannerRef    = useRef(null);
  const panelRef     = useRef(null);
  const contentRef   = useRef(null);
  const submitRef    = useRef(null);
  const firstInputRef = useRef(null); // ← anchor for scroll/focus

  /* ── countdown ── */
  useEffect(() => {
    if (timer === 0) { setCanResend(true); return; }
    const t = setTimeout(() => setTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  /* ── entrance animations ── */
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
      gsap.from(panelRef.current, {
        x: 40, opacity: 0,
        duration: 0.65, ease: "power3.out", delay: 0.25,
      });
      if (contentRef.current) {
        gsap.from(Array.from(contentRef.current.children), {
          y: 20, opacity: 0,
          stagger: 0.08, duration: 0.45, ease: "power2.out", delay: 0.5,
        });
      }
    });
    return () => ctx.revert();
  }, []);

  /* ── scroll card to center + focus first OTP box on mount ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInputRef.current?.focus({ preventScroll: true });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  /* ── input handlers ── */
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setError("");
    setResent(false);
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowLeft"  && index > 0)              inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  /* ── submit ── */
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const pressBtn = () => {
    if (!submitRef.current) return;
    gsap.timeline()
      .to(submitRef.current, { scale: 0.96, duration: 0.1, ease: "power1.in" })
      .to(submitRef.current, { scale: 1,    duration: 0.35, ease: "elastic.out(1.2,0.5)" });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits.`);
      triggerShake();
      return;
    }
    pressBtn();
    if (code === "1234") {
      setSuccess(true);
      setError("");
    } else {
      setError("Incorrect OTP. Please try again.");
      triggerShake();
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    setSuccess(false);
    setSubmitted(false);
    setResent(true);
    setTimer(30);
    setCanResend(false);
    inputRefs.current[0]?.focus();
    setTimeout(() => setResent(false), 3000);
  };

  const filled     = otp.filter(Boolean).length;
  const isComplete = filled === OTP_LENGTH;

  const btnEnter = (e) => {
    e.currentTarget.style.backgroundColor = BRAND_DARK;
    gsap.to(submitRef.current, { scale: 1.02, duration: 0.2, ease: "power1.out" });
  };
  const btnLeave = (e) => {
    e.currentTarget.style.backgroundColor = BRAND;
    gsap.to(submitRef.current, { scale: 1, duration: 0.2, ease: "power1.in" });
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center pt-14 sm:p-6 lg:pt-30">

      <div
        ref={containerRef}
        className="w-full flex flex-col md:flex-row md:h-[580px] lg:h-[720px] 2xl:h-[1100px]"
      >

        {/* LEFT BANNER */}
        <div
          ref={bannerRef}
          className="relative shrink-0 w-full h-[400px] md:h-auto md:w-[50%]"
        >
          <img
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

        {/* RIGHT PANEL */}
        <div
          ref={panelRef}
          className="flex-1 min-w-0 bg-white flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10"
        >
          {success ? (

            /* SUCCESS */
            <div className="flex flex-col items-center gap-5 text-center otp-fade-in">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#EFF6FC" }}
              >
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24"
                  stroke={BRAND} strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">Verified!</p>
                <p className="text-gray-500 text-sm mt-1">
                  Your number has been verified successfully.
                </p>
              </div>
              <button
                className="px-10 py-3.5 rounded-lg text-white font-semibold text-sm sm:text-base"
                style={{ backgroundColor: BRAND }}
              >
                Continue
              </button>
            </div>

          ) : (

            /* OTP FORM */
            <div ref={contentRef} className="flex flex-col gap-6 w-full max-w-sm mx-auto">

              {/* heading */}
              <div className="text-center">
                <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed">
                  Please Enter the {OTP_LENGTH}-digit OTP That was sent to the number below
                </p>
                <div className="mt-2.5 flex items-center justify-center gap-2">
                  <span className="text-gray-900 font-bold text-sm md:text-base">{PHONE}</span>
                  <button
                    className="text-sm font-semibold underline underline-offset-2"
                    style={{ color: ORANGE }}
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* OTP boxes */}
              <div
                className={`flex justify-center gap-3 sm:gap-4 ${shake ? "otp-shake" : ""}`}
                onPaste={handlePaste}
              >
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                      if (i === 0) firstInputRef.current = el; // ← attach firstInputRef to box 0
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    autoComplete="one-time-code"
                    style={{
                      width: "60px", height: "60px",
                      textAlign: "center",
                      fontSize: "1.25rem", fontWeight: "700",
                      borderRadius: "10px",
                      border: `2px solid ${
                        submitted && !digit ? "#EF4444"
                        : digit ? BRAND
                        : "#E5E7EB"
                      }`,
                      backgroundColor:
                        submitted && !digit ? "#FEF2F2"
                        : digit ? "#EFF6FC"
                        : "#F9FAFB",
                      color: digit ? BRAND : "#1F2937",
                      outline: "none",
                      transition: "border-color 0.2s, box-shadow 0.2s, background-color 0.2s",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = BRAND;
                      e.currentTarget.style.boxShadow  = `0 0 0 3px ${BRAND}30`;
                    }}
                    onBlur={(e) => {
                      if (!otp[i]) {
                        e.currentTarget.style.borderColor = "#E5E7EB";
                        e.currentTarget.style.boxShadow  = "none";
                      }
                    }}
                  />
                ))}
              </div>

              {/* progress bar */}
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden -mt-2">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(filled / OTP_LENGTH) * 100}%`,
                    backgroundColor: BRAND,
                  }}
                />
              </div>

              {/* feedback */}
              <div className="min-h-[18px] text-center -mt-3">
                {resent && (
                  <p className="text-xs font-medium otp-fade-in" style={{ color: "#16A34A" }}>
                    OTP resent via WhatsApp &amp; SMS to alternate number
                  </p>
                )}
                {error && (
                  <p className="text-red-500 text-xs font-medium otp-fade-in">{error}</p>
                )}
              </div>

              {/* submit */}
              <button
                ref={submitRef}
                onClick={handleSubmit}
                className="w-full py-3.5 rounded-lg text-white font-semibold text-sm sm:text-base"
                style={{
                  backgroundColor: isComplete ? BRAND : `${BRAND}70`,
                  cursor: isComplete ? "pointer" : "not-allowed",
                }}
                onMouseEnter={isComplete ? btnEnter : undefined}
                onMouseLeave={isComplete ? btnLeave : undefined}
              >
                Submit
              </button>

              {/* resend */}
              <p className="text-center text-sm text-gray-500 -mt-2">
                Did Not Receive Verification Code?{" "}
                {canResend ? (
                  <button
                    onClick={handleResend}
                    className="font-bold"
                    style={{ color: ORANGE }}
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span className="font-medium text-gray-400">Resend in {timer}s</span>
                )}
              </p>

            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes otp-shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-7px); }
          40%     { transform: translateX(7px); }
          60%     { transform: translateX(-4px); }
          80%     { transform: translateX(4px); }
        }
        @keyframes otp-fade-in-kf {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .otp-shake   { animation: otp-shake 0.5s ease; }
        .otp-fade-in { animation: otp-fade-in-kf 0.35s ease forwards; }
      `}</style>
    </div>
  );
}