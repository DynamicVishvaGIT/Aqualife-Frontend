import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Droplet, Waves, Layers, Users } from "lucide-react";
import aboutImg from "../assets/about_banner_2.png";

gsap.registerPlugin(ScrollTrigger);

const COLORS = {
  primary: "#0061C2",
  aqua: "#00B4D8",
  bg: "#F0F7FC",
  text: "#0A2540",
  textMuted: "#4A6178",
  borderTint: "rgba(0,97,194,0.10)",
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// maps an icon *name* (string) to the actual icon component — needed
// because dynamic/CMS data can only send strings, not components
const ICON_MAP = { Droplet, Waves, Layers, Users };

// fallback defaults so the component still renders correctly
// if the parent doesn't pass any props
const DEFAULT_CONTENT = {
  eyebrow: "Why Purify",
  heroTitle: "Why Do You Need a Water Purifier?",
  heroImageAlt: "Aqualife water purifiers on display",
  paragraphs: [
    "Having access to clean drinking water is essential for maintaining good health. While water may appear clear, it can still contain impurities such as dissolved solids, bacteria, viruses, chlorine, heavy metals, and other contaminants that are not visible to the naked eye. Water quality can vary depending on the source, whether it comes from a municipal supply, borewell, tanker, or stored water system.",
    "A water purifier helps improve drinking water quality by reducing harmful contaminants and enhancing its taste and odour. Different purification technologies are designed to address specific water conditions, helping households and businesses access cleaner water for everyday use. Choosing the right water purifier for your home or office can support better water quality and provide greater confidence in the water used for drinking and cooking.",
  ],
  sectionTitle: "How to Choose the Right Water Purifier",
  sectionSubtitle:
    "Choosing the right water purifier depends on factors such as your water source, TDS level, family size, and daily water consumption. Since different water sources contain different types of impurities, selecting the appropriate water purification technology is essential for achieving better drinking water quality. Understanding your water condition can help you choose the best water purifier for your home or office.",
};

const DEFAULT_CARDS = [
  {
    icon: "Droplet",
    title: "RO Water Purifier for High TDS Water",
    body: "An RO water purifier is recommended for borewell water and other water sources with high TDS levels. RO technology helps reduce dissolved salts, heavy metals, and other impurities, making it one of the most commonly used water purification systems for homes and businesses dealing with hard water.",
  },
  {
    icon: "Waves",
    title: "UV Water Purifier for Municipal Water Supply",
    body: "A UV water purifier is suitable for municipal water supplies where TDS levels are already within acceptable limits. UV technology helps address microbial contamination by targeting bacteria and viruses, making it a popular choice for households receiving treated municipal water.",
  },
  {
    icon: "Layers",
    title: "RO + UV + UF Water Purifiers for Comprehensive Protection",
    body: "For homes and offices that receive water from multiple sources, a multi-stage water purifier combining RO, UV, and UF technologies can provide enhanced purification. These systems are designed to address diverse water quality concerns and deliver cleaner drinking water under varying conditions.",
  },
  {
    icon: "Users",
    title: "Choose the Right Capacity Based on Your Family Size",
    body: "When selecting a home water purifier, it is important to consider your family's daily drinking water requirements. Choosing the right storage capacity ensures a continuous supply of purified water while supporting the needs of small, medium, and large households.",
  },
];

function Card({ icon, title, body, cardRef }) {
  const [pos, setPos] = useState({ x: "50%", y: "50%" });
  const [hover, setHover] = useState(false);

  // accept either a string ("Droplet") or a direct component reference
  const Icon = typeof icon === "string" ? ICON_MAP[icon] || Droplet : icon;

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={handleMove}
      className="relative overflow-hidden rounded-2xl bg-white p-7 transition-shadow duration-300"
      style={{
        border: `1px solid ${COLORS.borderTint}`,
        boxShadow: hover
          ? "0 20px 36px -20px rgba(0,97,194,0.35)"
          : "0 1px 2px rgba(10,37,64,0.04)",
      }}
    >
      {/* cursor ripple */}
      <div
        className="pointer-events-none absolute rounded-full transition-all duration-500 ease-out"
        style={{
          left: pos.x,
          top: pos.y,
          width: hover ? 340 : 0,
          height: hover ? 340 : 0,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(0,97,194,0.14) 0%, transparent 70%)",
        }}
      />

      {/* icon badge — inline gradient so it always renders regardless of Tailwind config */}
      <div
        className="relative z-10 mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.aqua})` }}
      >
        <Icon size={20} color="#ffffff" strokeWidth={2} />
      </div>

      <h3
        className="relative heading z-10 mb-2.5 text-base font-bold leading-snug"
        style={{ color: COLORS.text }}
      >
        {title}
      </h3>
      <p
        className="relative z-10 text-sm leading-relaxed"
        style={{ color: COLORS.textMuted }}
      >
        {body}
      </p>
    </div>
  );
}

