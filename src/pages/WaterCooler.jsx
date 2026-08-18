import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import banner1 from "../assets/product_listing_banner.png";
import Breadcrumb from "../components/Breadcrumb";
import coller1 from "../assets/water-cooler_1.png";
import coller2 from "../assets/water-cooler_2.png";
import coller3 from "../assets/water-cooler_3.png";
import { WaterButton } from "../components/WaterButton";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import coolerPeople from "../assets/water_cooler_banner_1.jpg";
import coolerSchool from "../assets/water_cooler_banner_2.jpg";
import { ChevronDown } from "lucide-react";
import WaterPurifierInfo from "../components/WaterPurifierInfo";
import EnquireModal from "../components/EnquireModal";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    name: "Mars",
    description: "UV+UF+Copper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
  },
  {
    id: 3,
    image: coller3,
    badge: null,
    name: "Jupiter",
    description: "UV+UF+Copper & zinc water purifier",
    price: 28999,
    mrp: 39000,
    discount: 25,
  },
  {
    id: 4,
    image: coller2,
    badge: null,
    name: "Saturn",
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
  {
    label: "Compressor",
    value:
      "Hematic with suction gas cooled motor with overloaded protector",
  },
  { label: "Condenser Fan", value: "Propeller Type" },
  { label: "Refrigerant", value: "R134a (Eco-friendly)" },
  { label: "Body Material", value: "Mild Steel with Powder Coating" },
  { label: "Net Weight", value: "32 Kg" },
  { label: "Warranty", value: "1 Year Comprehensive" },
];

const waterCoolerContent = {
  eyebrow: "Why Choose a Water Cooler",
  heroTitle: "Why Do You Need a Water Purifier?",
  heroImageAlt: "Aqualife water cooler in a commercial setting",
  paragraphs: [
    "Providing access to clean and chilled drinking water is essential in workplaces, educational institutions, healthcare facilities, commercial buildings, and public spaces. During hot weather and long working hours, people require easy access to drinking water to stay refreshed and hydrated throughout the day.",
    "A water cooler offers a convenient solution by providing a continuous supply of cool drinking water without the need for refrigeration or storage of bottled water. Whether installed in an office, school, hospital, factory, showroom, or commercial facility, a water cooler helps improve convenience and ensures drinking water is readily available whenever needed.",
    "Water coolers are designed to deliver chilled drinking water quickly and efficiently, making them suitable for environments with regular water consumption. They can support multiple users throughout the day while reducing the need for individual water bottles and manual cooling methods.",
    "Modern water coolers are available in different capacities and configurations, allowing businesses and organisations to choose a system based on the number of users, installation space, and daily water requirements.",
  ],
  sectionTitle: "How to Choose the Right Water Purifier",
  sectionSubtitle: "",
};

const waterCoolerCards = [
  {
    icon: "Users",
    title: "Based on User Capacity",
    body: "The number of people using the water cooler is one of the most important considerations. Small offices may require compact water coolers, while schools, hospitals, factories, and commercial facilities often need higher-capacity models capable of serving a larger number of users throughout the day.",
  },
  {
    icon: "Waves",
    title: "Based on Cooling Capacity",
    body: "Different water coolers are designed to produce different amounts of chilled water per hour. Choosing the appropriate cooling capacity ensures that users have access to cold drinking water even during peak usage periods.",
  },
  {
    icon: "Layers",
    title: "Based on Installation Location",
    body: "Water coolers are available in various designs, including floor-standing and wall-mounted models. The available space and usage environment should be considered when selecting a suitable system for your facility.",
  },
  {
    icon: "Droplet",
    title: "Based on Water Storage Requirements",
    body: "Facilities with high daily water consumption may require larger storage tanks to ensure a continuous supply of chilled water. Selecting the right storage capacity helps maintain consistent availability during busy hours.",
  },
  {
    icon: "Layers",
    title: "Based on Commercial or Industrial Usage",
    body: "Commercial and industrial environments often require heavy-duty water coolers designed for continuous operation. Choosing a model suited to your usage requirements can help improve efficiency and long-term performance.",
  },
];

/* ── Product card ── */
function ProductCard({ product, setCardRef, onEnquireClick }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) setCardRef(cardRef.current);
  }, [setCardRef]);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -6,
      boxShadow: "0 12px 24px rgba(15, 23, 42, 0.08)",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(imgRef.current, { scale: 1.06, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: "0 0px 0px rgba(15, 23, 42, 0)",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(imgRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
  };

  const handleEnquireClick = () => {
    if (onEnquireClick) {
      onEnquireClick(product);
    }
  };

  return (
    <div
      ref={cardRef}
      className="bg-white cursor-pointer rounded-2xl border border-slate-100 p-3 sm:p-5 flex flex-col h-full select-none justify-between"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative bg-white rounded-xl flex items-center justify-center h-25 sm:h-52 mb-3 sm:mb-4 overflow-hidden">
        {product.badge && (
          <span className="absolute top-1.5 left-1.5 z-10 bg-slate-100 text-slate-500 text-[10px] sm:text-[11px] font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
            {product.badge}
          </span>
        )}
        <img
          ref={imgRef}
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

      {/* Action row */}
      <div className="flex gap-1 mt-auto">
        <WaterButton
          variant="primary"
          className="flex-1 py-1 px-3 sm:py-2.5 text-[11px] sm:text-sm"
          onClick={handleEnquireClick}
        >
          Enquiry Now
        </WaterButton>
      </div>
    </div>
  );
}

/* ── Spec table ── */
const VISIBLE_COUNT = 11;

const ProductSpecTable = ({
  title = "Water Cooler – Inbuilt RO and UV Water Purifier",
  subtitle = "Available Capacity: 20 / 40 / 80 / 150 / 200 Ltr.",
  specs = SPECS,
}) => {
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef(null);
  const rowRefs = useRef([]);
  rowRefs.current = [];
  const addRowRef = (el) => {
    if (el && !rowRefs.current.includes(el)) rowRefs.current.push(el);
  };

  const hasMore = specs.length > VISIBLE_COUNT;
  const visibleSpecs = expanded ? specs : specs.slice(0, VISIBLE_COUNT);

  useEffect(() => {
    if (!rowRefs.current.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rowRefs.current,
        { opacity: 0, x: -16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [expanded]);

  return (
    <section ref={sectionRef} className="bg-[#FFFFFF] py-8 sm:py-10">
      <div className="primary-container">
        <h2 className="heading text-xl sm:text-2xl lg:text-[28px] font-bold text-[#191919] leading-tight">
          {title}
        </h2>
        <p className="mt-2 sm:mt-3 text-[#191919] text-[13px] sm:text-[15px]">
          {subtitle}
        </p>

        <div className="mt-5 sm:mt-6">
          {visibleSpecs.map((spec, idx) => (
            <div
              key={spec.label + idx}
              ref={addRowRef}
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

/* ── Page ── */
const WaterCooler = () => {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const productHeadingRef = useRef(null);
  const productGridRef = useRef(null);
  const featureHeadingRef = useRef(null);
  const featuresWrapRef = useRef(null);
  const splitImgWrapRef = useRef(null);
  const heroWrapRef = useRef(null);
  const heroImgRef = useRef(null);

  const cardRefs = useRef([]);
  const addCardRef = (el) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };

  // Modal state
  const [isEnquireOpen, setIsEnquireOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openEnquireModal = (product = null) => {
    setSelectedProduct(product);
    setIsEnquireOpen(true);
  };

  const closeEnquireModal = () => {
    setIsEnquireOpen(false);
    // Delay clearing selected product to allow for smooth transition
    setTimeout(() => setSelectedProduct(null), 300);
  };

  // Pin animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          pin: pinRef.current,
          start: "top top-=130",
          end: () =>
            `+=${
              sectionRef.current.offsetHeight -
              pinRef.current.offsetHeight -
              100
            }`,
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

  /* Product heading + grid reveal */
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (productHeadingRef.current) {
        gsap.fromTo(
          productHeadingRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: productHeadingRef.current,
              start: "top 88%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      if (cardRefs.current.length) {
        gsap.fromTo(
          cardRefs.current,
          { opacity: 0, y: 32, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: productGridRef.current,
              start: "top 88%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  /* Hero image zoom-in */
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } }).fromTo(
        heroImgRef.current,
        { scale: 1.15 },
        { scale: 1, duration: 1.6 }
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
        className="relative w-full overflow-hidden aspect-[4/5] sm:aspect-[16/10] lg:aspect-[1440/572]"
      >
        <img
          src={banner1}
          ref={heroImgRef}
          alt="Water Cooler Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-2 lg:top-14 left-0 w-full z-10">
          <div className="primary-container">
            <Breadcrumb />
          </div>
        </div>
      </div>

      {/* Product listing */}
      <section className="bg-[#FFFFFF] py-10 sm:py-12">
        <div className="primary-container">
          <div
            ref={productHeadingRef}
            className="w-full mb-10 flex flex-col items-center justify-center"
          >
            <h2 className="heading text-2xl lg:text-4xl font-semibold text-[#191919]">
              Aqualife Water Cooler
            </h2>
            <p className="mt-3 text-[gray] text-[11px] lg:text-sm">
              Choose Water Cooler that best suits your needs & budget
            </p>
          </div>
        </div>

        <div className="bg-[#F6FAFF] py-10 sm:py-12">
          <div className="primary-container">
            <div
              ref={productGridRef}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5"
            >
              {PRODUCTS.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  setCardRef={addCardRef}
                  onEnquireClick={openEnquireModal}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Cooler */}
      <section ref={sectionRef} className="bg-white mb-5">
        <div className="primary-container">
          <div
            ref={featureHeadingRef}
            className="max-w-3xl mx-auto text-center mb-12 lg:mb-16"
          >
            <h2 className="heading text-3xl lg:text-4xl font-semibold text-[#191919] leading-tight">
              Experience Pure Water with Advanced Cooling Technology
            </h2>
            <p className="mt-4 text-[#626C7A] text-sm lg:text-[16px] max-w-xl mx-auto">
              Smart RO & UV purification combined with powerful cooling for safe
              and refreshing hydration.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            <div ref={featuresWrapRef} className="order-2 lg:order-1 space-y-6">
              {COOLER_FEATURES.map((feature) => (
                <div                  key={feature.id}
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

            <div className="order-1 lg:order-2">
              <div ref={pinRef} className="flex justify-center">
                <img
                  src={coller2}
                  loading="lazy"
                  alt="Water Cooler"
                  className="w-full max-w-[500px] max-h-[400px] lg:max-h-[500px] 2xl:max-h-[800px] object-contain"
                  onLoad={() => ScrollTrigger.refresh()}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Split images */}
      <section className="bg-white">
        <div ref={splitImgWrapRef} className="grid grid-cols-1 md:grid-cols-2">
          <div className="overflow-hidden h-[350px] sm:h-[400px] md:h-[420px] lg:h-[600px] 2xl:h-[950px]">
            <img
              loading="lazy"
              src={coolerPeople}
              alt="Office Water Cooler"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="overflow-hidden h-[350px] sm:h-[400px] md:h-[420px] lg:h-[600px] 2xl:h-[950px]">
            <img
              loading="lazy"
              src={coolerSchool}
              alt="School Water Cooler"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      <ProductSpecTable />

      <WaterPurifierInfo
        content={waterCoolerContent}
        cards={waterCoolerCards}
      />

      {/* Enquiry Modal */}
      <EnquireModal
        isOpen={isEnquireOpen}
        onClose={closeEnquireModal}
        productName={selectedProduct?.name}
      />
    </main>
  );
};

export default WaterCooler;