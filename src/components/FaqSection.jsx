import { useState } from "react";
import { Plus, Minus } from "lucide-react";

// Default FAQs (used only if no `faqs` prop is passed)
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

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 sm:py-6 text-left cursor-pointer group"
      >
        <span
          className={`text-sm sm:text-[15px] heading font-semibold leading-snug transition-colors duration-200 ${
            isOpen ? "text-slate-900" : "text-slate-800 group-hover:text-slate-900"
          }`}
        >
          {faq.question}
        </span>
        <span className="shrink-0 text-[#155DFC]">
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </span>
      </button>

      <div
        className={`overflow-hidden max-w-[1100px] transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 pb-5 sm:pb-6 " : "max-h-0"
        }`}
      >
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export default function FaqSection({
  className = "",
  faqs = DEFAULT_FAQS,
  title = "FAQs",
  subtitle = "Choose Water Purifier that best suits your needs & budget",
  defaultOpenIndex = 0,
}) {
  const initialOpenId =
    faqs.length > 0 && faqs[defaultOpenIndex]
      ? faqs[defaultOpenIndex].id
      : null;

  const [openId, setOpenId] = useState(initialOpenId);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className={`bg-white ${className}`}>
      <div className="primary-container max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-[2rem] font-semibold heading text-slate-900 leading-tight mb-1.5">
            {title}
          </h2>
          {subtitle && (
            <p className="text-slate-500 text-xs sm:text-sm">{subtitle}</p>
          )}
        </div>

        {/* Accordion */}
        <div className="divide-y-0">
          {/* Top border */}
          <div className="border-t border-slate-200" />
          {faqs.map((faq) => (
            <FaqItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => toggle(faq.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}