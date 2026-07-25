import { useEffect, useRef } from "react";
import gsap from "gsap";

const BRAND = "#0061C2";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const STEPS = [
  { key: "placed", label: "Order Placed", detail: "We've received your order", date: "2 Jul, 10:14 AM" },
  { key: "packed", label: "Packed", detail: "Your order has been packed", date: "2 Jul, 4:40 PM" },
  { key: "shipped", label: "Shipped", detail: "Handed over to courier partner", date: "3 Jul, 9:05 AM" },
  { key: "out", label: "Out for Delivery", detail: "Arriving today", date: "" },
  { key: "delivered", label: "Delivered", detail: "", date: "" },
];

// Index of the last completed step. Wire this up to real order data.
const CURRENT_STEP = 2;

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const TrackStatus = () => {
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const stepRefs = useRef([]);

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (progressRef.current) {
        progressRef.current.style.height = `${(CURRENT_STEP / (STEPS.length - 1)) * 100}%`;
      }
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.55, ease: "power3.out" }
      );

      gsap.fromTo(
        stepRefs.current,
        { opacity: 0, x: 16 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power2.out", delay: 0.2 }
      );

      gsap.fromTo(
        progressRef.current,
        { height: "0%" },
        {
          height: `${(CURRENT_STEP / (STEPS.length - 1)) * 100}%`,
          duration: 0.8,
          ease: "power2.inOut",
          delay: 0.3,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const addStepRef = (el) => {
    if (el && !stepRefs.current.includes(el)) {
      stepRefs.current.push(el);
    }
  };

  return (
    <div ref={containerRef} style={{ opacity: 0 }}>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 sm:px-8 py-7 transition-shadow duration-300 hover:shadow-md">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-gray-800">Track Order</h2>
          <span className="text-sm text-gray-400">#AQE-20481</span>
        </div>
        <p className="text-sm text-gray-500 mb-7">
          Estimated delivery:{" "}
          <span className="font-medium text-gray-700">Tomorrow, 4 Jul</span>
        </p>

        <div className="relative">
          {/* track line */}
          <div
            className="absolute left-[15px] top-1 bottom-1 w-[2px] rounded-full bg-gray-200"
          />
          <div
            ref={progressRef}
            className="absolute left-[15px] top-1 w-[2px] rounded-full"
            style={{ backgroundColor: BRAND, height: 0 }}
          />

          <div className="flex flex-col gap-7">
            {STEPS.map((step, index) => {
              const isComplete = index <= CURRENT_STEP;
              const isCurrent = index === CURRENT_STEP;
              return (
                <div key={step.key} ref={addStepRef} className="flex items-start gap-4 relative">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 transition-colors"
                    style={{
                      backgroundColor: isComplete ? BRAND : "white",
                      borderColor: isComplete ? BRAND : "#e5e7eb",
                    }}
                  >
                    {isComplete ? (
                      <CheckIcon />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: isComplete ? "#1f2937" : "#9ca3af" }}
                      >
                        {step.label}
                      </p>
                      {isCurrent && (
                        <span
                          className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${BRAND}1A`, color: BRAND }}
                        >
                          In progress
                        </span>
                      )}
                    </div>
                    {step.detail && (
                      <p className="text-sm text-gray-500 mt-0.5">{step.detail}</p>
                    )}
                    {step.date && (
                      <p className="text-xs text-gray-400 mt-0.5">{step.date}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackStatus;