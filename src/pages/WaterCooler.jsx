import React, { useLayoutEffect, useRef ,useEffect, useState} from "react";
import banner1 from "../assets/product_listing_banner.png";
import Breadcrumb from "../components/Breadcrumb";
import coller1 from "../assets/water-cooler_1.png";
import coller2 from "../assets/water-cooler_2.png";
import coller3 from "../assets/water-cooler_3.png";
import coller4 from "../assets/water-cooler_2.png";
import { WaterButton } from "../components/WaterButton";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Droplets, Database } from "lucide-react";
import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import coolerPeople from "../assets/water_cooler_banner_1.jpg";
import coolerSchool from "../assets/water_cooler_banner_2.jpg";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ── Mock products ── */
const PRODUCTS = [
  {
    id: 1,
    image: coller1,
    badge: "New launch",
    name: "Venus",
    description: "UV+UF+Copper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
  },
  {
    id: 2,
    image: coller2,
    badge: null,
    name: "Venus",
    description: "UV+UF+Copper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
  },
  {
    id: 3,
    image: coller3,
    badge: null,
    name: "Venus",
    description: "UV+UF+Copper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
  },
  {
    id: 4,
    image: coller2,
    badge: null,
    name: "Venus",
    description: "UV+UF+Copper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
  },
];

const COOLER_FEATURES = [
  {
    id: 1,
    title: "Advanced Inbuilt RO & UV Water Purification System",
    description:
      "Including RO & UV that inactivates all known disease-causing bacteria and viruses.",
    bg: "bg-[#FFF9F9]",
  },
  {
    id: 2,
    title: "Built-in Safety Feature",
    description:
      "In-built electronic monitoring system that stops the water flow if the purification is inadequate.",
    bg: "bg-[#F5F9FF]",
  },
  {
    id: 3,
    title: "Large Storage Capacity",
    description:
      "Ensures there is enough supply of water at all times with its 80 litres storage tank.",
    bg: "bg-[#FAFFF1]",
  },
  {
    id: 4,
    title: "Large Storage Capacity",
    description:
      "Ensures there is enough supply of water at all times with its 80 litres storage tank.",
    bg: "bg-[#F7FFE9]",
  },
  {
    id: 5,
    title: "Large Storage Capacity",
    description:
      "Ensures there is enough supply of water at all times with its 80 litres storage tank.",
    bg: "bg-[#F7FFE9]",
  },
];

// table data
const SPECS = [
  { label: "Model", value: "20/40/80/150/200 Ltr" },
  { label: "Storage Capacity", value: "20/40/80/150/200" },
  { label: "Cooling Capacity", value: "20/40/80/150/200" },
  { label: "Insulation", value: "PUF" },
  { label: "Input Voltage", value: "230v ±10%, 50Hz" },
  { label: "Power Rating", value: "5Amps | 7.5" },
  { label: "No. of Faucets", value: "2" },
  { label: "Tank Cleaning/ Remote", value: "Provided" },
  { label: "Compressor Watt", value: "2.0 Wat" },
  { label: "Compressor", value: "Hematic with suction gas cooled motor with overloaded protector" },
  { label: "Condenser Fan", value: "Propeller Type" },
  // additional rows revealed by "Show More"
  { label: "Refrigerant", value: "R134a (Eco-friendly)" },
  { label: "Body Material", value: "Mild Steel with Powder Coating" },
  { label: "Net Weight", value: "32 Kg" },
  { label: "Warranty", value: "1 Year Comprehensive" },
];
 


