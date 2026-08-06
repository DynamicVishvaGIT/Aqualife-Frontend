import Breadcrumb from "../components/Breadcrumb";
import banner1 from "../assets/softer_img_2.webp";
import softer_img_3 from "../assets/softer_img_1.jpg";
import softer_img_2 from "../assets/softer_img-3.jpg";
import softer_img_1 from "../assets/softer_img-5.jpg";
import pup from "../assets/softer_img-4.png";
import banner_2 from "../assets/softer_img-6.png";
import React, { useRef, useState, useCallback, useEffect, useLayoutEffect } from "react";
import DownloadPdf from "../components/DownloadPdf";
import FaqSection from "../components/FaqSection";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WaterPurifierInfo from "../components/WaterPurifierInfo";

gsap.registerPlugin(ScrollTrigger);

// Respect users who've asked for less motion
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const cards = [
  {
    id: 1,
    image: softer_img_1,
    alt: "Woman brushing her hair",
    badge: {
      eyebrow: "The",
      title: "End of",
      highlight: "hair loss",
      suffix: "days!",
    },
    captionBelow: "Prevents hair & skin damage",
  },
  {
    id: 2,
    image: softer_img_2,
    alt: "Limescale buildup on a bathroom faucet",
    overlayText: "Prevents damage of bathroom fittings & appliances",
  },
  {
    id: 3,
    image: softer_img_3,
    alt: "Water droplets on a clean blue shirt",
  },
];

const sectionData = {
  title: "Aqualife Water Softener",
  shortDescription:
    "Transform hard water into soft, usable water and protect your family, fixtures, appliances, and everyday comfort.",

  description: [
    "The Aqualife Ever Water Softener is an effective solution for tackling hard water problems in residential, commercial, and institutional applications. By reducing hardness-causing minerals, it helps deliver softer water that is kinder to your skin and hair while protecting bathroom fittings, plumbing systems, and appliances from scale buildup.",

    "Enjoy the benefits of soft water every day and experience improved comfort, better water quality, and enhanced protection for your valuable assets."
  ],

  subTitle:
    "Enjoy the Goodness of Soft Water with Aqualife Ever Water Softeners.",
};

function SoftenerAqualifetSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const subTitleRef = useRef(null);
  const cardsWrapRef = useRef(null);
  const cardRefs = useRef([]);
  const imageRefs = useRef([]);

  cardRefs.current = [];
  imageRefs.current = [];

  const addCardRef = (el) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };
  const addImageRef = (el) => {
    if (el && !imageRefs.current.includes(el)) imageRefs.current.push(el);
  };

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Header block: heading -> short desc -> paragraphs, staggered
      gsap.from(headerRef.current.children, {
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 78%",
        },
      });

      // Sub-heading
      gsap.from(subTitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: subTitleRef.current,
          start: "top 82%",
        },
      });

      // Cards: scale + fade stagger
      gsap.from(cardRefs.current, {
        y: 50,
        opacity: 0,
        scale: 0.94,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardsWrapRef.current,
          start: "top 82%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleImgEnter = (img) => {
    gsap.to(img, { scale: 1.08, duration: 0.6, ease: "power2.out" });
  };
  const handleImgLeave = (img) => {
    gsap.to(img, { scale: 1, duration: 0.6, ease: "power2.out" });
  };

  return (
    <section ref={sectionRef} className="w-full bg-white py-12 sm:py-16">
      <div className="primary-container">
        {/* ---------- Header ---------- */}
        <div ref={headerRef} className="text-center">
          <h1 className="text-3xl sm:text-4xl heading font-semibold text-gray-900 tracking-tight">
            {sectionData.title}
          </h1>

          <p className="mt-3 text-base sm:text-md font-medium text-gray-600 max-w-3xl mx-auto">
            {sectionData.shortDescription}
          </p>

          <p className="mt-6 text-sm text-gray-500 leading-relaxed max-w-4xl mx-auto">
            {sectionData.description[0]}
          </p>

          <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-4xl mx-auto">
            {sectionData.description[1]}
          </p>
        </div>

        {/* ---------- Sub-heading ---------- */}
        <h2
          ref={subTitleRef}
          className="mt-14 sm:mt-16 heading text-2xl sm:text-3xl font-semibold text-gray-900 leading-snug max-w-2xl"
        >
          {sectionData.subTitle}
        </h2>

        {/* ---------- Cards ---------- */}
        <div
          ref={cardsWrapRef}
          className="mt-8 grid relative grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-4 lg:gap-5"
        >
          {cards.map((card) => (
            <figure ref={addCardRef} key={card.id} className="flex flex-col">
              <div
                className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-md overflow-hidden bg-gray-100"
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector("img");
                  if (img) handleImgEnter(img);
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector("img");
                  if (img) handleImgLeave(img);
                }}
              >
                <img
                  ref={addImageRef}
                  src={card.image}
                  alt={card.alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover will-change-transform"
                />

                {/* Overlay Text (Cards 2 & 3) */}
                <div
                  className={`absolute inset-0 flex items-end ${
                    card.id === 2 || card.id === 1
                      ? "bg-gradient-to-t from-black/60 via-black/10 to-transparent"
                      : ""
                  }`}
                >
                  <p className="text-white text-base sm:text-2xl text-start lg:max-w-[300px] font-semibold leading-snug mb-5 sm:p-5">
                    {card.overlayText}
                  </p>
                </div>
              </div>

              {(card.id === 1 || card.id === 2) && (
                <figcaption className="py-4 text-center heading text-lg sm:text-xl font-semibold text-gray-900">
                  {card.captionBelow}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * WhyChooseAqualife
 */
const features = [
  "The Ultimate Solution for Hard Water Problems",
  "Revolutionary Resin Technology",
  "Automatic Operation",
  "Splash-Proof LED Display",
  "Safe for Daily Use",
  "Protects Skin and Hair",
  "Extends Appliance Life",
  "Reduces Hard Water Scaling",
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 sm:w-[18px] sm:h-[18px] flex-shrink-0"
    >
      <path
        d="M16.667 5L7.5 14.167 3.333 10"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhyChooseAqualife() {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const listRef = useRef(null);
  const itemRefs = useRef([]);

  itemRefs.current = [];
  const addItemRef = (el) => {
    if (el && !itemRefs.current.includes(el)) itemRefs.current.push(el);
  };

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Entrance zoom-out on the background image
      gsap.fromTo(
        imgRef.current,
        { scale: 1.15 },
        {
          scale: 1,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        }
      );

      // Continuous parallax drift while scrolling through the section
      gsap.to(imgRef.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Heading + sub copy
      gsap.from([headingRef.current, subRef.current], {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      // Checklist items: slide in + check icon pop
      itemRefs.current.forEach((item) => {
        const icon = item.querySelector("svg");
        gsap.from(item, {
          x: -24,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 85%",
          },
        });
        if (icon) {
          gsap.from(icon, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            delay: 0.15,
            ease: "back.out(3)",
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 85%",
            },
          });
        }
      });

      // Stagger the checklist entrance timing item by item
      gsap.utils.toArray(itemRefs.current).forEach((item, i) => {
        gsap.set(item, { delay: i * 0.08 });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
  <section
    ref={sectionRef}
    className="relative min-h-[800px] w-full overflow-hidden"
  >
    {/* Background Image */}
    <img
      ref={imgRef}
      loading="lazy"
      src={banner_2}
      alt="Aqualife water softener installed on a rooftop"
      className="absolute inset-0 h-full w-full object-cover will-change-transform"
    />


    {/* Content */}
    <div className="relative z-10 flex min-h-[800px] items-center">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-xl text-center lg:text-left">
            <h2
              ref={headingRef}
              className="heading text-4xl font-semibold leading-tight text-white sm:text-4xl lg:text-4xl"
            >
              Why Choose Aqualife Ever?
            </h2>

            <p
              ref={subRef}
              className="mt-4 text-base text-gray-200 sm:text-lg"
            >
              The Ultimate Solution for Hard Water Problems
            </p>

            <ul
              ref={listRef}
              className="mt-8 space-y-4 text-left"
            >
              {features.map((item) => (
                <li
                  key={item}
                  ref={addItemRef}
                  className="flex items-center gap-3 text-base text-white"
                >
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);
}

/**
 * AutoTechnicalSpecification
 */
const rows = [
  {
    label: "Parameter",
    values: [
      "1000 l/hr", "2000 l/hr", "3000 l/hr", "6000 l/hr", "6000 l/hr",
      "6000 l/hr", "6000 l/hr", "6000 l/hr", "6000 l/hr", "6000 l/hr",
      "6000 l/hr", "6000 l/hr",
    ],
  },
  {
    label: "Water Flow",
    values: [
      "1000 l/hr", "2000 l/hr", "3000 l/hr", "6000 l/hr", "6000 l/hr",
      "6000 l/hr", "6000 l/hr", "6000 l/hr", "6000 l/hr", "6000 l/hr",
      "6000 l/hr", "6000 l/hr",
    ],
  },
  {
    label: "Inlet Water Pressure",
    values: [
      "1.5 to 3.5 kg/cm²",
      "1.5 to 3.5 kg/cm²",
      "1.5 to 3.5 kg/cm²",
      "1.5 to 3.5 kg/cm²",
      "1.5 to 3.5 kg/cm²",
      "1.5 to 3.5 kg/cm²",
      "1.5 to 3.5 kg/cm²",
      "1.5 to 3.5 kg/cm²",
    ],
  },
  {
    label: "Inlet Max Hardness (As CaCO₃)",
    values: [
      "800 ppm (parts per million)",
      "800 ppm (parts per million)",
      "800 ppm (parts per million)",
      "800 ppm (parts per million)",
    ],
  },
  {
    label: "Treated Water Hardness (As CaCO₃)",
    values: ["<50 ppm", "<50 ppm", "<50 ppm", "<50 ppm"],
  },
  {
    label: "Inlet/Outlet Connection Size",
    values: ["1 inch", "1 inch", "1 inch", "1 inch"],
  },
  { label: "Drain Line", values: ["0.5 inch", "0.5 inch", "0.5 inch", "0.5 inch"] },
  {
    label: "Electric Supply",
    values: [
      "230 V AC / 6 amp - 1 point Electric",
      "230 V AC / 6 amp - 1 point Electric",
      "230 V AC / 6 amp - 2 Points Electric",
      "230 V AC / 6 amp - 2 Points Electric",
    ],
  },
  { label: "Resin Quantity", values: ["", "", "45 litres", "90 litres"] },
  {
    label: "Installation Footprint",
    values: ["Table top", "Table top", "Area Occupied 4 X 5 Ft", "Area Occupied 4 X 5 Ft"],
  },
  {
    label: "Process Valve",
    values: [
      "Fully Automatic Programmable",
      "Fully Automatic Programmable",
      "Fully Automatic Programmable",
      "Fully Automatic Programmable",
    ],
  },
  { label: "Salt per Recharge in kgs", values: ["2", "4", "7", "14"] },
];

function AutoTechnicalSpecification() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const scrollRef = useRef(null);
  const trackRef = useRef(null);
  const [thumb, setThumb] = useState({ left: 0, width: 100 });
  const [isOverflowing, setIsOverflowing] = useState(false);

  const dragState = useRef({ dragging: false, startX: 0, startScrollLeft: 0 });

  const updateThumb = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    if (scrollWidth <= clientWidth + 1) {
      setIsOverflowing(false);
      setThumb({ left: 0, width: 100 });
      return;
    }
    setIsOverflowing(true);
    const widthPct = (clientWidth / scrollWidth) * 100;
    const leftPct = (scrollLeft / scrollWidth) * 100;
    setThumb({ left: leftPct, width: widthPct });
  }, []);

  useEffect(() => {
    updateThumb();
    window.addEventListener("resize", updateThumb);
    return () => window.removeEventListener("resize", updateThumb);
  }, [updateThumb]);

  // Scroll-triggered entrance for heading + table rows
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
        },
      });

      const trs = scrollRef.current
        ? gsap.utils.toArray(scrollRef.current.querySelectorAll("tbody tr"))
        : [];

      gsap.from(trs, {
        opacity: 0,
        y: 18,
        duration: 0.6,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: {
          trigger: scrollRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const onThumbPointerDown = useCallback((e) => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
    };
    e.target.setPointerCapture?.(e.pointerId);
    gsap.to(e.target, { scaleY: 1.6, duration: 0.15, ease: "power2.out" });
  }, []);

  const onThumbPointerMove = useCallback(
    (e) => {
      if (!dragState.current.dragging) return;
      const el = scrollRef.current;
      const track = trackRef.current;
      if (!el || !track) return;

      const scrollableWidth = el.scrollWidth - el.clientWidth;
      const thumbWidthPx = (thumb.width / 100) * track.clientWidth;
      const movableTrackPx = track.clientWidth - thumbWidthPx;
      if (movableTrackPx <= 0 || scrollableWidth <= 0) return;

      const deltaX = e.clientX - dragState.current.startX;
      const scrollDelta = deltaX * (scrollableWidth / movableTrackPx);
      let newScrollLeft = dragState.current.startScrollLeft + scrollDelta;
      newScrollLeft = Math.max(0, Math.min(scrollableWidth, newScrollLeft));

      el.scrollLeft = newScrollLeft;
      updateThumb();
    },
    [thumb.width, updateThumb]
  );

  const onThumbPointerUp = useCallback((e) => {
    dragState.current.dragging = false;
    e.target.releasePointerCapture?.(e.pointerId);
    gsap.to(e.target, { scaleY: 1, duration: 0.2, ease: "power2.out" });
  }, []);

  const onTrackPointerDown = useCallback(
    (e) => {
      if (e.target !== trackRef.current) return;
      const el = scrollRef.current;
      const track = trackRef.current;
      if (!el || !track) return;

      const rect = track.getBoundingClientRect();
      const clickPct = (e.clientX - rect.left) / rect.width;
      const scrollableWidth = el.scrollWidth - el.clientWidth;
      el.scrollLeft = Math.max(0, Math.min(scrollableWidth, clickPct * el.scrollWidth));
      updateThumb();
    },
    [updateThumb]
  );

  return (
    <section ref={sectionRef} className="w-full bg-[#F6FAFF]  py-8 sm:py-10">
      <div className="primary-container bg-[#F6FAFF] rounded-2xl">
        <h2 ref={headingRef} className="text-xl sm:text-2xl heading font-bold text-gray-900 mb-5 sm:mb-6">
          Auto Technical Specification
        </h2>

        <div
          ref={scrollRef}
          onScroll={updateThumb}
          className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <table className="w-full border-collapse">
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={i !== rows.length - 1 ? "border-b border-[#626C7A24]" : ""}
                >
                  <td className="sticky left-0 z-10 bg-[#F6FAFF] py-4 pr-4 align-top text-sm font-medium text-gray-900 w-[170px] sm:w-[220px] min-w-[170px] sm:min-w-[220px] whitespace-normal">
                    {row.label}
                  </td>
                  {row.values.map((val, j) => (
                    <td
                      key={j}
                      className="py-4 pr-6 align-top text-sm text-gray-500 w-[170px] sm:w-[200px] min-w-[170px] sm:min-w-[200px] whitespace-normal"
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isOverflowing && (
          <div
            ref={trackRef}
            onPointerDown={onTrackPointerDown}
            className="mt-6 h-1.5 w-full rounded-full bg-gray-200 relative cursor-pointer touch-none select-none"
          >
            <div
              onPointerDown={onThumbPointerDown}
              onPointerMove={onThumbPointerMove}
              onPointerUp={onThumbPointerUp}
              onPointerCancel={onThumbPointerUp}
              className="absolute top-0 h-full rounded-full bg-[#0061C2] cursor-grab active:cursor-grabbing touch-none"
              style={{
                width: `${thumb.width}%`,
                left: `${thumb.left}%`,
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

const pageData = {
  hero: {
    image: banner1,
    alt: "Water Softener Banner",
    gradient:
      "linear-gradient(100deg, #F5F1E5 20.44%, rgba(245, 241, 229, 0.96) 40.12%, rgba(245, 241, 229, 0) 50.92%)",
    title: "Hard Water Can Be\nHard On You",
    description:
      "Enjoy the Goodness of Soft Water with Aqualife Ever Water Softeners.",
    descriptionColor: "#955834",
  },
};

/* ── What Is Hard Water + How to Choose (content only, icons untouched) ── */
const softenerInfoContent = {
  eyebrow: "Understanding Hard Water",
  heroTitle: "What Is Hard Water and Why Is It a Problem?",
  heroImageAlt: "Aqualife water softener treating hard water",
  paragraphs: [
    "Many homes, apartments, hotels, hospitals, and commercial facilities receive hard water containing high levels of calcium and magnesium minerals. While hard water is generally safe to use, it can create several challenges for plumbing systems, appliances, and everyday water usage.",
    "Hard water often leads to scale buildup inside pipes, water heaters, taps, showers, and other equipment. Over time, this buildup can reduce efficiency, increase maintenance requirements, and shorten the lifespan of appliances.",
    "A water softener is designed to reduce hardness-causing minerals from water, helping improve overall water quality for residential and commercial use. By treating hard water before it enters your plumbing system, a water softener helps minimize scale formation and supports the efficient operation of water-using equipment.",
    "Softened water can also improve the performance of water heaters, washing machines, dishwashers, and other appliances.",
  ],
  sectionTitle: "How to Choose the Right Water Softener?",
  sectionSubtitle:
    "Choosing the right water softener depends on water hardness levels, daily water consumption, application type, and the number of users. Understanding these factors can help ensure effective hard water treatment and long-term performance.",
};

// reusing only the icons already registered in WaterPurifierInfo's ICON_MAP
// (Droplet, Waves, Layers, Users) — no new icons added
const softenerInfoCards = [
  {
    icon: "Droplet",
    title: "Based on Water Hardness Level",
    body: "The hardness level of your water is one of the most important factors when selecting a water softener. Water testing can help determine the concentration of hardness-causing minerals and identify the most suitable softening solution.",
  },
  {
    icon: "Layers",
    title: "Based on Residential or Commercial Usage",
    body: "Different water softeners are designed for residential, commercial, and industrial applications. Homes typically require compact systems, while hotels, hospitals, and commercial facilities may need larger-capacity water softening systems to handle higher water consumption.",
  },
  {
    icon: "Users",
    title: "Based on Daily Water Consumption",
    body: "The daily water requirement of a household or facility helps determine the capacity of the water softener. Choosing the right capacity ensures consistent soft water availability without affecting system performance.",
  },
  {
    icon: "Waves",
    title: "Based on Plumbing and Equipment Protection",
    body: "If hard water is causing scale buildup in pipelines, boilers, water heaters, or appliances, selecting a water softener with the appropriate treatment capacity can help support better system efficiency and equipment longevity.",
  },
  {
    icon: "Layers",
    title: "Based on Installation Requirements",
    body: "Water softeners are available in different sizes and configurations. The available installation space, water flow rate, and application requirements should be considered when selecting the right system.",
  },
];

const WaterSofteners = () => {
  const heroWrapRef = useRef(null);
  const heroImgRef = useRef(null);
  const heroGradientRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroDescRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        heroImgRef.current,
        { scale: 1.15 },
        { scale: 1, duration: 1.6 }
      )
        .fromTo(
          heroGradientRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1 },
          "-=1.3"
        )
        .fromTo(
          heroTitleRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          "-=0.9"
        )
        .fromTo(
          heroDescRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.5"
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
    <div>
      {/* Hero Banner */}
      <div
        ref={heroWrapRef}
        className="relative w-full overflow-hidden pt-20 lg:pt-20
aspect-[4/6]
sm:aspect-[16/10]
lg:aspect-[1440/700]"
      >
        <img
          ref={heroImgRef}
          src={pageData.hero.image}
          alt={pageData.hero.alt}
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
        />

        <div
          ref={heroGradientRef}
          className="absolute inset-0"
          style={{
            background: pageData.hero.gradient,
          }}
        />

        {/* Breadcrumb */}
        <div className="absolute top-4 lg:top-33 left-0 w-full z-20">
          <div className="primary-container">
            <Breadcrumb />
          </div>
        </div>

        {/* Left Content */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="primary-container w-full">
            <div className="max-w-[600px]">
              <h1
                ref={heroTitleRef}
                className="font-medium heading text-[#955934] leading-[1.1] text-[clamp(1.8rem,5vw,3rem)] whitespace-pre-line"
              >
                {pageData.hero.title}
              </h1>

              <p
                ref={heroDescRef}
                className="mt-5 max-w-[400px] text-[clamp(0.95rem,1.5vw,1rem)] text-[#955834] leading-relaxed"
              >
                {pageData.hero.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Other Sections */}
      <SoftenerAqualifetSection />
      <WhyChooseAqualife />
      <AutoTechnicalSpecification />

      {/* What is hard water + How to choose */}
      <WaterPurifierInfo
        // image={softer_img_1}
        content={softenerInfoContent}
        cards={softenerInfoCards}
      />

      <DownloadPdf />
      <FaqSection />
    </div>
  );
};

export default WaterSofteners;