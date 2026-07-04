// @refresh reset
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import banner1 from "../assets/ro_banner_1.png";
import Breadcrumb from "../components/Breadcrumb";
import ro_img_1 from "../assets/ro_banner.jpg";
import ro_img_2 from "../assets/ro_bg_1.png";
import ro_img_3 from "../assets/ro_bg_2.png";
import PdfDownloadSection from "../components/DownloadPdf";
import FaqSection from "../components/FaqSection";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─────────────────────────────────────────────
   CARD STYLES
───────────────────────────────────────────── */
const CARD_STYLES = [
  {
    align: "right",
    theme: "light",
    overlayGradient:
      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 42%, rgba(255,255,255,0.94) 100%)",
  },
  {
    align: "left",
    theme: "dark",
    overlayGradient:
      "linear-gradient(90deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.72) 42%, rgba(10,10,10,0) 100%)",
  },
  {
    align: "right",
    theme: "dark",
    overlayGradient: null,
  },
];

const defaultCardsData = [
  {
    id: 1,
    image: ro_img_1,
    title: "Customized RO Solutions",
    description:
      "Well-designed and customized RO plants suitable for different source water applications.",
    buttonText: "Enquire Now",
  },
  {
    id: 2,
    image: ro_img_2,
    title: "High Performance Filtration",
    description:
      "Advanced filtration modules help remove suspended particles, dissolved impurities, organic impurities, hardness, and unwanted contaminants.",
    buttonText: "Enquire Now",
  },
  {
    id: 3,
    image: ro_img_3,
    title: "Customized RO Solutions",
    description:
      "Well-designed and customized RO plants suitable for different source water applications.",
    buttonText: "Enquire Now",
  },
];

