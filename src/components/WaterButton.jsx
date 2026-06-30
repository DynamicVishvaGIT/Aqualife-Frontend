import { useRef } from "react";

const VARIANTS = {
  primary: {
    base: "bg-[#155DFC] text-white rounded-full hover:shadow-[0_0_24px_rgba(21,93,252,0.45)]",
    fill: "bg-[#0061C2]",
    wave: "rgba(10,50,160,0.95)",
  },
};

export function WaterButton({
  children,
  variant = "primary",
  onClick,
  className = "",
  textClassName = "text-[9px] sm:text-[8px] md:text-[10px] lg:text-[12px] xl:text-[14px]",
}) {
  const btnRef = useRef(null);
  const v = VARIANTS[variant];

  const handleClick = (e) => {
    const btn = btnRef.current;
    const r = document.createElement("span");
    r.className = "ripple";

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    r.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY - rect.top - size / 2}px;
    `;

    btn.appendChild(r);
    r.addEventListener("animationend", () => r.remove());

    onClick?.();
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className={`w-btn relative overflow-hidden ${v.base} ${className}`}
    >
      {/* Wave fill */}
      <div className={`water-fill ${v.fill}`}>
        <svg
          viewBox="0 0 200 40"
          height="40"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "200%" }}
        >
          <path
            d="M0,20 C25,5 50,35 75,20 C100,5 125,35 150,20 C175,5 200,35 200,20 L200,40 L0,40 Z"
            fill={v.wave}
          />
        </svg>
      </div>

      <span
        className={`relative z-10 whitespace-nowrap ${textClassName}`}
      >
        {children}
      </span>
    </button>
  );
}