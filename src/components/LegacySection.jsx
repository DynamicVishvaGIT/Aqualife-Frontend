import { useEffect, useRef } from "react";

import cert1 from "../assets/certificate.jpg";
import cert2 from "../assets/certificate.jpg";
import cert3 from "../assets/certificate.jpg";

import badgeNSF         from "../assets/trusted_1.png";
import badgeMakeInIndia from "../assets/trusted_2.png";
import badgeISO         from "../assets/trusted_3.png";
import badgeISI         from "../assets/trusted_4.png";

/* ─────────────────────────────────────────────
   Animation keyframes injected once into <head>
───────────────────────────────────────────── */
const ANIMATION_CSS = `
  @keyframes legacyRise {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes legacyPop {
    0%   { opacity: 0; transform: scale(0.80); }
    65%  { opacity: 1; transform: scale(1.05); }
    100% { opacity: 1; transform: scale(1);    }
  }
  .legacy-anim        { opacity: 0; }
  .legacy-anim.in-view          {
    animation: legacyRise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .legacy-anim.in-view.pop-anim {
    animation: legacyPop  0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
`;

function injectStyles() {
  if (document.getElementById("legacy-anim-styles")) return;
  const tag = document.createElement("style");
  tag.id = "legacy-anim-styles";
  tag.textContent = ANIMATION_CSS;
  document.head.appendChild(tag);
}

/* ─────────────────────────────────────────────
   Hook: observe a single element
───────────────────────────────────────────── */
function useReveal(delay = 0) {
  const ref = useRef(null);

  useEffect(() => {
    injectStyles();
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.animationDelay = `${delay}s`;
          el.classList.add("in-view");
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return ref;
}

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const CERTIFICATES = [
  {
    id: 1,
    image: cert1,
    label: "Certificate by:  ISO 9001:2015",
    title: "Quality Management System",
  },
  {
    id: 2,
    image: cert2,
    label: "Certificate by:  ISO 14001:2015",
    title: "Environmental Management System",
  },
  {
    id: 3,
    image: cert3,
    label: "Certificate by:  ISO/TC 260",
    title: "Registered Site",
  },
];

const BADGES = [
  { id: 1, image: badgeNSF,          alt: "NSF Independently Certified" },
  { id: 2, image: badgeMakeInIndia,  alt: "Make In India" },
  { id: 3, image: badgeISO,          alt: "ISO Certified" },
  { id: 4, image: badgeISI,          alt: "ISI Mark" },
];

/* ─────────────────────────────────────────────
   Sub-components (keep hook rules clean)
───────────────────────────────────────────── */
function CertCard({ cert, delay }) {
  const ref = useReveal(delay);
  return (
    <div
      ref={ref}
      className="legacy-anim flex items-center gap-4 h-[160px] bg-white rounded-xl px-4 py-4 shadow-sm border border-slate-100"
    >
      {/* Thumbnail */}
      <div className="shrink-0 w-16 sm:w-20 overflow-hidden rounded-md border border-slate-200"
           style={{ height: "96px" }}>
        <img
        loading="lazy"
          src={cert.image}
          alt={cert.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text */}
      <div>
        <p className="text-slate-400 text-[12px] sm:text-[13px] mb-0.5">
          {cert.label}
        </p>
        <p className="text-slate-900 text-[13px] sm:text-sm font-bold leading-snug">
          {cert.title}
        </p>
      </div>
    </div>
  );
}

function BadgeItem({ badge, delay }) {
  const ref = useReveal(delay);
  return (
    <div
      ref={ref}
      className="legacy-anim pop-anim flex items-center justify-center"
    >
      <img
      loading="lazy"
        src={badge.image}
        alt={badge.alt}
        className="h-14 sm:h-16 lg:h-20 w-auto object-contain"
        draggable={false}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Section
───────────────────────────────────────────── */
export default function LegacySection() {
  const headingRef = useReveal(0);
  const paraRef    = useReveal(0.1);

  return (
    <section className="bg-[#FFF9F9] py-10 sm:py-12 lg:py-14">
      <div className="primary-container">

        {/* ── Heading ── */}
        <h2
          ref={headingRef}
          className="legacy-anim text-xl heading sm:text-2xl font-bold text-slate-900 mb-2"
        >
          A Legacy of Excellence
        </h2>

        <p
          ref={paraRef}
          className="legacy-anim text-sm sm:text-[15px] leading-relaxed max-w-3xl mb-10 sm:mb-12"
        >
          Celebrating 25 years of trust, innovation, and customer satisfaction as one
          of India's most preferred RO and home appliance brands.
        </p>

        {/* ── Certificates ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 mb-12 sm:mb-14">
          {CERTIFICATES.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} delay={0.18 + i * 0.1} />
          ))}
        </div>

        {/* ── Badges ── */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {BADGES.map((badge, i) => (
            <BadgeItem key={badge.id} badge={badge} delay={0.42 + i * 0.09} />
          ))}
        </div>

      </div>
    </section>
  );
}