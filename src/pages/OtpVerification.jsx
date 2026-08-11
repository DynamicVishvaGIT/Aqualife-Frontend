// @refresh reset
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import sideBanner from "../assets/side_banner.png";

import { useLocation, useNavigate } from "react-router-dom";
import { useResendOtp, useVerifyOtp } from "../features/hooks/authHooks";
import { useAuth } from "../context/AuthProvider";
import { useSweetAlert } from "../context/SweetAlertProvider";

const OTP_LENGTH = 4;
const BRAND = "#1A6FC4";
const BRAND_DARK = "#155AA0";
const ORANGE = "#F07A1A";

export default function OtpVerification() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resent, setResent] = useState(false);
  const [shake, setShake] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);
  const containerRef = useRef(null);
  const bannerRef = useRef(null);
  const panelRef = useRef(null);
  const contentRef = useRef(null);
  const submitRef = useRef(null);
  const firstInputRef = useRef(null);

  const { state } = useLocation();
  const navigate = useNavigate();
  const mobile = state?.mobile;

  const { refetchUser } = useAuth();
  const sweetAlert = useSweetAlert();

  // redirect back if someone lands here directly without a mobile number
  useEffect(() => {
    if (!mobile) navigate("/login", { replace: true });
  }, [mobile, navigate]);

  const { mutate: verifyOtp, isPending: verifying } = useVerifyOtp();
  const { mutate: resendOtpMutation, isPending: resending } = useResendOtp();

  const PHONE = mobile;

  /* ── countdown ── */
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  /* ── entrance animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        y: 40,
        opacity: 0,
        scale: 0.97,
        duration: 0.6,
        ease: "back.out(1.4)",
      });
      gsap.from(bannerRef.current, {
        x: -60,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.15,
      });
      gsap.from(panelRef.current, {
        x: 40,
        opacity: 0,
        duration: 0.65,
        ease: "power3.out",
        delay: 0.25,
      });
      if (contentRef.current) {
        gsap.from(Array.from(contentRef.current.children), {
          y: 20,
          opacity: 0,
          stagger: 0.08,
          duration: 0.45,
          ease: "power2.out",
          delay: 0.5,
        });
      }
    });
    return () => ctx.revert();
  }, []);

  /* ── focus first OTP box on mount ── */
  useEffect(() => {
    const t = setTimeout(() => {
      firstInputRef.current?.focus({ preventScroll: true });
    }, 300);
    return () => clearTimeout(t);
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
    if (e.key === "ArrowLeft" && index > 0)
      inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1)
      inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
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
    gsap
      .timeline()
      .to(submitRef.current, { scale: 0.96, duration: 0.1, ease: "power1.in" })
      .to(submitRef.current, {
        scale: 1,
        duration: 0.35,
        ease: "elastic.out(1.2,0.5)",
      });
  };

  /* ── auto-redirect to home after success ── */
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => navigate("/", { replace: true }), 1500);
    return () => clearTimeout(t);
  }, [success, navigate]);

  const handleSubmit = () => {
    setSubmitted(true);
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits.`);
      triggerShake();
      return;
    }
    pressBtn();
    verifyOtp(
      { mobile, otp: code },
      {
        onSuccess: async (data) => {
          await refetchUser();
          setSuccess(true);
          setError("");

          // data.user comes straight from the verify-otp response, so we
          // don't have to wait on the refetch to know who just logged in.
          const name = data?.user?.name;
          sweetAlert?.success({
            title: name ? `Welcome back, ${name}!` : "Welcome to Aqualife!",
            text: "You're logged in successfully.",
          });
        },
        onError: (err) => {
          setError(err?.response?.data?.message || "Incorrect OTP. Please try again.");
          triggerShake();
          setOtp(Array(OTP_LENGTH).fill(""));
          inputRefs.current[0]?.focus();
        },
      }
    );
  };

  const handleResend = () => {
    if (!canResend) return;
    resendOtpMutation(mobile, {
      onSuccess: () => {
        setOtp(Array(OTP_LENGTH).fill(""));
        setError("");
        setSuccess(false);
        setSubmitted(false);
        setResent(true);
        setTimer(30);
        setCanResend(false);
        inputRefs.current[0]?.focus();
        setTimeout(() => setResent(false), 3000);
      },
      onError: (err) => {
        setError(err?.response?.data?.message || "Failed to resend OTP");
      },
    });
  };

  const filled = otp.filter(Boolean).length;
  const isComplete = filled === OTP_LENGTH;

  const btnEnter = (e) => {
    e.currentTarget.style.backgroundColor = BRAND_DARK;
    gsap.to(submitRef.current, {
      scale: 1.02,
      duration: 0.2,
      ease: "power1.out",
    });
  };
  const btnLeave = (e) => {
    e.currentTarget.style.backgroundColor = BRAND;
    gsap.to(submitRef.current, { scale: 1, duration: 0.2, ease: "power1.in" });
  };

  return (
    <>
      <div
        className="primary-container flex items-center justify-center overflow-y-auto overflow-x-hidden"
        style={{
          marginTop: "80px",
          minHeight: "calc(100dvh - 80px)",
        }}
      >
        <div
          ref={containerRef}
          className="w-full min-h-[calc(100dvh-80px)] md:h-full flex flex-col md:flex-row"
        >
          {/* ── LEFT BANNER ── */}
          <div
            ref={bannerRef}
            className="relative shrink-0 w-full h-[400px] xs:h-[260px] sm:h-[320px] md:h-auto md:w-[42%] lg:w-[50%] 2xl:w-[58%]"
          >
            <img
              src={sideBanner}
              loading="lazy"
              alt="Aqualife-Ever – Pure Water. Pure Life."
              className="absolute inset-0 w-full h-full object-cover object-top block"
            />
          </div>

          {/* ── RIGHT PANEL ── */}
          <div
            ref={panelRef}
            className="flex-1 min-w-0 min-h-0 bg-white flex flex-col justify-center px-5 py-8 xs:px-6 sm:px-10 sm:py-10"
          >
            {success ? (
              /* ── SUCCESS STATE ── */
              <div className="flex flex-col items-center gap-5 text-center otp-fade-in">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#EFF6FC" }}
                >
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke={BRAND}
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-gray-800">
                    Verified!
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Your number has been verified successfully.
                  </p>
                </div>
              </div>
            ) : (
              /* ── OTP FORM ── */
              <div
                ref={contentRef}
                className="flex flex-col gap-5 sm:gap-6 w-full max-w-sm mx-auto"
              >
                {/* heading */}
                <div className="text-center">
                  <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed">
                    Please Enter the {OTP_LENGTH}-digit OTP That was sent to
                    the number below
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                    <span className="text-gray-900 font-bold text-sm sm:text-base break-all">
                      {PHONE}
                    </span>
                    <button
                      className="text-sm font-semibold underline underline-offset-2 shrink-0"
                      style={{ color: ORANGE }}
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* OTP boxes */}
                <div
                  className={`flex justify-center gap-2.5 xs:gap-3 sm:gap-4 ${
                    shake ? "otp-shake" : ""
                  }`}
                  onPaste={handlePaste}
                >
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        inputRefs.current[i] = el;
                        if (i === 0) firstInputRef.current = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      autoComplete="one-time-code"
                      className="otp-box w-12 h-12 xs:w-14 xs:h-14 sm:w-[60px] sm:h-[60px] text-lg xs:text-xl sm:text-[1.25rem]"
                      style={{
                        textAlign: "center",
                        fontWeight: "700",
                        borderRadius: "10px",
                        border: `2px solid ${
                          submitted && !digit
                            ? "#EF4444"
                            : digit
                              ? BRAND
                              : "#E5E7EB"
                        }`,
                        backgroundColor:
                          submitted && !digit
                            ? "#FEF2F2"
                            : digit
                              ? "#EFF6FC"
                              : "#F9FAFB",
                        color: digit ? BRAND : "#1F2937",
                        outline: "none",
                        transition:
                          "border-color 0.2s, box-shadow 0.2s, background-color 0.2s",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = BRAND;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${BRAND}30`;
                      }}
                      onBlur={(e) => {
                        if (!otp[i]) {
                          e.currentTarget.style.borderColor = "#E5E7EB";
                          e.currentTarget.style.boxShadow = "none";
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
                    <p
                      className="text-xs font-medium otp-fade-in"
                      style={{ color: "#16A34A" }}
                    >
                      OTP resent via WhatsApp &amp; SMS to alternate number
                    </p>
                  )}
                  {error && (
                    <p className="text-red-500 text-xs font-medium otp-fade-in">
                      {error}
                    </p>
                  )}
                </div>

                {/* submit with API */}
                <button
                  ref={submitRef}
                  onClick={handleSubmit}
                  disabled={!isComplete || verifying}
                  className="w-full py-3.5 rounded-lg text-white font-semibold text-sm sm:text-base"
                  style={{
                    backgroundColor: isComplete ? BRAND : `${BRAND}70`,
                    cursor: isComplete ? "pointer" : "not-allowed",
                  }}
                  onMouseEnter={isComplete ? btnEnter : undefined}
                  onMouseLeave={isComplete ? btnLeave : undefined}
                >
                  {verifying ? "Verifying..." : "Submit"}
                </button>

                {/* resend */}
                <p className="text-center text-sm text-gray-500 -mt-2">
                  Did Not Receive Verification Code?{" "}
                  {canResend ? (
                    <button
                      onClick={handleResend}
                      disabled={resending}
                      className="font-bold"
                      style={{ color: ORANGE }}
                    >
                      {resending ? "Resending..." : "Resend OTP"}
                    </button>
                  ) : (
                    <span className="font-medium text-gray-400">
                      Resend in {timer}s
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
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
        .otp-box     { min-width: 0; }
      `}</style>
    </>
  );
}