/* ── Product card ── */
function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white cursor-pointer rounded-2xl border border-slate-100 p-3 sm:p-5 flex flex-col h-full select-none justify-between"
      onClick={() => navigate("/product-details")}
    >
      <div className="relative  bg-white rounded-xl flex items-center justify-center h-25 sm:h-52 mb-3 sm:mb-4 overflow-hidden">
        {product.badge && (
          <span className="absolute top-1.5 left-1.5 z-10 bg-slate-100 text-slate-500 text-[10px] sm:text-[11px] font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
            {product.badge}
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain mix-blend-multiply"
          draggable={false}
        />
      </div>

      <div className="flex flex-col flex-1">
        <h3 className="text-[14px] sm:text-[15px] font-bold text-slate-900 leading-tight">
          {product.name}
        </h3>
        <p className="text-slate-400 text-[11px] sm:text-[13px] mt-0.5 mb-2 sm:mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="mb-3 sm:mb-4">
          <p className="text-lg sm:text-[22px] font-bold text-slate-900 leading-none mb-1">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[11px] sm:text-[13px]">
            <span className="text-slate-400">MRP</span>
            <span className="text-slate-400 line-through">
              ₹{product.mrp.toLocaleString("en-IN")}
            </span>
            <span className="text-green-500 font-semibold whitespace-nowrap">
              ({product.discount}% OFF)
            </span>
          </div>
        </div>
      </div>

      {/* Action row — optimized touch target sizing on mobile */}
      <div className="flex gap-1 mt-auto">
        <WaterButton
          variant="primary"
          className="flex-1 py-1 px-3 sm:py-2.5 text-[11px] sm:text-sm"
        >
          Book Demo
        </WaterButton>

        <button
          className="flex-1 text-slate-500 text-[8px] sm:text-sm border border-[#F0F3F6]
          rounded-full cursor-pointer hover:text-blue-600 hover:border-[#155DFC] font-medium transition-colors
          py-1 sm:py-2.5 px-2 sm:px-3"
        >
          View Detail
        </button>
      </div>
    </div>
  );
}

const VISIBLE_COUNT = 11;

// table
const ProductSpecTable = ({
  title = "Water Cooler – Inbuilt RO and UV Water Purifier",
  subtitle = "Available Capacity: 20 / 40 / 80 / 150 / 200 Ltr.",
  specs = SPECS,
}) => {

  const [expanded, setExpanded] = useState(false);
 
  const hasMore = specs.length > VISIBLE_COUNT;
  const visibleSpecs = expanded ? specs : specs.slice(0, VISIBLE_COUNT);
 
  return (
    <section className="bg-[#FFFFFF] py-8 sm:py-10">
      <div className="primary-container">
        {/* Heading */}
        <h2 className="heading text-xl sm:text-2xl lg:text-[28px] font-bold text-[#191919] leading-tight">
          {title}
        </h2>
        <p className="mt-2 sm:mt-3 text-[#191919] text-[13px] sm:text-[15px]">
          {subtitle}
        </p>
 
        {/* Spec rows */}
        <div className="mt-5 sm:mt-6">
          {visibleSpecs.map((spec, idx) => (
            <div
              key={spec.label + idx}
              className="grid grid-cols-2 gap-4 py-3 sm:py-3.5 border-b border-slate-100"
            >
              <span className="text-[13px] sm:text-[15px] font-semibold text-[#191919]">
                {spec.label}
              </span>
              <span className="text-[13px] sm:text-[15px] text-slate-400">
                {spec.value}
              </span>
            </div>
          ))}
        </div>
 
        {/* Show more / less */}
        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-4 inline-flex items-center gap-1 text-[#155DFC] text-[13px] sm:text-[15px] font-medium cursor-pointer select-none"
          >
            {expanded ? "Show Less" : "Show More"}
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                expanded ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        )}
      </div>
    </section>
  );
};