const WaterPurifierInfo = ({
  image = aboutImg,
  content = {},
  cards = DEFAULT_CARDS,
}) => {
  const {
    eyebrow,
    heroTitle,
    heroImageAlt,
    paragraphs,
    sectionTitle,
    sectionSubtitle,
  } = { ...DEFAULT_CONTENT, ...content };

  const sectionRef = useRef(null);
  const heroRef = useRef(null);
  const dividerRef = useRef(null);
  const chooseHeadRef = useRef(null);
  const cardRefs = useRef([]);
  cardRefs.current = [];

  const addCardRef = (el) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: heroRef.current, start: "top 85%" },
        }
      );

      gsap.fromTo(
        chooseHeadRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: chooseHeadRef.current, start: "top 85%" },
        }
      );

      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: cardRefs.current[0], start: "top 90%" },
        }
      );

      // gentle opacity pulse on the divider — path is fully visible from the
      // start, this just adds ambient motion, so nothing depends on it to be seen
      gsap.to(dividerRef.current, {
        opacity: 0.6,
        duration: 1.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, sectionRef);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      ctx.revert();
      window.removeEventListener("load", onLoad);
    };
  }, [cards.length]);

  return (
    <section
      ref={sectionRef}
      className="w-full px-4 py-16 sm:px-6"
      style={{ background: COLORS.bg }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Why section */}
        <div ref={heroRef}>
          <span
            className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
            style={{ color: COLORS.primary }}
          >
            <span
              className="h-2 w-2 animate-ping rounded-full heading"
              style={{ backgroundColor: COLORS.aqua }}
            />
            {eyebrow}
          </span>

          <h1
            className="mb-5 text-3xl font-extrabold heading leading-tight tracking-tight sm:text-4xl"
            style={{ color: COLORS.text }}
          >
            {heroTitle}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="w-full overflow-hidden rounded-2xl">
              <img
                src={image}
                alt={heroImageAlt}
                className="w-full h-64 sm:h-80 md:h-96 lg:h-[300px] xl:h-[400px] object-cover"
              />
            </div>
            <div className="flex flex-col gap-5 text-sm sm:text-base leading-relaxed text-slate-700">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={`${i > 0 ? "mt-3.5 " : ""}max-w-5xl text-base`}
                  style={{ color: COLORS.textMuted }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* wave divider — fully visible by default, no animation required to see it */}
        <svg
          className="mt-6 mb-2 h-10 w-full"
          viewBox="0 0 920 40"
          preserveAspectRatio="none"
        >
          <path
            ref={dividerRef}
            d="M0,20 C120,4 200,36 340,20 C480,4 560,36 700,20 C800,8 860,32 920,20"
            fill="none"
            stroke={COLORS.primary}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>

        {/* How to choose section */}
        <div className="mt-8">
          <div ref={chooseHeadRef}>
            <h2
              className="mb-4 text-2xl heading font-extrabold tracking-tight sm:text-3xl"
              style={{ color: COLORS.text }}
            >
              {sectionTitle}
            </h2>
            <p className="mb-9 max-w-5xl text-base" style={{ color: COLORS.textMuted }}>
              {sectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {cards.map((card) => (
              <Card key={card.title} {...card} cardRef={addCardRef} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaterPurifierInfo;