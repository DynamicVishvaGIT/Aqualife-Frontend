import { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Minus } from "lucide-react";
import gsap from "gsap";

const DEFAULT_FAQS = [
  {
    id: 1,
    question: "Why do I need a water purifier?",
    answer:
      "Water purifiers help remove harmful contaminants, bacteria, viruses, dissolved impurities, and unpleasant odors, providing safe and healthy drinking water for your family.",
  },
  {
    id: 2,
    question: "What is the difference between RO, UV, and UF purification?",
    answer:
      "RO (Reverse Osmosis) removes dissolved salts and heavy metals. UV (Ultraviolet) kills bacteria and viruses using UV light. UF (Ultrafiltration) filters out larger particles and microbes without electricity. Many purifiers combine all three for comprehensive protection.",
  },
  {
    id: 3,
    question: "Does an RO purifier remove essential minerals?",
    answer:
      "Yes, RO purification removes dissolved salts including some essential minerals. However, most modern RO purifiers come with a mineralizer or TDS controller that adds back beneficial minerals like calcium and magnesium after purification.",
  },
  {
    id: 4,
    question: "How much maintenance does a water purifier require?",
    answer:
      "Most water purifiers require filter replacement every 6–12 months depending on usage and water quality. Annual servicing is recommended to clean internal components and ensure optimal performance.",
  },
  {
    id: 5,
    question: "Can a water purifier remove bacteria and viruses?",
    answer:
      "Yes. UV and UF-based purifiers are effective against bacteria and viruses. RO membranes also block most microorganisms. A combination of RO+UV+UF provides the most comprehensive purification.",
  },
  {
    id: 6,
    question: "How do I know if my water purifier needs servicing?",
    answer:
      "Signs include a change in water taste or odor, slow water flow, the service indicator light turning on, or if it has been more than 6 months since the last filter change. Regular annual servicing is always recommended.",
  },
];

/* ─────────────────────────────────────────
   FaqItem — GSAP-powered accordion row
───────────────────────────────────────── */
function FaqItem({ faq, isOpen, onToggle, animIndex }) {
  const rowRef     = useRef(null);
  const bodyRef    = useRef(null);
  const iconRef    = useRef(null);
  const questionRef = useRef(null);
  const didMount   = useRef(false);   // skip first-render close animation

  /* entrance stagger (triggered by parent) */
  useEffect(() => {
    gsap.from(rowRef.current, {
      y: 24,
      opacity: 0,
      duration: 0.55,
      ease: "power3.out",
      delay: animIndex * 0.07,
    });
  }, []);

/* open / close accordion */
useEffect(() => {
  if (!bodyRef.current) return;
  const el = bodyRef.current;

  if (!didMount.current) {
    if (isOpen) {
      // initialise open immediately — no animation
      gsap.set(el, { height: "auto", opacity: 1, paddingBottom: 20 });
    } else {
      // initialise closed — no animation
      gsap.set(el, { height: 0, opacity: 0, paddingBottom: 0 });
    }
    didMount.current = true;
    return;
  }

  if (isOpen) {
    gsap.set(el, { height: "auto", opacity: 1, paddingBottom: "20px" });
    const h = el.offsetHeight;
    gsap.from(el, {
      height: 0,
      opacity: 0,
      paddingBottom: 0,
      duration: 0.38,
      ease: "power3.out",
    });
    gsap.to(el, { height: h, opacity: 1, paddingBottom: 20, duration: 0.38, ease: "power3.out" });
  } else {
    gsap.to(el, {
      height: 0,
      opacity: 0,
      paddingBottom: 0,
      duration: 0.3,
      ease: "power2.in",
    });
  }
}, [isOpen]);

  /* icon rotation */
useEffect(() => {
  if (!iconRef.current) return;
  // set immediately on mount (no didMount guard), animate on subsequent changes
  if (!didMount.current) {
    gsap.set(iconRef.current, { rotation: isOpen ? 180 : 0 });
    return;
  }

  gsap.to(iconRef.current, {
    rotation: isOpen ? 180 : 0,
    duration: 0.3,
    ease: "power2.inOut",
  });
}, [isOpen]);

  /* hover micro-interactions */
  const onEnter = () => {
    if (isOpen) return;
    gsap.to(questionRef.current, { x: 4, duration: 0.2, ease: "power1.out" });
    gsap.to(iconRef.current,     { scale: 1.15, duration: 0.2, ease: "power1.out" });
};

  const onLeave = () => {
    gsap.to(questionRef.current, { x: 0, duration: 0.2, ease: "power1.in" });
    gsap.to(iconRef.current,     { scale: 1, duration: 0.2, ease: "power1.in" });
  };

  /* click ripple on the button */
  const onPress = () => {
    gsap.timeline()
      .to(rowRef.current, { scaleX: 0.995, duration: 0.08, ease: "power1.in" })
      .to(rowRef.current, { scaleX: 1,     duration: 0.25, ease: "elastic.out(1,0.5)" });
  };

  return (
    <div ref={rowRef} className="border-b border-slate-200 origin-left">
      <button
        onClick={() => { onPress(); onToggle(); }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="w-full flex items-center justify-between gap-4 py-5 sm:py-6 text-left cursor-pointer"
      >
        <span
          ref={questionRef}
          className={`text-sm sm:text-[15px] heading font-semibold leading-snug transition-colors duration-200 ${
            isOpen ? "text-slate-900" : "text-slate-700"
          }`}
          style={{ color: isOpen ? "#1A6FC4" : undefined }}
        >
          {faq.question}
        </span>

        <span
          ref={iconRef}
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200"
          style={{
            backgroundColor: isOpen ? "#EFF6FC" : "#F1F5F9",
            color: isOpen ? "#1A6FC4" : "#64748B",
          }}
        >
          {isOpen ? <Minus size={15} /> : <Plus size={15} />}
        </span>
      </button>

      {/* answer body — height animated by GSAP, overflow hidden always */}
      <div
        ref={bodyRef}
        style={{ overflow: "hidden", height: 0, opacity: 0 }}
      >
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-[860px]">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   FaqSection
───────────────────────────────────────── */
export default function FaqSection({
  className = "",
  faqs = DEFAULT_FAQS,
  title = "FAQs",
  subtitle = "Choose Water Purifier that best suits your needs & budget",
  defaultOpenIndex = 0,
}) {
  const initialOpenId =
    faqs.length > 0 && faqs[defaultOpenIndex] ? faqs[defaultOpenIndex].id : null;

  const [openId, setOpenId] = useState(initialOpenId);

  const headerRef  = useRef(null);
  const sectionRef = useRef(null);

  /* header entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current.children, {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.55,
        ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const toggle = useCallback(
    (id) => setOpenId((prev) => (prev === id ? null : id)),
    []
  );

  if (!faqs || faqs.length === 0) return null;

  return (
    <section ref={sectionRef} className={`bg-white ${className}`}>
      <div className="primary-container">

        {/* Header */}
        <div ref={headerRef} className="mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-[2rem] font-semibold heading text-slate-900 leading-tight mb-1.5">
            {title}
          </h2>
          {subtitle && (
            <p className="text-slate-500 text-xs sm:text-sm">{subtitle}</p>
          )}
        </div>

        {/* Accordion */}
        <div>
          <div className="border-t border-slate-200" />
          {faqs.map((faq, idx) => (
            <FaqItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => toggle(faq.id)}
              animIndex={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}