/* ─────────────────────────────────────────────
   INDUSTRIAL SECTION
───────────────────────────────────────────── */
function IndustrialWaterPurificationSection({ cardsData = defaultCardsData }) {
  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="primary-container w-full">
        <h2 className="mb-6 sm:mb-8 lg:mb-10 heading text-2xl sm:text-3xl lg:max-w-lg font-semibold text-gray-900 leading-snug">
          Reliable Industrial Water Purification Technology
        </h2>
      </div>

      <div className="w-full space-y-5 sm:space-y-6 lg:space-y-8">
        {cardsData.map((item, i) => {
          const style = CARD_STYLES[i % CARD_STYLES.length];
          const card = { ...item, ...style };

          return (
            <div
              key={card.id}
              className="relative w-full aspect-[4/5] sm:aspect-[16/8] lg:aspect-[16/6] overflow-hidden"
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {card.overlayGradient && (
                <div
                  className="absolute inset-0"
                  style={{ background: card.overlayGradient }}
                />
              )}

              <div
                className={`relative z-10 h-full flex items-center px-6 sm:px-10 lg:px-14 ${
                  card.align === "left" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className="max-w-[280px] sm:max-w-sm text-left"
                  style={
                    !card.overlayGradient
                      ? { textShadow: "0 1px 3px rgba(0,0,0,0.55), 0 1px 8px rgba(0,0,0,0.35)" }
                      : undefined
                  }
                >
                  <h1
                    className={`font-semibold heading ${
                      card.theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                    style={{ fontSize: "25px" }}
                  >
                    {card.title}
                  </h1>
                  <p
                    className={`mt-2 text-xs sm:text-sm leading-relaxed ${
                      card.theme === "dark" ? "text-gray-200" : "text-gray-600"
                    }`}
                  >
                    {card.description}
                  </p>
                  <button className="mt-4 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#0061C2] text-white text-xs sm:text-sm font-semibold rounded-full transition-colors">
                    {card.buttonText}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FILTRATION TABS
───────────────────────────────────────────── */
const TABS = [
  {
    id: "standard",
    label: "Standard Filtration Module",
    rows: [
      { label: "Skid", description: "MS / SS. quality skid to mount the whole system" },
      { label: "Feed Pump", description: "For Pressurized Feed of RAW water" },
      { label: "Sand Filter", description: "Removes suspended particles." },
      { label: "Activate Carbon Filter", description: "Removes heavy organic impurities and dissolved gases" },
      { label: "Activate Scalant System", description: "Anti safe of hardness, iron and silica" },
      { label: "Micron Filter", description: "Removes 5 micron impurity from RAW Water" },
      { label: "High Pressure Pump", description: "Create Osmotic pressure of Water" },
      { label: "Membrane", description: "Reject total dissolved Solids up to 0.0001 micron size" },
      { label: "Final Polishing Filter", description: "Enhances taste & maintain pH Value of Water" },
      { label: "Electric Panel", description: "Fully automatic Controlling Board" },
      { label: "Pipeline", description: "CPVC 55 as a model type to route a water flow" },
      { label: "Equipment", description: "LP, HP, Pressure Gauge, Flow Meter, Control Valve, CIP System etc." },
    ],
  },
  {
    id: "optional",
    label: "Optional Modules",
    rows: [
      { label: "UV Sterilizer", description: "Disinfects water using ultraviolet light" },
      { label: "Ozone System", description: "Additional oxidation for taste and odor control" },
      { label: "Remote Monitoring", description: "Track system performance over the network" },
      { label: "Booster Pump", description: "Boosts pressure for larger distribution networks" },
    ],
  },
];

function FiltrationModuleSection() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const activeIndex = TABS.findIndex((t) => t.id === activeTab);
  const activeRows = TABS[activeIndex]?.rows ?? [];

  const tabRefs = useRef([]);
  const [highlight, setHighlight] = useState({ left: 0, width: 0 });

  const recalcHighlight = () => {
    const el = tabRefs.current[activeIndex];
    if (el) setHighlight({ left: el.offsetLeft, width: el.offsetWidth });
  };

  useLayoutEffect(() => {
    recalcHighlight();
  }, [activeIndex]);

  useEffect(() => {
    window.addEventListener("resize", recalcHighlight);
    window.addEventListener("orientationchange", recalcHighlight);
    return () => {
      window.removeEventListener("resize", recalcHighlight);
      window.removeEventListener("orientationchange", recalcHighlight);
    };
  }, [activeIndex]);

  return (
    <section className="w-full">
      <div className="primary-container w-full">
        <div className="relative border-b border-gray-100 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="relative flex w-max min-w-full">
            <div
              className="absolute top-0 bottom-0 bg-[#E9F4FF] rounded-md transition-all duration-300 ease-out"
              style={{ left: highlight.left, width: highlight.width }}
            />
            {TABS.map((tab, i) => (
              <button
                key={tab.id}
                ref={(el) => (tabRefs.current[i] = el)}
                onClick={() => setActiveTab(tab.id)}
                className={`relative cursor-pointer heading z-10 px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold whitespace-nowrap transition-colors duration-300 ${
                  activeTab === tab.id ? "text-[#0061C2]" : "text-gray-900 hover:text-[#0061C2]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div key={activeTab} className="animate-[tabFadeIn_0.25s_ease-out]">
          {activeRows.map((row, i) => (
            <div
              key={row.label}
              className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 px-2 sm:px-0 py-4 sm:py-5 rounded-md transition-colors hover:bg-gray-50 border-b border-gray-100"
            >
              <div className="w-full sm:w-[45%] md:w-[300px] lg:w-[320px] shrink-0 text-sm sm:text-base font-medium text-gray-900">
                {row.label}
              </div>
              <div className="text-sm sm:text-base text-gray-500 leading-relaxed">
                {row.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION DATA
───────────────────────────────────────────── */
const sectionData = {
  title: "Aqualife Ever Commercial RO Plant",
  shortDescription:
    "Transform hard water into soft, usable water and protect your family, fixtures, appliances, and everyday comfort.",
  description: [
    "Aqualife Ever Commercial RO Systems are specially designed to provide pure, fresh, clean, and safe drinking water for corporate sectors, hotels, banks, restaurants, schools, colleges, hospitals, and other commercial spaces.",
    "Our advanced RO plants deliver high-quality purified water with efficient performance and economical operation. Designed with energy-saving technology, these systems ensure reliable water purification while reducing power consumption and operational costs.",
    "Available in multiple capacities, Aqualife Ever Commercial RO Plants provide customized solutions according to customer requirements.",
  ],
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const ROPlant = () => {
  const heroData = {
    image: banner1,
    alt: "Industrial RO Plant",
    gradient:
      "linear-gradient(80deg, #030C2B 15.44%, #1B2852 43.12%, rgba(27, 40, 82, 0) 70.92%)",
    title: "Industrial RO Plants For Pure Water Performance",
    description: "Customized RO Solutions Designed For Reliable Industrial Water Treatment.",
  };

  /* ── Hero animation refs ── */
  const heroWrapRef     = useRef(null);
  const heroImgRef      = useRef(null);
  const heroGradientRef = useRef(null);
  const heroTitleRef    = useRef(null);
  const heroDescRef     = useRef(null);
  const breadcrumbRef   = useRef(null);

  /* ── Hero entrance animation ── */
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl
        /* image zooms from 1.12 → 1 */
        .fromTo(
          heroImgRef.current,
          { scale: 1.12, transformOrigin: "center center" },
          { scale: 1, duration: 1.8 }
        )
        /* gradient fades in */
        .fromTo(
          heroGradientRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.1 },
          "-=1.5"
        )
        /* breadcrumb drops in */
        .fromTo(
          breadcrumbRef.current,
          { y: -16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.9"
        )
        /* title rises */
        .fromTo(
          heroTitleRef.current,
          { y: 44, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          "-=0.6"
        )
        /* description follows */
        .fromTo(
          heroDescRef.current,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75 },
          "-=0.45"
        );
    }, heroWrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="min-h-screen">

      {/* ── Hero banner ── */}
      <div
        ref={heroWrapRef}
        className="relative w-full aspect-[4/6] sm:aspect-[16/10] lg:aspect-[1440/700] overflow-hidden"
      >
        {/* Image */}
        <img
          ref={heroImgRef}
          src={heroData.image}
          alt={heroData.alt}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient overlay */}
        <div
          ref={heroGradientRef}
          className="absolute inset-0"
          style={{ background: heroData.gradient }}
        />

        {/* Breadcrumb */}
        <div
          ref={breadcrumbRef}
          className="absolute top-4 lg:top-33 left-0 w-full z-20"
        >
          <div className="primary-container">
            <Breadcrumb />
          </div>
        </div>

        {/* Text content */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="primary-container w-full">
            <div className="max-w-[500px] pt-10 sm:pt-14 lg:pt-40">
              <h1
                ref={heroTitleRef}
                className="font-semibold heading text-white leading-[1.15] text-[clamp(1.6rem,4.2vw,2.6rem)]"
              >
                {heroData.title}
              </h1>
              <p
                ref={heroDescRef}
                className="mt-4 sm:mt-5 max-w-[360px] text-gray-300 text-[clamp(0.9rem,1.4vw,1.3rem)] leading-relaxed"
              >
                {heroData.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Header text block ── */}
      <div className="text-center mt-5 sm:mt-10 lg:mt-10 lg:py-8">
        <h1 className="text-3xl sm:text-4xl heading font-semibold text-gray-900 tracking-tight">
          {sectionData.title}
        </h1>
        <p className="mt-3 text-base sm:text-md font-medium text-gray-600 max-w-3xl mx-auto">
          {sectionData.shortDescription}
        </p>
        <p className="mt-6 text-sm text-gray-500 leading-relaxed max-w-4xl mx-auto">
          {sectionData.description[0]}
        </p>
        <p className="mt-1 text-sm text-gray-500 leading-relaxed max-w-4xl mx-auto">
          {sectionData.description[1]}
        </p>
        <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto">
          {sectionData.description[2]}
        </p>
      </div>

      <IndustrialWaterPurificationSection />
      <FiltrationModuleSection />
      <PdfDownloadSection />
      <FaqSection />

    </section>
  );
};

export default ROPlant;