const WaterCooler = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const pinRef = useRef(null);

  // working in desktop
  // useLayoutEffect(() => {
  // const ctx = gsap.context(() => {
  //   ScrollTrigger.create({
  //     trigger: sectionRef.current,
  //     pin: pinRef.current,
  //     start: "top top+=100",
  //     end: "bottom bottom-=100",
  //     pinSpacing: true,
  //     anticipatePin: 1,
  //     invalidateOnRefresh: true,
  //   });

  //   ScrollTrigger.refresh();
  // }, sectionRef);

  //   return () => ctx.revert();
  // }, []);

  // working in small laptop
  // useLayoutEffect(() => {
  //   const ctx = gsap.context(() => {
  //     ScrollTrigger.create({
  //       trigger: sectionRef.current,
  //       pin: pinRef.current,
  //       start: "top -=130",
  //       end: "bottom bottom",
  //       pinSpacing: false,
  //       anticipatePin: 1,
  //       invalidateOnRefresh: true,
  //       markers: true, // remove after testing
  //     });

  //     ScrollTrigger.refresh();
  //   }, sectionRef);

  //   return () => ctx.revert();
  // }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          pin: pinRef.current,
          start: "top top-=130",
          end: () =>
            `+=${sectionRef.current.offsetHeight - pinRef.current.offsetHeight - 100}`,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
      });

      ScrollTrigger.refresh();

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  return (
    <main className="w-full overflow-x-hidden pt-20 lg:pt-20">
      {/* Hero Banner */}
      <div
        className="relative w-full overflow-hidden
      aspect-[4/5]
      sm:aspect-[16/10]
      lg:aspect-[1440/572]"
      >
        <img
          src={banner1}
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

      {/* water cooler */}
      <section className="bg-[#FFFFFF] py-10 sm:py-12">
        <div className="primary-container">
          {/* Heading */}
          <div className="w-full mb-10 flex flex-col items-center justify-center">
            <h2 className="heading text-2xl lg:text-4xl font-semibold text-[#191919]">
              Aqualife Water Cooler
            </h2>

            <p className="mt-3 text-[gray] text-[11px] lg:text-sm">
              Choose Water Cooler that best suits your needs & budget
            </p>
          </div>
        </div>

        {/* Product grid — 2 columns on mobile, scaling up smoothly */}
        <div className="bg-[#F6FAFF] py-10 sm:py-12">
          <div className="primary-container">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
              {PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Cooler */}
      <section ref={sectionRef} className="bg-white mb-5">
        <div className="primary-container">
          <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <h2 className="heading text-3xl lg:text-4xl font-semibold text-[#191919] leading-tight">
              Experience Pure Water with Advanced Cooling Technology
            </h2>
            <p className="mt-4 text-[#626C7A] text-sm lg:text-[16px] max-w-xl mx-auto">
              Smart RO & UV purification combined with powerful cooling for safe
              and refreshing hydration.
            </p>
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left Cards */}
            <div className="order-2 lg:order-1 space-y-6">
              {COOLER_FEATURES.map((feature) => (
                <div
                  key={feature.id}
                  className={`rounded-3xl p-6 lg:p-8 ${feature.bg}`}
                >
                  <h3 className="heading text-lg font-semibold text-[#191919]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-[#626C7A] lg:text-[16px] leading-7">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Image */}
            <div className="order-1 lg:order-2">
              <div ref={pinRef} className="flex justify-center">
                <img
                  src={coller2}
                  alt="Water Cooler"
                  className="w-full max-w-[500px] lg:max-h-[500px] 2xl:max-h-[800px] object-contain"
                  onLoad={() => ScrollTrigger.refresh()}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* banners */}
      <section className="bg-white">
        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left */}
          <div className="overflow-hidden">
            <img
              src={coolerPeople}
              alt="Office Water Cooler"
              className="w-full h-[260px] sm:h-[350px] md:h-[420px] lg:h-[520px] object-cover transition duration-500 hover:scale-105"
            />
          </div>

          {/* Right */}
          <div className="overflow-hidden">
            <img
              src={coolerSchool}
              alt="School Water Cooler"
              className="w-full h-[260px] sm:h-[350px] md:h-[420px] lg:h-[520px] object-cover transition duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

<ProductSpecTable/>
      
    </main>
  );
};

export default WaterCooler;
