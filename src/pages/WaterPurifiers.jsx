import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import banner1 from "../assets/product_listing_banner.png";
import ProductListing from "../components/ProductListing";
import AlkalineWaterBanner from "../components/AlkalineWaterBanner";
import FaqSection from "../components/FaqSection";
import Breadcrumb from "../components/Breadcrumb";
import WaterPurifierInfo from "../components/WaterPurifierInfo";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// content data lives here (page-level), not inside the component —
// this is what makes it "dynamic": swap this for an API/CMS response later
// without touching WaterPurifierInfo at all
const waterPurifierContent = {
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

const waterPurifierCards = [
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

const WaterPurifiers = () => {
  /* ── Experience section: heading + feature cards + pinned image ── */
  const heroWrapRef = useRef(null);
  const heroImgRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        heroImgRef.current,
        { scale: 1.15 },
        { scale: 1, duration: 1.6 },
      );
    }, heroWrapRef);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      ctx.revert();
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <main className="w-full overflow-x-hidden pt-20 lg:pt-20">
      {/* Hero Banner */}
      <div
        ref={heroWrapRef}
        loading="lazy"
        className="
      relative w-full overflow-hidden
      aspect-[4/5]
      sm:aspect-[16/10]
      lg:aspect-[1440/572]
      "
      >
        <img
          src={banner1}
          loading="lazy"
          ref={heroImgRef}
          alt="Water Cooler Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Breadcrumb */}
        <div className="absolute top-2 lg:top-14 left-0 w-full z-10">
          <div className="primary-container">
            <Breadcrumb />
          </div>
        </div>
      </div>

      {/* Product Listing */}
      <ProductListing />

      {/* Bottom Banner */}
      <AlkalineWaterBanner />

      {/* SEO Info Section: Why purify + how to choose */}
      <WaterPurifierInfo
        content={waterPurifierContent}
        cards={waterPurifierCards}
      />

      {/* faq */}
      <FaqSection className="py-10" />
    </main>
  );
};

export default WaterPurifiers;