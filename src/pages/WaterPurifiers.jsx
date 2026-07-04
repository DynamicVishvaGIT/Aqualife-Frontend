import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import banner1 from "../assets/product_listing_banner.png";
import ProductListing from "../components/ProductListing";
import AlkalineWaterBanner from "../components/AlkalineWaterBanner";
import FaqSection from "../components/FaqSection";
import Breadcrumb from "../components/Breadcrumb";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

    // Safety net: recalc ScrollTrigger positions once everything (fonts/images) has settled
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
        className="relative w-full overflow-hidden
      aspect-[4/5]
      sm:aspect-[16/10]
      lg:aspect-[1440/572]"
      >
        <img
          src={banner1}
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

      {/* faq */}
      <FaqSection className="py-10" />
    </main>
  );
};

export default WaterPurifiers;
